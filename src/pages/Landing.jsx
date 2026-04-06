import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight, Sparkles, Shield, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <MessageCircle size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight">Chats</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </Link>
          <Link 
            to="/signup" 
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8 animate-in fade-in zoom-in duration-500">
          <Sparkles size={12} />
          <span>New: Dark Mode Support & Real-time Sync</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
          Connect with the world <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
            Faster than ever
          </span>
        </h1>
        
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl leading-relaxed">
          Experience the next generation of messaging. Secure, fast, and beautifully designed for your daily conversations.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            to="/signup" 
            className="h-12 px-8 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all flex items-center gap-2 shadow-xl active:scale-95"
          >
            Create Account <ArrowRight size={18} />
          </Link>
          <Link 
            to="/login" 
            className="h-12 px-8 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card font-semibold transition-all"
          >
            Log In
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-24 w-full max-w-4xl">
          <FeatureCard 
            icon={<Shield size={24} className="text-primary" />} 
            title="Secure by Default" 
            desc="End-to-end encryption ensures your conversations stay private." 
          />
          <FeatureCard 
            icon={<Zap size={24} className="text-yellow-500" />} 
            title="Lightning Fast" 
            desc="Built on modern tech for instant message delivery and sync." 
          />
          <FeatureCard 
            icon={<MessageCircle size={24} className="text-purple-500" />} 
            title="Community Driven" 
            desc="Discover new people and follow your favorite creators easily." 
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm hover:bg-card/60 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}