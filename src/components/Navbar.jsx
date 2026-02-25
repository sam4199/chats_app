import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // <-- Import your AuthContext

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const context = useContext(AuthContext); // <-- Grab the context
  
  // Safely get the user (in case context is null for a split second)
  const user = context?.user; 

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="flex justify-between items-center p-4 bg-background text-foreground border-b border-border shadow-sm transition-colors duration-300">
      <h2 className="text-xl font-bold tracking-tight">Chats</h2>

      <div className="flex items-center gap-4">
        
        {/* New feature: Display the Username */}
        {user && (
          <span className="text-sm font-medium text-muted-foreground hidden sm:block">
            Welcome, <span className="text-foreground">{user.displayName || "User"}</span>!
          </span>
        )}

        <button
          onClick={() => setDark(!dark)}
          className="px-3 py-1 rounded bg-secondary text-secondary-foreground cursor-pointer hover:opacity-80 transition"
        >
          {dark ? "☀️" : "🌙"}
        </button>

        <button
          onClick={() => signOut(auth)}
          className="px-3 py-1 rounded bg-destructive text-destructive-foreground cursor-pointer hover:opacity-80 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}