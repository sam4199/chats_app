import { useState, useContext } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

export default function Upload() {
  const [image, setImage] = useState(null);
  const { user } = useContext(AuthContext);

  const uploadImage = async () => {
    if (!image) return;

    const imageRef = ref(storage, `posts/${image.name}`);
    await uploadBytes(imageRef, image);
    const url = await getDownloadURL(imageRef);

    await addDoc(collection(db, "posts"), {
      imageUrl: url,
      uid: user.uid,
      username: user.email,
      likes: 0,
      createdAt: serverTimestamp()
    });

    alert("Uploaded!");
  };

  return (
    <div className="upload-box">
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={uploadImage}>Upload</button>
    </div>
  );
}
