import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, Sun, Moon, LogOut, Plus } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Make sure your firebase import is correct
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import MobileNav from "../components/MobileNav";

export default function Home() {
  const navigate = useNavigate();
  
  // 1. Theme State (Checks if dark mode is already active)
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  // 2. Toggle Theme Function
  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  // 3. Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Your AuthContext in App.jsx will automatically detect the logout 
      // and kick the user back to the Login page!
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };

  const stories = [
    { id: 1, name: "Your story", img: null, isUser: true },
    { id: 2, name: "varsha_j", img: "VJ" },
    { id: 3, name: "snaxgaming", img: "SG" },
    { id: 4, name: "devarshi_p", img: "DP" },
    { id: 5, name: "indianarmy", img: "IA" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      
      {/* --- TOP NAVBAR --- */}
      <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <MessageCircle size={28} className="text-primary" />
            <span className="text-xl font-bold tracking-tight">Chats</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* FUNCTIONAL THEME TOGGLE */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            
            {/* FUNCTIONAL LOGOUT BUTTON */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-destructive hover:bg-destructive/10 px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut size={22} />
              <span className="hidden sm:block">Logout</span>
            </button>

          </div>
        </div>
      </nav>

      {/* --- MAIN LAYOUT --- */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex gap-8 px-4 py-6 pb-24 md:pb-6 relative">
        <aside className="hidden md:block w-64 shrink-0">
          <Sidebar />
        </aside>

        <section className="flex-1 max-w-2xl w-full mx-auto space-y-6">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {stories.map((story) => (
              <div key={story.id} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                <div className={`relative p-[3px] rounded-full transition-transform group-hover:scale-105 ${story.isUser ? 'border-2 border-dashed border-muted-foreground' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'}`}>
                  <div className="w-16 h-16 rounded-full bg-card border-4 border-background flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-300">
                    {story.img || <Plus size={24} className="text-muted-foreground" />}
                  </div>
                  {story.isUser && (
                    <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 border-2 border-background">
                      <Plus size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="text-[11px] font-medium text-muted-foreground truncate w-16 text-center">
                  {story.name}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <Post />
            <Post />
          </div>
        </section>

        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-24 bg-card border border-border rounded-2xl p-5 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-foreground">Suggested for you</span>
              <button className="text-xs font-bold text-primary hover:opacity-80 transition-opacity">See All</button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold border border-border group-hover:border-primary transition-colors">
                      U{i}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold leading-tight group-hover:underline">Cool User {i}</span>
                      <span className="text-xs text-muted-foreground">Suggested</span>
                    </div>
                  </div>
                  <button className="text-xs font-semibold bg-primary/10 text-primary px-4 py-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNav />
      </div>
    </div>
  );
}