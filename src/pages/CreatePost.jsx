import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageIcon, Loader2, ArrowLeft } from "lucide-react";
import imageCompression from 'browser-image-compression';

export default function CreatePost() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (file && file.type.startsWith('image/')) {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(file, options);
        setImage(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Compression error:', error);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!image || !user) return;
    setLoading(true);

    try {
      // Path must match storage.rules: /posts/{userId}/{fileId}
      const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);

      await addDoc(collection(db, "posts"), {
        image: url,
        caption,
        userId: user.uid,
        username: profile?.username || user.displayName || "Anonymous",
        userPhoto: profile?.photoURL || user.photoURL || "",
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp()
      });

      navigate('/home');
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="flex items-center gap-4 mb-6 max-w-xl mx-auto">
        <button onClick={() => navigate(-1)}><ArrowLeft /></button>
        <h1 className="text-xl font-bold">New Post</h1>
      </header>

      <main className="max-w-xl mx-auto">
        <motion.div layout className="bg-card border border-border rounded-3xl overflow-hidden">
          <div className="p-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows={3}
              className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder:text-muted-foreground/50"
            />
          </div>
          
          <div className="border-t border-border/50">
            <AnimatePresence>
              {!imagePreview ? (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()} 
                  className="h-64 flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    className="hidden"
                  />
                  <ImageIcon size={40} className="mb-2 opacity-50" />
                  <p>Drag photos or click to upload</p>
                </div>
              ) : (
                <div className="relative aspect-square bg-muted">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => {setImage(null); setImagePreview(null);}}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 flex justify-end">
            <button 
              onClick={handlePost} 
              disabled={!image || loading}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Share"}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}