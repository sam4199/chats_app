import { Link, useLocation } from "react-router-dom";
import { Home, User, MessageCircle, PlusSquare } from "lucide-react";

export default function MobileNav() {
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: <Home size={24} />, path: "/" },
    { name: "Search", icon: <PlusSquare size={24} />, path: "/create" },
    { name: "Messages", icon: <MessageCircle size={24} />, path: "/chat" },
    { name: "Profile", icon: <User size={24} />, path: "/profile" },
  ];

  return (
    <div className="bg-background/95 backdrop-blur-lg border-t border-border flex justify-around p-2 pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`p-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${
              isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
}