import { useState, useEffect, useContext } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { Search as SearchIcon, UserPlus, UserCheck, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import MobileNav from "../components/MobileNav";

export default function Search() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      try {
        const currentUserSnap = await getDoc(doc(db, "users", user.uid));
        if (currentUserSnap.exists()) {
          setCurrentUserData(currentUserSnap.data());
        }

        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = [];
        querySnapshot.forEach((docSnap) => {
          if (docSnap.id !== user.uid) {
            usersList.push({ id: docSnap.id, ...docSnap.data() });
          }
        });
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
      // Optimistic UI update for snappy feel
      setCurrentUserData(prev => ({
        ...prev,
        following: isFollowing 
          ? prev.following.filter(id => id !== targetUserId)
          : [...(prev.following || []), targetUserId]
      }));

      // Update Database Arrays
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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300 pb-20 md:pb-0">
      <main className="flex-1 max-w-7xl mx-auto w-full flex gap-8 px-4 py-6">
        <aside className="hidden md:block w-64 shrink-0">
          <Sidebar />
        </aside>
        <section className="flex-1 max-w-2xl w-full mx-auto space-y-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search for friends..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.length > 0 ? filteredUsers.map(u => {
                const isFollowing = currentUserData?.following?.includes(u.id);
                return (
                  <div key={u.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <img src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt="avatar" className="w-12 h-12 rounded-full bg-muted object-cover" />
                      <div>
                        <h3 className="font-bold">{u.fullName}</h3>
                        <p className="text-sm text-muted-foreground">@{u.username}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleFollow(u.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${isFollowing ? 'bg-muted text-foreground hover:bg-destructive/10 hover:text-destructive' : 'bg-primary text-primary-foreground hover:opacity-90'}`}
                    >
                      {isFollowing ? <><UserCheck size={18} /> Following</> : <><UserPlus size={18} /> Follow</>}
                    </button>
                  </div>
                );
              }) : (
                <p className="text-center text-muted-foreground py-10">No users found.</p>
              )}
            </div>
          )}
        </section>
      </main>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNav />
      </div>
    </div>
  );
}