// src/pages/Signup.jsx
import { useState, useMemo } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Mail, User, Lock, ArrowRight, Chrome, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import FloatingInput from "../components/FloatingInput";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "", email: "", password: "", confirmPassword: "",
  });

  // Password Strength Logic
  const passwordStrength = useMemo(() => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  }, [formData.password]);

  const strengthColor = passwordStrength <= 1 ? "bg-red-500" : passwordStrength <= 3 ? "bg-yellow-500" : "bg-green-500";

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match!");
    if (passwordStrength < 2) return setError("Please choose a stronger password.");

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCred.user;
      
      // Update Firebase Auth Profile
      await updateProfile(user, { displayName: formData.username });

      // Save to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: formData.email,
        username: formData.username,
        fullName: formData.username,
        bio: "Hey there! I am using ChatX.",
        photoURL: null,
        createdAt: new Date(),
        following: [],
        followers: []
      });

      navigate("/");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        username: user.displayName?.replace(/\s/g, '').toLowerCase() || "user",
        fullName: user.displayName,
        bio: "Hey there! I joined via Google.",
        photoURL: user.photoURL,
        createdAt: new Date(),
        following: [],
        followers: []
      }, { merge: true });

      navigate("/");
    } catch (err) {
      setError("Failed to sign up with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden relative selection:bg-primary/30">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-8 w-full max-w-md">
        
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <MessageCircle size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join the conversation today</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <FloatingInput icon={<User size={18} />} name="username" label="Username" onChange={handleChange} required />
          <FloatingInput icon={<Mail size={18} />} name="email" type="email" label="Email Address" onChange={handleChange} required />

          <div className="space-y-2">
            <FloatingInput 
              icon={<Lock size={18} />} 
              name="password" 
              type={showPassword ? "text" : "password"} 
              label="Password" 
              onChange={handleChange} 
              required
              isPassword
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${strengthColor}`} style={{ width: `${(passwordStrength / 4) * 100}%` }} />
            </div>
          </div>

          <FloatingInput icon={<Lock size={18} />} name="confirmPassword" type="password" label="Confirm Password" onChange={handleChange} required />

          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight size={18} /> Create Account</>}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/40" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground backdrop-blur-xl">Or continue with</span></div>
        </div>

        <button onClick={handleGoogleSignup} disabled={loading} type="button" className="w-full inline-flex items-center justify-center rounded-xl text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 transition-all">
          <Chrome className="mr-2 h-4 w-4 text-red-500" /> Sign up with Google
        </button>

        <p className="text-center text-sm text-muted-foreground pt-4">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}