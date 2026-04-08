import { Link, useLocation } from "react-router-dom";
import { Home, Search, MessageSquare, User } from "lucide-react";

export default function MobileNav() {
  const location = useLocation();

  const menuItems = [
    { name: "Home", icon: Home, path: "/home" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Chats", icon: MessageSquare, path: "/chat" },
    { name: "Profile", icon: User, path: "/profile" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 flex items-center justify-around z-50">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full transition-all ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={22} className={isActive ? "stroke-2.5" : ""} />
            <span className="text-[10px] mt-1 font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}