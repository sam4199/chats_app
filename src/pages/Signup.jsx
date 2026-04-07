import { useState, useMemo } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, storage } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Lock, AlertCircle, Loader2, Eye, EyeOff, ArrowRight, Chrome, Camera } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    username: "", email: "", password: "", fullName: ""
  });

  const passwordStrength = useMemo(() => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }, [formData.password]);

  const strengthColors = ["bg-muted", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthLabels = ["Enter password", "Weak", "Fair", "Good", "Strong"];

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (passwordStrength < 2) return setError("Password too weak");

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCred.user;
      
      let photoURL = "";
      if (profileImage) {
        const imageRef = ref(storage, `profiles/${user.uid}`);
        await uploadBytes(imageRef, profileImage);
        photoURL = await getDownloadURL(imageRef);
      }

      await updateProfile(user, { displayName: formData.fullName, photoURL });
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: formData.email,
        username: formData.username,
        fullName: formData.fullName,
        photoURL,
        bio: "Hey there! I'm using Chats.",
        createdAt: new Date(),
        following: [],
        followers: []
      });

      navigate("/home");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: user.displayName?.replace(/\s/g, '').toLowerCase() || "user",
        fullName: user.displayName,
        photoURL: user.photoURL,
        bio: "Hey there! I joined via Google.",
        createdAt: new Date(),
        following: [],
        followers: []
      }, { merge: true });

      navigate("/home");
    } catch (err) {
      setError("Google sign-up failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="relative bg-card/60 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-[2.5rem] p-8 sm:p-10">
          
          <div className="text-center space-y-4 mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <User size={32} />
            </div>
            <h1 className="text-3xl font-bold">Create Account</h1>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-2xl flex items-center gap-2">
                <AlertCircle size={16} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Profile Image Upload */}
          <div className="flex justify-center mb-6">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full border-2 border-border overflow-hidden bg-muted">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Camera size={32} />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">Change</span>
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <InputField icon={<User size={18} />} placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
            <InputField icon={<User size={18} />} placeholder="Username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
            <InputField icon={<Mail size={18} />} type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required 
                  className="w-full h-12 pl-12 pr-12 bg-muted/50 border border-border rounded-2xl focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(passwordStrength / 4) * 100}%` }} className={`h-full ${strengthColors[passwordStrength]}`} />
              </div>
              <p className="text-xs text-muted-foreground text-right">{strengthLabels[passwordStrength]}</p>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} 
              className="w-full h-14 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-semibold shadow-lg disabled:opacity-70 mt-6 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <><>Create Account</> <ArrowRight size={18} /></>}
            </motion.button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-4 text-xs text-muted-foreground uppercase">Or</span></div>
          </div>

          <button onClick={handleGoogleSignup} className="w-full h-12 flex items-center justify-center gap-3 rounded-2xl border border-border hover:bg-muted transition-all font-semibold">
            <Chrome size={20} className="text-red-500" /> Sign up with Google
          </button>

          <p className="text-center text-sm text-muted-foreground pt-6">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function InputField({ icon, ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">{icon}</div>
      <input {...props} className="w-full h-12 pl-12 pr-4 bg-muted/50 border border-border rounded-2xl focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all" />
    </div>
  );
}