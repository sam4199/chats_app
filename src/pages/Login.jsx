import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Mail, Lock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { FloatingInput } from "./Signup"; 

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [msg, setMsg] = useState(""); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // CRITICAL FIX: Changed from "/home" to "/" to match your App.jsx routing!
      navigate("/"); 
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  const handleForgot = async () => {
    setError("");
    const mail = email || window.prompt("Enter your email for the reset link:");
    if (!mail) return;
    try {
      await sendPasswordResetEmail(auth, mail);
      setMsg("Password reset link sent to your email!");
    } catch (err) { 
      setError(err.message.replace("Firebase: ", ""));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden relative selection:bg-primary/30 text-foreground">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-8 w-full max-w-md">
        
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <MessageCircle size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0" /> <span>{error}</span>
          </div>
        )}
        {msg && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="shrink-0" /> <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <FloatingInput 
            icon={<Mail size={18} />} 
            name="email" 
            type="email" 
            label="Email Address" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />

          <div className="space-y-2">
            <FloatingInput 
              icon={<Lock size={18} />} 
              name="password" 
              type={showPassword ? "text" : "password"} 
              label="Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              isPassword
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            <div className="flex justify-end pt-1">
              <button type="button" onClick={handleForgot} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Forgot Password?
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all mt-4 flex items-center justify-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground pt-6">
          New to Chats? <Link to="/signup" className="text-primary font-semibold hover:underline">Create an your account</Link>
        </p>
      </div>
    </div>
  );
}