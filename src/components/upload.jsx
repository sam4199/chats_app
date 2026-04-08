import { useState, useContext, useRef } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { Loader2, Image as ImageIcon, X } from "lucide-react";

export default function Upload() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { user, profile } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File is too large. Max size is 5MB.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const clearSelection = () => {
    setImage(null);
    setPreview(null);
    setCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadPost = async () => {
    if (!image || !user) return;
    setIsUploading(true);

    try {
      // FIX: Proper path matching storage rules /posts/{userId}/{fileName}
      const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);

      await addDoc(collection(db, "posts"), {
        imageUrl: url,
        caption: caption,
        userId: user.uid,
        // FIX: Extract the 0th index, otherwise it returns an Array which crashes text rendering
        username: profile?.username || user.email.split('@'), 
        userPhoto: profile?.photoURL || "",
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp()
      });

      clearSelection();
      alert("Post uploaded successfully!"); 
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-card border border-border p-5 rounded-3xl shadow-sm mb-6">
      <h3 className="font-semibold text-lg mb-4">Create New Post</h3>
      <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="hidden" />
      {preview ? (
        <div className="relative mb-4 group">
          <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-2xl border border-border" />
          <button onClick={clearSelection} className="absolute top-3 right-3 bg-black/60 p-1.5 rounded-full text-white hover:bg-black transition-colors" title="Remove image">
            <X size={18} />
          </button>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()} className="h-40 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all mb-4">
          <ImageIcon size={32} className="mb-2 opacity-50" />
          <span className="text-sm font-medium">Click to select an image</span>
          <span className="text-xs mt-1 opacity-70">PNG, JPG up to 5MB</span>
        </div>
      )}
      <textarea placeholder="Write a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full bg-muted/50 border border-transparent rounded-xl p-3 text-sm focus:bg-background focus:border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none mb-4" rows="2" />
      <button onClick={uploadPost} disabled={!image || isUploading} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-primary/20">
        {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</> : "Share Post"}
      </button>
    </div>
  );
}