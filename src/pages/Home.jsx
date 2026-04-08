import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import { Loader2, Plus, MessageCircle, Search, Bell, MessageSquare, Share2, Bookmark, MoreHorizontal, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const { user, profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLike = async (postId, currentLikes) => {
    const isLiked = likedPosts.has(postId);
    const postRef = doc(db, "posts", postId);
    
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      isLiked ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });

    try {
      await updateDoc(postRef, {
        likes: isLiked ? (currentLikes || 0) - 1 : (currentLikes || 0) + 1
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const stories = [
    { id: 1, name: "Your story", isUser: true },
    { id: 2, name: "alex_d", img: "AD", hasStory: true },
    { id: 3, name: "sarah_j", img: "SJ", hasStory: true },
    { id: 4, name: "mike_t", img: "MT", hasStory: false },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Mobile Navbar (Only visible on small screens) */}
      <header className="lg:hidden fixed top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl h-14 flex items-center justify-between px-4">
        <span className="font-bold text-xl">Chats</span>
        <div className="flex items-center gap-4">
           <Link to="/chat"><MessageCircle size={24} /></Link>
           <img src={profile?.photoURL || user?.photoURL} alt="Profile" className="w-8 h-8 rounded-full bg-muted" />
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="pt-14 lg:pt-0 flex max-w-7xl mx-auto">
        
        {/* Sidebar (Desktop) is fixed in the component, so we leave space for it */}
        <div className="hidden lg:block w-64 shrink-0"></div>

        {/* Feed Section */}
        <main className="flex-1 max-w-2xl mx-auto p-4 w-full">
          
          {/* Stories */}
          <div className="flex gap-4 overflow-x-auto pb-4 mb-6 scrollbar-hide border-b border-border/50">
            {stories.map((story) => (
              <button key={story.id} className="flex flex-col items-center gap-2 shrink-0">
                <div className={`p-[2px] rounded-full ${story.hasStory ? 'bg-gradient-to-tr from-yellow-400 to-purple-600' : 'border-2 border-dashed border-muted-foreground/30'}`}>
                  <div className="w-16 h-16 rounded-full bg-card border-2 border-background flex items-center justify-center overflow-hidden">
                    {story.isUser ? <Plus size={24} /> : <span className="text-lg font-bold text-primary">{story.img}</span>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{story.name}</span>
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onLike={handleLike} 
                  isLiked={likedPosts.has(post.id)}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}