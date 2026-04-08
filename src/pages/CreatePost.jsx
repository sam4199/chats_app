import { useState, useRef } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Image as ImageIcon, Loader2, Smile, MapPin, 
  Hash, ChevronDown, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';

export default function CreatePost() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
  handleFile(e.dataTransfer.files);
}
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!image || !user) return;

    setLoading(true);
    try {
      // FIX: Corrected path to match storage rules -> /posts/{userId}/{fileName}
      const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);

      await addDoc(collection(db, "posts"), {
        image: url,
        caption,
        userId: user.uid,
        username: profile?.username || user.email?.split('@'),
        userPhoto: profile?.photoURL || user.photoURL || "",
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp()
      });

      navigate('/home');
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg">Create Post</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-border/50">
            <img src={profile?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`} alt="Profile" className="w-10 h-10 rounded-full bg-muted object-cover" />
            <div>
              <p className="font-semibold text-sm">{profile?.username}</p>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                Public <ChevronDown size={14} />
              </button>
            </div>
          </div>

          <form onSubmit={handlePost} className="p-4 space-y-4">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What's on your mind?"
              rows={4}
              className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder:text-muted-foreground/50"
            />

            <AnimatePresence mode="wait">
              {!imagePreview ? (
                <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50 hover:bg-muted/30'}`}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?. && handleFile(e.target.files)} className="hidden" />
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={28} className="text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-foreground mb-1">Drag photos here</p>
                  <p className="text-sm text-muted-foreground">or click to browse</p>
                </motion.div>
              ) : (
                <motion.div key="preview" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative rounded-2xl overflow-hidden bg-muted group">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-96 object-contain" />
                  <button type="button" onClick={removeImage} className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <X size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
              <span className="text-sm font-medium text-muted-foreground">Add to your post</span>
              <div className="flex items-center gap-1">
                <button type="button" className="p-2 hover:bg-muted rounded-full text-yellow-500"><Smile size={20} /></button>
                <button type="button" className="p-2 hover:bg-muted rounded-full text-blue-500"><MapPin size={20} /></button>
                <button type="button" className="p-2 hover:bg-muted rounded-full text-green-500"><Hash size={20} /></button>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={!image || loading} className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sharing...</> : "Share Post"}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}