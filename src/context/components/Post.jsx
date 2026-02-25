import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore";

export default function Post() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  const likePost = async (id, currentLikes) => {
    await updateDoc(doc(db, "posts", id), {
      likes: currentLikes + 1
    });
  };

  return (
    <>
      {posts.map(post => (
        <div key={post.id} className="post">
          <div className="post-header">
            <strong>{post.username}</strong>
          </div>
          <img src={post.imageUrl} />
          <div className="post-footer">
            ❤️ {post.likes}
            <button onClick={() => likePost(post.id, post.likes)}>
              Like
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
