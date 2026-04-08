import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  Home, Search, MessageCircle, Heart, PlusSquare, User, LogOut 
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function Sidebar() {
  const { user, profile } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Explore', path: '/search' },
    { icon: MessageCircle, label: 'Messages', path: '/chat' },
    { icon: Heart, label: 'Notifications', path: '#' },
    { icon: PlusSquare, label: 'Create', path: '/create' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="hidden lg:flex flex-col h-full py-6 px-4 space-y-6 w-64 border-r border-border bg-background fixed left-0 top-0">
      {/* Logo */}
      <Link to="/home" className="flex items-center gap-3 px-4 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white">
          <MessageCircle size={24} />
        </div>
        <span className="text-2xl font-bold">Chats</span>
      </Link>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              isActive(item.path)
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <item.icon size={26} className={isActive(item.path) ? 'fill-current' : ''} />
            <span className="text-lg">{item.label}</span>
          </Link>
        ))}

        {/* Profile Link */}
        <Link
          to="/profile"
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
            isActive('/profile')
              ? 'bg-primary/10 text-primary font-semibold'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <img
            src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username || 'user'}`}
            alt="Profile"
            className="w-7 h-7 rounded-full bg-muted object-cover"
          />
          <span className="text-lg">Profile</span>
        </Link>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-4 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
      >
        <LogOut size={26} />
        <span className="text-lg">Log out</span>
      </button>
    </div>
  );
}