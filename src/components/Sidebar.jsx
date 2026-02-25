import { Link, useLocation } from "react-router-dom";
import { Home, User, MessageCircle, PlusCircle } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: <Home size={26} />, path: "/" },
    { name: "Messages", icon: <MessageCircle size={26} />, path: "/chat" },
    { name: "Profile", icon: <User size={26} />, path: "/profile" },
  ];

  return (
    <div className="sticky top-24 flex flex-col justify-between h-[calc(100vh-8rem)]">
      
      {/* Top Section: Navigation */}
      <div className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 p-3.5 rounded-xl transition-all group ${
                isActive 
                  ? "font-bold text-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                {item.icon}
              </div>
              <span className="text-lg tracking-tight">{item.name}</span>
            </Link>
          );
        })}

        {/* Big Create Post Button */}
        <button className="mt-4 flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground p-3.5 rounded-xl font-bold shadow-md hover:opacity-90 transition-opacity cursor-pointer">
          <PlusCircle size={20} />
          Post
        </button>
      </div>

    </div>
  );
}