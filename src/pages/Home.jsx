import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Sun, Moon, LogOut, Search, Bell, Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import LazyImage from "../components/LazyImage";
import { PostSkeleton } from "../components/LoadingSkeleton";

export default function Home() {
  const { user, profile } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  const toggleTheme = useCallback(() => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

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
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <MessageCircle className="text-primary" size={28} />
            Chats
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input type="text" placeholder="Search" className="w-full h-10 pl-10 pr-4 bg-muted/50 rounded-full border-transparent focus:bg-background focus:border-border outline-none text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-muted transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2.5 rounded-full hover:bg-muted transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
            </button>
            <button onClick={() => signOut(auth)} className="p-2.5 rounded-full hover:bg-destructive/10 text-destructive transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16 max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 p-6 border-r border-border/50 h-[calc(100vh-4rem)] sticky top-16">
          <nav className="space-y-2">
            <NavItem icon={<MessageCircle size={24} />} label="Feed" active />
            <NavItem icon={<Search size={24} />} label="Explore" href="/search" />
            <NavItem icon={<Bell size={24} />} label="Notifications" />
            <NavItem icon={<MessageCircle size={24} />} label="Messages" href="/chat" />
            <NavItem icon={<Bookmark size={24} />} label="Bookmarks" />
            <NavItem icon={<MessageCircle size={24} />} label="Profile" href="/profile" />
          </nav>
          
          <Link to="/create" className="mt-8 w-full bg-primary text-primary-foreground py-3 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Plus size={20} /> Create Post
          </Link>
        </aside>

        {/* Feed */}
        <main className="flex-1 max-w-2xl mx-auto p-4">
          {/* Stories */}
          <div className="flex gap-4 overflow-x-auto pb-4 mb-6 scrollbar-hide">
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
              Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
            ) : (
              posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <img src={post.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`} alt="" className="w-10 h-10 rounded-full bg-muted" />
                      <div>
                        <h4 className="font-semibold text-sm">{post.username}</h4>
                        <p className="text-xs text-muted-foreground">2h ago</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-muted rounded-full"><MoreHorizontal size={20} /></button>
                  </div>

                  {post.image && (
                    <div className="aspect-square bg-muted">
                      <LazyImage src={post.image} alt="Post" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <button onClick={() => handleLike(post.id, post.likes)} className="group">
                          <Heart size={26} className={`transition-all ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500 scale-110' : 'hover:text-red-500'}`} />
                        </button>
                        <button><MessageSquare size={26} /></button>
                        <button><Share2 size={26} /></button>
                      </div>
                      <button><Bookmark size={26} /></button>
                    </div>
                    
                    <p className="text-sm mb-1"><span className="font-semibold">{post.likes || 0} likes</span></p>
                    {post.caption && (
                      <p className="text-sm"><span className="font-semibold mr-2">{post.username}</span>{post.caption}</p>
                    )}
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, href = "#" }) {
  return (
    <Link to={href} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${active ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
      {icon}
      <span className="text-lg">{label}</span>
    </Link>
  );
}