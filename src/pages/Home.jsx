// Home.jsx
import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, Sun, Moon, LogOut, Plus, Search,
  Bell, TrendingUp, CheckCircle2, Loader2, Heart,
  MessageSquare, Share2, Bookmark, MoreHorizontal
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { 
  doc, getDoc, getDocs, collection, updateDoc, arrayUnion,
  query, limit, where, orderBy, onSnapshot
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";
import Upload from "../components/Upload";
import Feed from "../components/Feed";

function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

const Skeleton = ({ className }) => (
  <div className={cn("animate-pulse bg-muted rounded-md", className)} />
);

export default function Home() {
  const { user } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(() => 
    document.documentElement.classList.contains("dark")
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("for-you");
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const currentUserSnap = await getDoc(doc(db, "users", user.uid));
        let following = [];
        
        if (currentUserSnap.exists()) {
          const data = currentUserSnap.data();
          setCurrentUserData(data);
          following = data.following || [];
        }

        const usersQuery = query(
          collection(db, "users"),
          where("__name__", "!=", user.uid),
          limit(10)
        );
        
        const usersSnap = await getDocs(usersQuery);
        const suggestedList = usersSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(u => !following.includes(u.id))
          .slice(0, 5);

        setSuggestions(suggestedList);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSuggestions();
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
      setPostsLoading(false);
    }, (error) => {
      console.error("Error fetching posts:", error);
      setPostsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const newMode = !isDarkMode;
    
    if (newMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setIsDarkMode(newMode);
  }, [isDarkMode]);

  const handleFollow = async (targetUserId) => {
    if (!user || !currentUserData || followLoading) return;
    
    setFollowLoading(targetUserId);
    try {
      setCurrentUserData(prev => ({
        ...prev,
        following: [...(prev.following || []), targetUserId]
      }));
      
      await updateDoc(doc(db, "users", user.uid), {
        following: arrayUnion(targetUserId)
      });
      
      await updateDoc(doc(db, "users", targetUserId), {
        followers: arrayUnion(user.uid)
      });
    } catch (error) {
      console.error("Error following:", error);
      setCurrentUserData(prev => ({
        ...prev,
        following: prev.following?.filter(id => id !== targetUserId) || []
      }));
    } finally {
      setFollowLoading(null);
    }
  };

  const stories = [
    { id: 1, name: "Your story", img: null, isUser: true },
    { id: 2, name: "varsha_j", img: "VJ", hasStory: true },
    { id: 3, name: "snaxgaming", img: "SG", hasStory: true },
    { id: 4, name: "tech_lead", img: "TL", hasStory: true },
    { id: 5, name: "design_daily", img: "DD", hasStory: false },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 border-b",
          isScrolled 
            ? "bg-background/80 backdrop-blur-xl border-border/50 shadow-lg shadow-primary/5" 
            : "bg-transparent border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ rotate: 12 }}
              className="bg-gradient-to-br from-primary to-purple-600 text-white p-2 rounded-xl shadow-lg shadow-primary/20"
            >
              <MessageCircle size={24} strokeWidth={2.5} />
            </motion.div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Chats
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full h-11 pl-10 pr-4 bg-muted/50 border border-border rounded-full text-sm placeholder:text-muted-foreground focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground hidden sm:flex"
            >
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-background animate-pulse" />
              )}
            </motion.button>

            <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signOut(auth)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign out</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Layout */}
      <div className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto flex gap-8 px-4">
          {/* Left Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto py-4">
              <Sidebar />
            </div>
          </aside>

          {/* Center Feed */}
          <main className="flex-1 min-w-0 max-w-2xl">
            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 bg-card/50 backdrop-blur-sm p-1 rounded-2xl border border-border/50">
              {["for-you", "following"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-semibold capitalize rounded-xl transition-all",
                    activeTab === tab 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {tab.replace("-", " ")}
                </button>
              ))}
            </div>

            {/* Stories */}
            <div className="mb-8">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {stories.map((story, i) => (
                  <motion.button
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center gap-2 shrink-0 snap-start group"
                  >
                    <div className={cn(
                      "relative p-[3px] rounded-full transition-all duration-300",
                      story.hasStory 
                        ? "bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600 group-hover:scale-105" 
                        : "border-2 border-dashed border-muted-foreground/30 group-hover:border-primary/50"
                    )}>
                      <div className="w-16 h-16 rounded-full bg-card border-2 border-background flex items-center justify-center overflow-hidden">
                        {story.isUser ? (
                          <div className="flex flex-col items-center text-muted-foreground group-hover:text-primary transition-colors">
                            <Plus size={24} strokeWidth={2.5} />
                          </div>
                        ) : (
                          <span className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary w-full h-full flex items-center justify-center text-lg font-bold">
                            {story.img}
                          </span>
                        )}
                      </div>
                      {story.isUser && (
                        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 border-2 border-background">
                          <Plus size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors max-w-[72px] truncate">
                      {story.name}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Upload & Feed */}
            <div className="space-y-6">
              <Upload />
              
              {postsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <Feed posts={posts} />
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto py-4 space-y-6">
              {/* Suggestions Card */}
              <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-lg shadow-primary/5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    Suggested for you
                  </h3>
                  <button className="text-xs font-semibold text-primary hover:underline">See All</button>
                </div>

                <div className="space-y-4">
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-11 h-11 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-2 w-16" />
                        </div>
                        <Skeleton className="h-7 w-16 rounded-full" />
                      </div>
                    ))
                  ) : suggestions.length > 0 ? (
                    suggestions.map((u, i) => {
                      const isFollowing = currentUserData?.following?.includes(u.id);
                      const isLoadingFollow = followLoading === u.id;

                      return (
                        <motion.div 
                          key={u.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors"
                        >
                          <Link to={`/profile/${u.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative">
                              <img 
                                src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                                alt={u.fullName}
                                className="w-11 h-11 rounded-full bg-muted object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
                              />
                              {u.isVerified && (
                                <CheckCircle2 size={14} className="absolute -bottom-0.5 -right-0.5 text-blue-500 fill-blue-500 bg-background rounded-full" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                {u.fullName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                @{u.username}
                              </p>
                            </div>
                          </Link>

                          {isFollowing ? (
                            <span className="text-xs font-medium text-muted-foreground px-3 py-1.5">
                              Following
                            </span>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleFollow(u.id)}
                              disabled={isLoadingFollow}
                              className="text-xs font-semibold px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50"
                            >
                              {isLoadingFollow ? <Loader2 size={14} className="animate-spin" /> : "Follow"}
                            </motion.button>
                          )}
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 size={32} className="mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium">All caught up!</p>
                      <p className="text-xs mt-1">No new suggestions</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Links */}
              <div className="text-xs text-muted-foreground/60 space-y-3 px-2">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {['About', 'Privacy', 'Terms', 'Help', 'API'].map((link) => (
                    <Link key={link} to={`/${link.toLowerCase()}`} className="hover:text-foreground transition-colors">
                      {link}
                    </Link>
                  ))}
                </div>
                <p>© 2026 Chats Inc. All rights reserved.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 safe-area-pb">
        <MobileNav />
      </div>
    </div>
  );
}