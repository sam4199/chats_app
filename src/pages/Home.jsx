import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  MessageCircle, 
  Sun, 
  Moon, 
  LogOut, 
  Plus, 
  Search,
  Bell,
  TrendingUp,
  CheckCircle2,
  Loader2,
  Heart,
  MoreHorizontal,
  Share2
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { 
  doc, 
  getDoc, 
  getDocs, 
  collection, 
  updateDoc, 
  arrayUnion,
  query,
  limit,
  where
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header 
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out border-b",
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl border-border/50 shadow-sm" 
            : "bg-background border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="relative">
              <MessageCircle 
                size={28} 
                className="text-primary transition-transform group-hover:rotate-12" 
                strokeWidth={2.5}
              />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Chats
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" 
                size={18} 
              />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-transparent rounded-full text-sm placeholder:text-muted-foreground focus:bg-background focus:border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={toggleTheme}
              className="relative p-2.5 rounded-full hover:bg-muted transition-all duration-200 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              className="relative p-2.5 rounded-full hover:bg-muted transition-all duration-200 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 hidden sm:flex"
            >
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-background" />
            </button>

            <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

            <button 
              onClick={() => signOut(auth)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto flex">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 px-4 border-r border-border/50">
              <Sidebar />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center gap-6 mb-6 border-b border-border/50">
                {["for-you", "following"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "relative pb-3 text-sm font-medium capitalize transition-colors",
                      activeTab === tab 
                        ? "text-foreground" 
                        : "text-muted-foreground hover:text-foreground/80"
                    )}
                  >
                    {tab.replace("-", " ")}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {stories.map((story) => (
                    <button
                      key={story.id}
                      className="flex flex-col items-center gap-2 shrink-0 snap-start group focus:outline-none"
                    >
                      <div 
                        className={cn(
                          "relative p-[2px] rounded-full transition-all duration-300",
                          story.hasStory 
                            ? "bg-gradient-to-tr from-yellow-400 via-orange-500 to-purple-600 group-hover:scale-105" 
                            : "border-2 border-dashed border-muted-foreground/30 group-hover:border-muted-foreground/50"
                        )}
                      >
                        <div className="w-16 h-16 rounded-full bg-card border-2 border-background flex items-center justify-center text-sm font-semibold overflow-hidden">
                          {story.isUser ? (
                            <div className="flex flex-col items-center text-muted-foreground">
                              <Plus size={24} strokeWidth={2.5} />
                            </div>
                          ) : (
                            <span className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary w-full h-full flex items-center justify-center text-lg">
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
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm transition-all hover:border-border/80">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center font-bold text-lg ring-2 ring-transparent">
                        JD
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                          JD 
                          <CheckCircle2 size={14} className="text-blue-500 fill-blue-500" />
                        </p>
                        <p className="text-xs text-muted-foreground">2h ago</p>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                  
                  <p className="text-sm text-foreground mb-4 leading-relaxed">
                    Just exploring this amazing new app layout! The dark mode toggle is super smooth, and the new color theme looks incredibly professional.
                  </p>
                  
                  <div className="flex items-center gap-6 pt-4 border-t border-border/50">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-rose-500 transition-colors group">
                      <Heart size={18} className="group-hover:fill-rose-500 group-hover:text-rose-500 transition-all" />
                      <span className="text-sm font-medium">124</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                      <MessageCircle size={18} className="group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium">24</span>
                    </button>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
                      <Share2 size={18} className="group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <aside className="hidden xl:block w-80 shrink-0">
            <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 px-4">
              <div className="space-y-6">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp size={16} className="text-primary" />
                      Suggested for you
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-2 w-16" />
                          </div>
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      ))
                    ) : suggestions.length > 0 ? (
                      suggestions.map((u) => {
                        const isFollowing = currentUserData?.following?.includes(u.id);
                        const isLoadingFollow = followLoading === u.id;

                        return (
                          <div 
                            key={u.id} 
                            className="flex items-center justify-between group p-2 -mx-2 rounded-xl hover:bg-muted/50 transition-colors"
                          >
                            <Link 
                              to={`/profile/${u.username}`}
                              className="flex items-center gap-3 flex-1 min-w-0"
                            >
                              <div className="relative">
                                <img 
                                  src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                                  alt={u.fullName}
                                  className="w-10 h-10 rounded-full bg-muted object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
                                  loading="lazy"
                                />
                                {u.isVerified && (
                                  <CheckCircle2 
                                    size={12} 
                                    className="absolute -bottom-0.5 -right-0.5 text-blue-500 fill-blue-500 text-background" 
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
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
                              <button
                                onClick={() => handleFollow(u.id)}
                                disabled={isLoadingFollow}
                                className={cn(
                                  "text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200",
                                  "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
                                  "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                              >
                                {isLoadingFollow ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  "Follow"
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">You are all caught up!</p>
                        <p className="text-xs mt-1">No new suggestions</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground/60 space-y-2 px-2">
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <Link to="/about" className="hover:underline">About</Link>
                    <Link to="/privacy" className="hover:underline">Privacy</Link>
                    <Link to="/terms" className="hover:underline">Terms</Link>
                  </div>
                  <p>© 2026 Chats Inc.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 safe-area-pb">
        <MobileNav />
      </div>
    </div>
  );
}