import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  MessageSquare, 
  User, 
  Settings, 
  LogOut,
  Plus
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Messages", icon: MessageSquare, path: "/chat" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="space-y-6">
      {/* Create Post Button */}
      <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95">
        <Plus size={20} />
        <span>New Post</span>
      </button>

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                ${isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"}
              `}
            >
              <Icon size={20} className={isActive ? "stroke-2.5" : ""} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Snippet */}
      {user && (
        <div className="pt-6 border-t border-border/50">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white flex items-center justify-center text-xs font-bold">
                {user.email ? user.email[0].toUpperCase() : "U"}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold truncate max-w-[100px]">User</span>
                <span className="text-xs text-muted-foreground">@{user.email?.split('@')[0]}</span>
              </div>
            </div>
            <button 
              onClick={() => signOut(auth)}
              className="p-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}