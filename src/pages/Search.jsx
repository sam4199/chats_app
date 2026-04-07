// Search.jsx
import { useState, useEffect, useContext } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search as SearchIcon, UserPlus, UserCheck, Loader2, 
  X, Filter, TrendingUp, Users
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

export default function Search() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      try {
        const currentUserSnap = await getDoc(doc(db, "users", user.uid));
        if (currentUserSnap.exists()) {
          setCurrentUserData(currentUserSnap.data());
        }

        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs
          .map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
          .filter(u => u.id !== user.uid)
          .sort((a, b) => (b.followers?.length || 0) - (a.followers?.length || 0));

        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const handleFollow = async (targetUserId) => {
    if (!user || !currentUserData) return;
    
    const isFollowing = currentUserData.following?.includes(targetUserId);
    const currentUserRef = doc(db, "users", user.uid);
    const targetUserRef = doc(db, "users", targetUserId);

    try {
      setCurrentUserData(prev => ({
        ...prev,
        following: isFollowing 
          ? prev.following.filter(id => id !== targetUserId)
          : [...(prev.following || []), targetUserId]
      }));

      if (isFollowing) {
        await updateDoc(currentUserRef, { following: arrayRemove(targetUserId) });
        await updateDoc(targetUserRef, { followers: arrayRemove(user.uid) });
      } else {
        await updateDoc(currentUserRef, { following: arrayUnion(targetUserId) });
        await updateDoc(targetUserRef, { followers: arrayUnion(user.uid) });
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trendingUsers = users.slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto flex gap-8 px-4 py-6 min-h-screen">
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-6">
            <Sidebar />
          </div>
        </aside>

        <section className="flex-1 max-w-2xl w-full mx-auto">
          {/* Search Header */}
          <div className="sticky top-0 bg-background/95 backdrop-blur-xl z-20 pb-4 pt-2">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for people..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-2xl pl-12 pr-12 py-4 focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none font-medium"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : searchQuery ? (
              // Search Results
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">
                  Results ({filteredUsers.length})
                </h2>
                <AnimatePresence>
                  {filteredUsers.length > 0 ? filteredUsers.map((u, i) => {
                    const isFollowing = currentUserData?.following?.includes(u.id);
                    return (
                      <motion.div 
                        key={u.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group"
                      >
                        <Link to={`/profile/${u.username}`} className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="relative">
                            <img 
                              src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                              alt={u.fullName}
                              className="w-14 h-14 rounded-full bg-muted object-cover ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
                            />
                            {u.isVerified && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-background">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                              {u.fullName}
                            </h3>
                            <p className="text-sm text-muted-foreground">@{u.username}</p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              {u.followers?.length || 0} followers
                            </p>
                          </div>
                        </Link>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleFollow(u.id)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all ${
                            isFollowing 
                              ? 'bg-muted text-foreground hover:bg-destructive/10 hover:text-destructive' 
                              : 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/25'
                          }`}
                        >
                          {isFollowing ? (
                            <><UserCheck size={18} /> Following</>
                          ) : (
                            <><UserPlus size={18} /> Follow</>
                          )}
                        </motion.button>
                      </motion.div>
                    );
                  }) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No users found matching "{searchQuery}"</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // Trending / Suggested
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      Trending Now
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {trendingUsers.map((u, i) => (
                      <motion.div 
                        key={u.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-4 bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl hover:bg-card/50 transition-all"
                      >
                        <Link to={`/profile/${u.username}`} className="flex items-center gap-3 flex-1">
                          <span className="text-lg font-bold text-muted-foreground w-6">0{i + 1}</span>
                          <img 
                            src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                            alt={u.fullName}
                            className="w-12 h-12 rounded-full bg-muted object-cover"
                          />
                          <div>
                            <h3 className="font-bold text-sm">{u.fullName}</h3>
                            <p className="text-xs text-muted-foreground">@{u.username}</p>
                          </div>
                        </Link>
                        <span className="text-xs font-medium text-muted-foreground">
                          {u.followers?.length || 0} followers
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNav />
      </div>
    </div>
  );
}