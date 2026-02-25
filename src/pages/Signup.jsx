import { useState, useMemo, useRef, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Make sure db is imported!
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Phone, Mail, User, Lock, CheckCircle2, Eye, EyeOff, ArrowRight, Search, ChevronDown, AlertCircle, Loader2 } from "lucide-react";

const COUNTRIES = [
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "United States", code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪" },
  { name: "Canada", code: "+1", flag: "🇨🇦" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
];

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);
  const [confirmationResult, setConfirmationResult] = useState(null);

  // Auto Detect Country
  useEffect(() => {
    const locale = navigator.language;
    if (locale.includes("IN")) setSelectedCountry(COUNTRIES[0]);
    else if (locale.includes("US")) setSelectedCountry(COUNTRIES[1]);
    else if (locale.includes("GB")) setSelectedCountry(COUNTRIES[2]);
  }, []);

  // Close Dropdown On Outside Click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search));
  }, [search]);

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
  };

  const handleStartSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match!");
    if (passwordStrength < 2) return setError("Please choose a stronger password.");

    setLoading(true);
    try {
      setupRecaptcha();
      const fullPhone = selectedCountry.code + formData.phone;
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setStep(2);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
      if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    }
    setLoading(false);
  };

  const handleVerifyAndCreate = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) return setError("Please enter all 6 digits.");
    
    setError("");
    setLoading(true);

    try {
      await confirmationResult.confirm(finalOtp);
      const userCred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCred.user;
      
      // Update Firebase Auth Profile
      await updateProfile(user, { displayName: formData.username });

      // CRITICAL FIX: Save the user document in Firestore so the Profile page works
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: formData.email,
        username: formData.username,
        phone: selectedCountry.code + formData.phone,
        fullName: formData.username,
        bio: "Hey there! I am using ChatX.",
        photoURL: "",
        createdAt: new Date(),
      });

      navigate("/");
    } catch (err) {
      setError("Invalid OTP or Account Error: " + err.message.replace("Firebase: ", ""));
    }
    setLoading(false);
  };

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1].focus();
    if (!value && index > 0) otpRefs.current[index - 1].focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden relative selection:bg-primary/30">
      
      <div id="recaptcha-container"></div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative bg-card/80 backdrop-blur-xl border border-border shadow-2xl rounded-3xl p-8 w-full max-w-md">
        
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto w-14 h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <MessageCircle size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{step === 1 ? "Create Account" : "Verify Phone"}</h1>
          <p className="text-sm text-muted-foreground">{step === 1 ? "Join the conversation today" : `Enter code sent to ${selectedCountry.code} ${formData.phone}`}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleStartSignup} className="space-y-4">
            <FloatingInput icon={<User size={18} />} name="username" label="Username" onChange={handleChange} required />
            <FloatingInput icon={<Mail size={18} />} name="email" type="email" label="Email Address" onChange={handleChange} required />

            <div className="relative flex gap-2 z-50" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                className="px-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary flex items-center gap-2 text-sm transition-all shadow-sm"
              >
                <span>{selectedCountry.flag}</span>
                <span className="font-medium">{selectedCountry.code}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>

              <div className="flex-1">
                 <FloatingInput icon={<Phone size={18} />} name="phone" type="tel" label="Phone Number" onChange={handleChange} required />
              </div>

              {isCountryOpen && (
                <div className="absolute top-14 left-0 z-[60] w-64 bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                  <div className="p-2 border-b border-border/50 flex items-center gap-2 bg-muted/50">
                    <Search size={14} className="text-muted-foreground ml-2" />
                    <input autoFocus placeholder="Search country..." className="w-full bg-transparent outline-none text-sm p-1" onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <div className="max-h-56 overflow-y-auto custom-scrollbar">
                    {filteredCountries.map((c) => (
                      <button
                        key={c.name} type="button"
                        onClick={() => { setSelectedCountry(c); setIsCountryOpen(false); }}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span>{c.flag}</span> <span>{c.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{c.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowRight size={18} /> Continue</>}
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center animate-in slide-in-from-right-4">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => { if (e.key === 'Backspace' && !digit && index > 0) otpRefs.current[index - 1].focus(); }}
                  maxLength={1}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            <button onClick={handleVerifyAndCreate} disabled={loading} className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 size={18} /> Create Account</>}
            </button>

            <button onClick={() => setStep(1)} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
              Edit phone number
            </button>
          </div>
        )}

        <p className="text-center text-sm text-muted-foreground pt-4">
          Already have an account? <Link to="/" className="text-primary font-semibold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export function FloatingInput({ icon, label, isPassword, showPassword, setShowPassword, ...props }) {
  return (
    <div className="relative group">
      <input
        {...props}
        placeholder=" "
        className="peer w-full p-3.5 pt-5 bg-background border border-border rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all pl-11 text-sm shadow-sm [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:inherit]"
      />
      <label className="absolute left-11 top-1/2 -translate-y-1/2 text-muted-foreground text-sm transition-all pointer-events-none peer-focus:top-3 peer-focus:text-[11px] peer-focus:text-primary peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-[11px]">
        {label}
      </label>
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
        {icon}
      </div>
      
      {isPassword && (
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-10">
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}