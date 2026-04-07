// Profile.jsx
import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  collection, query, where, getDocs, doc, getDoc, 
  updateDoc, setDoc 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  Settings, Grid, Bookmark, SquareUser, Loader2, LogOut, 
  Heart, MessageCircle, X, Sun, Moon, Camera, MapPin, 
  Link as LinkIcon, Calendar, CheckCircle2, Edit3, Share2
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    bio: "",
    photoURL: "",
    location: "",
    website: ""
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
        return;
      }
      fetchProfileData(user);
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchProfileData = async (user) => {
    try {
      const [userDoc, postsSnap] = await Promise.all([
        getDoc(doc(db, "users", user.uid)),
        getDocs(query(collection(db, "posts"), where("userId", "==", user.uid)))
      ]);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserProfile(data);
        setFormData({
          username: data.username || "",
          fullName: data.fullName || user.displayName || "",
          bio: data.bio || "",
          photoURL: data.photoURL || user.photoURL || "",
          location: data.location || "",
          website: data.website || ""
        });
      }

      const posts = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserPosts(posts);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.remove("dark");
    else root.classList.add("dark");
    localStorage.setItem("theme", isDarkMode ? "light" : "dark");
    setIsDarkMode(!isDarkMode);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const user = auth.currentUser;
      let newPhotoURL = formData.photoURL;

      if (imageFile) {
        const imageRef = ref(storage, `profiles/${user.uid}_${Date.now()}`);
        await uploadBytes(imageRef, imageFile);
        newPhotoURL = await getDownloadURL(imageRef);
      }

      await updateProfile(user, {
        displayName: formData.fullName,
        photoURL: newPhotoURL
      });

      const updatedData = {
        username: formData.username,
        fullName: formData.fullName,
        bio: formData.bio,
        photoURL: newPhotoURL,
        location: formData.location,
        website: formData.website
      };

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, updatedData);
      } else {
        await setDoc(userRef, { uid: user.uid, email: user.email, ...updatedData });
      }

      setUserProfile(prev => ({ ...prev, ...updatedData }));
      setIsEditModalOpen(false);
      setImageFile(null);
      setImagePreview("");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const avatarSrc = userProfile?.photoURL || auth.currentUser?.photoURL || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.username || "user"}`;

  const tabs = [
    { id: "posts", icon: Grid, label: "Posts" },
    { id: "saved", icon: Bookmark, label: "Saved" },
    { id: "tagged", icon: SquareUser, label: "Tagged" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-24">
        {/* Profile Header */}
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-10"
        >
          {/* Avatar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-primary to-purple-600">
              <div className="w-full h-full rounded-full border-4 border-background overflow-hidden bg-muted">
                <img src={avatarSrc} alt="profile" className="w-full h-full object-cover" />
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-2 right-2 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              <Camera className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <h1 className="text-2xl font-bold">
                {userProfile?.username || auth.currentUser?.displayName || "user"}
              </h1>
              <div className="flex items-center gap-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-6 py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-semibold rounded-xl transition-colors"
                >
                  Edit Profile
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-2 hover:bg-muted rounded-xl transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-8 py-2">
              <div className="text-center md:text-left">
                <span className="font-bold text-lg block">{userPosts.length}</span>
                <span className="text-muted-foreground text-sm">posts</span>
              </div>
              <div className="text-center md:text-left cursor-pointer hover:opacity-80">
                <span className="font-bold text-lg block">{userProfile?.followers?.length || 0}</span>
                <span className="text-muted-foreground text-sm">followers</span>
              </div>
              <div className="text-center md:text-left cursor-pointer hover:opacity-80">
                <span className="font-bold text-lg block">{userProfile?.following?.length || 0}</span>
                <span className="text-muted-foreground text-sm">following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <p className="font-bold">{userProfile?.fullName || auth.currentUser?.displayName}</p>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {userProfile?.bio || "Welcome to my profile! ✨"}
              </p>
              {(userProfile?.location || userProfile?.website) && (
                <div className="flex flex-wrap items-center gap-4 text-sm pt-2">
                  {userProfile?.location && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {userProfile.location}
                    </div>
                  )}
                  {userProfile?.website && (
                    <a href={userProfile.website} className="flex items-center gap-1.5 text-primary hover:underline font-medium">
                      <LinkIcon className="w-4 h-4" />
                      {userProfile.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.header>

        {/* Tabs */}
        <div className="border-t border-border sticky top-16 bg-background/95 backdrop-blur-xl z-30 -mx-4 px-4">
          <div className="flex justify-center gap-12">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 text-xs font-bold tracking-widest uppercase transition-colors relative ${
                  activeTab === tab.id 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-primary" 
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="mt-8">
          <AnimatePresence mode="wait">
            {activeTab === "posts" && (
              <motion.div 
                key="posts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-3 gap-1 md:gap-4"
              >
                {userPosts.length === 0 ? (
                  <div className="col-span-3 py-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Posts Yet</h3>
                    <p className="text-muted-foreground">Share your first photo to get started</p>
                  </div>
                ) : (
                  userPosts.map((post, i) => (
                    <motion.div 
                      key={post.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="relative aspect-square bg-muted group cursor-pointer overflow-hidden rounded-lg md:rounded-2xl"
                    >
                      <img src={post.image} alt="post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white font-bold gap-6 backdrop-blur-sm">
                        <span className="flex items-center gap-2"><Heart className="w-5 h-5 fill-white" /> {post.likes || 0}</span>
                        <span className="flex items-center gap-2"><MessageCircle className="w-5 h-5 fill-white" /> {post.comments || 0}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === "saved" && (
              <motion.div 
                key="saved"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-20 text-center"
              >
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Saved Posts</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">Save photos and videos to your private collection</p>
              </motion.div>
            )}

            {activeTab === "tagged" && (
              <motion.div 
                key="tagged"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-20 text-center"
              >
                <SquareUser className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Photos of You</h3>
                <p className="text-muted-foreground">When people tag you, photos appear here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
                <h3 className="text-lg font-bold">Settings</h3>
                <button onClick={() => setIsSettingsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-2">
                <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 hover:bg-muted rounded-2xl transition-colors">
                  <span className="font-semibold">Dark Mode</span>
                  {isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                </button>
                <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-destructive/10 text-destructive rounded-2xl transition-colors mt-1">
                  <span className="font-semibold">Log Out</span>
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30 sticky top-0">
                <h3 className="text-lg font-bold">Edit Profile</h3>
                <button 
                  onClick={() => { setIsEditModalOpen(false); setImageFile(null); setImagePreview(""); }}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                {/* Photo Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full border-2 border-border overflow-hidden mb-3 relative group cursor-pointer bg-muted">
                    <img src={imagePreview || formData.photoURL || avatarSrc} alt="preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
                  </div>
                  <span className="text-sm font-semibold text-primary cursor-pointer">Change Profile Photo</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Name</label>
                    <input 
                      type="text" 
                      value={formData.fullName} 
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full p-3.5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Username</label>
                    <input 
                      type="text" 
                      value={formData.username} 
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full p-3.5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Bio</label>
                    <textarea 
                      rows="3"
                      value={formData.bio} 
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full p-3.5 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        value={formData.location} 
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        placeholder="Add location"
                        className="w-full p-3.5 pl-11 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Website</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="url" 
                        value={formData.website} 
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="Add link"
                        className="w-full p-3.5 pl-11 bg-muted/50 border border-border rounded-xl focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit" 
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-4 rounded-xl font-bold mt-6 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : "Save Changes"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}