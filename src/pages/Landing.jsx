import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MessageCircle, ArrowRight, Sparkles, Shield, Zap, 
  Globe, Users, Lock, ChevronRight, Star, Play 
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans selection:bg-primary/30">
      
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px]" />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-gradient-to-br from-primary to-purple-600 text-white p-2.5 rounded-xl shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
              <MessageCircle size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight">Chats</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Testimonials', 'About'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
              Log In
            </Link>
            <Link to="/signup" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 active:scale-95 flex items-center gap-2 group">
              Get Started <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Hero Text */}
            <motion.div 
              className="flex-1 text-center lg:text-left max-w-3xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-6 uppercase backdrop-blur-sm">
                <Sparkles size={14} className="animate-pulse" />
                <span>Chats 2.0 is now live</span>
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                Connect with the world <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                  Faster than ever.
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience the next generation of messaging. Secure, lightning-fast, and beautifully designed for your everyday conversations.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
                <Link to="/signup" className="w-full sm:w-auto h-14 px-8 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95 text-lg group">
                  Start Free Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-border bg-card/50 backdrop-blur-sm hover:bg-card font-semibold transition-all flex items-center justify-center gap-2 text-lg">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Play size={14} className="fill-primary text-primary ml-0.5" />
                  </div>
                  Watch Demo
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-foreground">4.9/5</span>
                  <span>from 2,000+ reviews</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full max-w-lg hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2.5rem] blur opacity-30 animate-pulse" />
                <div className="relative w-full aspect-[4/5] bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden">
                  <div className="h-16 border-b border-border flex items-center px-6 bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500" />
                    <div className="ml-4 space-y-1.5">
                      <div className="h-3 w-24 bg-foreground/20 rounded-full" />
                      <div className="h-2 w-16 bg-muted-foreground/30 rounded-full" />
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
                      <div className="h-16 w-3/4 bg-muted rounded-2xl rounded-tl-sm" />
                    </div>
                    <div className="flex gap-4 flex-row-reverse">
                      <div className="h-12 w-2/3 bg-primary rounded-2xl rounded-tr-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-6 py-32">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to connect</h2>
          <p className="text-muted-foreground text-lg">Built from the ground up for the best messaging experience.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={<Shield size={28} />} title="Secure by Default" desc="Military-grade end-to-end encryption ensures your conversations stay private." color="from-blue-500 to-cyan-500" />
          <FeatureCard icon={<Zap size={28} />} title="Lightning Fast" desc="Built on modern infrastructure for instant message delivery worldwide." color="from-yellow-500 to-orange-500" />
          <FeatureCard icon={<Globe size={28} />} title="Global Community" desc="Join public rooms or keep conversations private with your circle." color="from-green-500 to-emerald-500" />
          <FeatureCard icon={<Users size={28} />} title="Social Features" desc="Share posts, follow friends, and build your following." color="from-purple-500 to-pink-500" />
          <FeatureCard icon={<Lock size={28} />} title="Data Privacy" desc="No ad tracking, no data selling. You own your information." color="from-red-500 to-pink-500" />
          <FeatureCard icon={<Sparkles size={28} />} title="Beautiful UI" desc="Stunning interface with automatic Dark Mode support." color="from-primary to-purple-500" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 mb-20">
        <div className="bg-gradient-to-br from-foreground to-foreground/90 text-background rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Ready to join?</h2>
            <p className="text-lg text-background/80 mb-10">Create your free account in less than 60 seconds.</p>
            <Link to="/signup" className="inline-flex h-14 px-10 rounded-full bg-background text-foreground font-bold hover:opacity-90 transition-all items-center gap-2 shadow-2xl active:scale-95 text-lg">
              Get Started Free <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
    </motion.div>
  );
}