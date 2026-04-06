// src/components/FloatingInput.jsx
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../lib/utils"; // Assuming you have a utility file, otherwise just use standard class logic

export default function FloatingInput({ icon, label, isPassword, showPassword, setShowPassword, ...props }) {
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