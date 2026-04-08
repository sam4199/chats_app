import { Link } from "react-router-dom";
import { Search, Bell, LogOut, Menu } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/home" className="mr-6 flex items-center space-x-2 font-bold text-xl">
          <span className="text-primary">Chats</span>
        </Link>
        
        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full h-10 pl-10 pr-4 bg-muted/50 rounded-full border-transparent focus:bg-background focus:border-border outline-none text-sm transition-colors" 
          />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/chat" className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            {/* Message Icon SVG or Lucide */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </Link>
          <button className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground relative">
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {user ? (
            <Link to="/profile" className="overflow-hidden rounded-full ring-2 ring-border hover:ring-primary transition-all">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                alt="User" 
                className="h-8 w-8 object-cover"
              />
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="text-sm font-medium hover:text-primary">Log in</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}