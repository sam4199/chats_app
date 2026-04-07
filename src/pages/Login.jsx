import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// FIXED: Added MessageCircle to the import list below
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, ArrowRight, Chrome, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (user) {
    navigate('/home');
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (err) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="relative bg-card/60 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-[2.5rem] p-8 sm:p-10">
          
          <div className="text-center space-y-4 mb-10">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <MessageCircle size={32} />
            </div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground text-sm">Sign in to continue your conversations</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-2xl flex items-center gap-3">
                <AlertCircle size={16} /> <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required 
                  className="w-full h-14 pl-12 pr-4 bg-muted/50 border border-border rounded-2xl focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required 
                  className="w-full h-14 pl-12 pr-12 bg-muted/50 border border-border rounded-2xl focus:bg-background focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all outline-none" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} 
              className="w-full h-14 bg-gradient-to-r from-primary to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-70 transition-all flex items-center justify-center gap-2 mt-6">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><>Sign In</> <ArrowRight size={18} /></>}
            </motion.button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-4 text-xs text-muted-foreground uppercase">Or continue with</span></div>
          </div>

          <button onClick={handleGoogleLogin} disabled={loading} className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl border border-border bg-background/50 hover:bg-muted transition-all font-semibold disabled:opacity-70">
            <Chrome size={20} className="text-red-500" /> Sign in with Google
          </button>

          <p className="text-center text-sm text-muted-foreground pt-8">
            New to Chats? <Link to="/signup" className="text-primary font-semibold hover:underline">Create account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}