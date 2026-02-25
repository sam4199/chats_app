import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Settings, Grid, Bookmark, SquareUser, Loader2, LogOut, Heart, MessageCircle, X, Sun, Moon, Camera } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tabs & Modals State
  const [activeTab, setActiveTab] = useState("POSTS");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Edit Profile Form State
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    bio: "",
    photoURL: ""
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
        return;
      }

      const fetchProfileData = async () => {
        try {
          // Fetch User Data
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile(data);
            setFormData({
              username: data.username || "",
              fullName: data.fullName || user.displayName || "",
              bio: data.bio || "",
              photoURL: data.photoURL || user.photoURL || ""
            });
          }

          // Fetch Posts Data
          const q = query(collection(db, "posts"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUserPosts(posts);
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfileData();
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.remove("dark");
    else root.classList.add("dark");
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
      let newPhotoURL = formData.photoURL || user.photoURL;

      // 1. If user selected a new image file, upload to Firebase Storage
      if (imageFile) {
        const imageRef = ref(storage, `profiles/${user.uid}_${Date.now()}`);
        await uploadBytes(imageRef, imageFile);
        newPhotoURL = await getDownloadURL(imageRef);
      }

      // 2. Update Firebase Auth Profile
      await updateProfile(user, {
        displayName: formData.fullName || user.displayName,
        photoURL: newPhotoURL
      });

      const updatedData = {
        username: formData.username,
        fullName: formData.fullName,
        bio: formData.bio,
        photoURL: newPhotoURL
      };

      // 3. Update Firestore Database
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        await updateDoc(userRef, updatedData);
      } else {
        await setDoc(userRef, { uid: user.uid, email: user.email, ...updatedData });
      }

      // 4. Update UI Instantly
      setUserProfile((prev) => ({ ...prev, ...updatedData }));
      setFormData((prev) => ({ ...prev, photoURL: newPhotoURL }));
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const avatarSrc = userProfile?.photoURL || auth.currentUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.username || "user"}`;

  return (
    <div className="bg-background text-foreground min-h-screen selection:bg-primary/30 relative">
      
      {/* --- PROFILE HEADER --- */}
      <header className="max-w-4xl mx-auto pt-8 pb-10 px-4">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-20">
          
          {/* Avatar */}
          <div className="flex-shrink-0 relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-full border-4 border-background shadow-xl overflow-hidden bg-muted flex items-center justify-center">
              <img src={avatarSrc} alt="profile" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-1 space-y-5 w-full text-center md:text-left mt-4 md:mt-0">
            
            <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
              <h2 className="text-2xl font-semibold tracking-tight">
                {userProfile?.username || auth.currentUser?.displayName || "user"}
              </h2>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-muted hover:bg-muted/80 text-foreground text-sm font-semibold py-2 px-5 rounded-xl transition-colors cursor-pointer"
                >
                  Edit Profile
                </button>
                
                <button 
                  onClick={() => setIsSettingsModalOpen(true)} 
                  className="p-2 hover:bg-muted rounded-xl transition-colors text-foreground cursor-pointer"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 py-4 md:py-0 border-y border-border md:border-none">
              <span className="text-sm md:text-base cursor-pointer hover:opacity-80"><b className="font-bold text-lg">{userPosts.length}</b> posts</span>
              <span className="text-sm md:text-base cursor-pointer hover:opacity-80"><b className="font-bold text-lg">{userProfile?.followers || 0}</b> followers</span>
              <span className="text-sm md:text-base cursor-pointer hover:opacity-80"><b className="font-bold text-lg">{userProfile?.following || 0}</b> following</span>
            </div>

            <div className="text-sm md:text-base space-y-1">
              <p className="font-bold text-foreground">{userProfile?.fullName || auth.currentUser?.displayName}</p>
              <p className="text-muted-foreground font-medium leading-relaxed max-w-md mx-auto md:mx-0 whitespace-pre-wrap">
                {userProfile?.bio || "Welcome to my ChatX profile! ✨"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* --- TABS --- */}
      <div className="max-w-4xl mx-auto border-t border-border">
        <div className="flex justify-center gap-12 -mt-[1px]">
          <button 
            onClick={() => setActiveTab("POSTS")}
            className={`flex items-center gap-2 py-4 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer ${activeTab === "POSTS" ? "border-t-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Grid className="w-4 h-4" /> POSTS
          </button>
          <button 
            onClick={() => setActiveTab("SAVED")}
            className={`flex items-center gap-2 py-4 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer ${activeTab === "SAVED" ? "border-t-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Bookmark className="w-4 h-4" /> SAVED
          </button>
          <button 
            onClick={() => setActiveTab("TAGGED")}
            className={`flex items-center gap-2 py-4 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer ${activeTab === "TAGGED" ? "border-t-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <SquareUser className="w-4 h-4" /> TAGGED
          </button>
        </div>
      </div>

      {/* --- TAB CONTENT --- */}
      <main className="max-w-4xl mx-auto px-1 md:px-0 pb-24">
        {activeTab === "POSTS" && (
          <div className="grid grid-cols-3 gap-1 md:gap-4">
            {userPosts.length === 0 ? (
              <div className="col-span-3 py-20 text-center space-y-3">
                <div className="w-16 h-16 border-2 border-muted-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">No Posts Yet</h3>
                <p className="text-muted-foreground">Capture and share your best moments.</p>
              </div>
            ) : (
              userPosts.map((post) => (
                <div key={post.id} className="relative aspect-square bg-muted group cursor-pointer overflow-hidden rounded-md md:rounded-xl">
                  <img src={post.image} alt="post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white font-bold gap-6">
                    <span className="flex items-center gap-2 text-lg drop-shadow-md"><Heart className="w-6 h-6 fill-white" /> {post.likes || 0}</span>
                    <span className="flex items-center gap-2 text-lg drop-shadow-md"><MessageCircle className="w-6 h-6 fill-white" /> {post.comments || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "SAVED" && (
          <div className="py-20 text-center space-y-3 animate-in fade-in">
            <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-xl font-bold">Only you can see what you've saved</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved.</p>
          </div>
        )}

        {activeTab === "TAGGED" && (
          <div className="py-20 text-center space-y-3 animate-in fade-in">
            <SquareUser className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-xl font-bold">Photos of you</h3>
            <p className="text-muted-foreground">When people tag you in photos, they'll appear here.</p>
          </div>
        )}
      </main>

      {/* --- SETTINGS MODAL --- */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
              <h3 className="text-lg font-bold">Settings</h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-2">
              <button onClick={toggleTheme} className="w-full flex items-center justify-between p-4 hover:bg-muted rounded-xl transition-colors cursor-pointer">
                <span className="font-semibold text-foreground">Dark Mode</span>
                {isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              </button>
              <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-destructive/10 text-destructive rounded-xl transition-colors cursor-pointer mt-1">
                <span className="font-semibold">Log Out</span>
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT PROFILE MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
              <h3 className="text-lg font-bold">Edit Profile</h3>
              <button onClick={() => { setIsEditModalOpen(false); setImageFile(null); setImagePreview(""); }} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              
              {/* Profile Image Uploader */}
              <div className="flex flex-col items-center mb-4">
                <div className="w-20 h-20 rounded-full border-2 border-border overflow-hidden mb-2 relative group cursor-pointer bg-muted">
                  <img src={imagePreview || formData.photoURL || avatarSrc} alt="preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageChange} />
                </div>
                <span className="text-xs text-primary font-semibold">Change Photo</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Username</label>
                <input 
                  type="text" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Bio</label>
                <textarea 
                  rows="3"
                  value={formData.bio} 
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full p-3 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold mt-2 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSaving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}