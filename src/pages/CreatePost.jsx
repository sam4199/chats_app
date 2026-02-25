import { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function CreatePost() {
  const { user, profile } = useAuth();
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const handlePost = async (e) => {
    e.preventDefault();
    if (!image) return alert("Select image");

    const imageRef = ref(storage, `posts/${Date.now()}_${image.name}`);
    await uploadBytes(imageRef, image);
    const url = await getDownloadURL(imageRef);

    await addDoc(collection(db, "posts"), {
      image: url,
      caption,
      userId: user.uid,
      username: profile?.username,
      userPhoto: profile?.photoURL || "",
      timestamp: serverTimestamp()
    });

    alert("Posted successfully!");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 border rounded-lg shadow-sm">
      <form onSubmit={handlePost} className="flex flex-col gap-4">
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <textarea
          placeholder="Write a caption..."
          className="border p-2 rounded"
          onChange={(e) => setCaption(e.target.value)}
        />
        <button className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          Share Post
        </button>
      </form>
    </div>
  );
}
