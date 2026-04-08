import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, Shield, Zap, Users, MessageCircle, 
  CheckCircle2, Star, Sparkles, Lock, Globe 
} from "lucide-react";

// Reusable Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

// Sub-component for Feature Cards
const FeatureCard = ({ icon, title, desc, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="group p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] hover:bg-slate-900/60 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-colors duration-500" />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-300 border border-white/5 group-hover:border-indigo-500/20 text-indigo-400">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
  </motion.div>
);

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      {/* --- Ambient Background Effects --- */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[700px] h-[700px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen" />
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-md transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <MessageCircle size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Chats</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hidden sm:block text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="bg-white text-slate-950 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95 flex items-center gap-2 group"
            >
              Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="container mx-auto px-6 pt-32 pb-20 lg:pt-40 lg:pb-32 relative z-10 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Hero Text */}
          <motion.div 
            className="flex-1 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8 uppercase tracking-wider shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <Sparkles size={14} className="fill-indigo-400" />
              <span>v2.0 Platform Live</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
              Connect with the world <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Faster than ever.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Experience the next generation of messaging. Secure, lightning-fast, and beautifully designed for your everyday conversations. Join thousands of users already on board.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link 
                to="/signup" 
                className="w-full sm:w-auto h-14 px-8 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 text-lg"
              >
                Start Chatting <ArrowRight size={20} />
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto h-14 px-8 rounded-full border border-white/10 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800 hover:border-white/20 text-white font-semibold transition-all flex items-center justify-center text-lg"
              >
                View Demo
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={itemVariants} className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>99.99% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-indigo-500" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={16} className="text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual (Abstract UI Mockup) */}
          <motion.div 
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
            className="flex-1 w-full max-w-lg hidden lg:block perspective-1000"
          >
            <div className="relative w-full aspect-[4/3] bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/10 overflow-hidden transform hover:rotate-y-1 hover:rotate-x-1 hover:scale-[1.01] transition-transform duration-700">
              {/* UI Header */}
              <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-300">AI</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Sarah Connor</div>
                    <div className="text-xs text-emerald-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Online
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400"><Zap size={16}/></div>
                  <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400"><Globe size={16}/></div>
                </div>
              </div>

              {/* UI Body */}
              <div className="p-6 space-y-4 bg-gradient-to-b from-transparent to-slate-900/50">
                <div className="flex gap-3 items-end">
                  <div className="w-8 h-8 rounded-full bg-slate-700/50 border border-white/5 shrink-0"></div>
                  <div className="bg-slate-800/50 border border-white/5 p-4 rounded-2xl rounded-bl-none text-sm text-slate-300 shadow-sm backdrop-blur-sm max-w-[80%]">
                    Hey! Did you see the new update?
                  </div>
                </div>
                <div className="flex gap-3 items-end flex-row-reverse">
                  <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl rounded-br-none text-sm text-white shadow-lg shadow-indigo-500/20 max-w-[80%]">
                    Yes, the encryption is insane! 🔥
                  </div>
                </div>
                <div className="flex gap-3 items-end">
                  <div className="w-8 h-8 rounded-full bg-slate-700/50 border border-white/5 shrink-0"></div>
                  <div className="bg-slate-800/50 border border-white/5 p-4 rounded-2xl rounded-bl-none text-sm text-slate-300 shadow-sm backdrop-blur-sm max-w-[80%]">
                    Totally. Let's switch to this app permanently.
                  </div>
                </div>
                <div className="flex gap-3 items-end ml-11">
                  <div className="flex gap-1 p-3 bg-slate-800/30 rounded-2xl rounded-bl-none">
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>

              {/* UI Input */}
              <div className="absolute bottom-0 w-full p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/5">
                <div className="h-12 bg-slate-800/50 border border-white/10 rounded-full flex items-center px-4 text-sm text-slate-500">
                  Type a message...
                  <div className="ml-auto w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* --- Stats Banner --- */}
      <div className="border-y border-white/5 bg-slate-900/30 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-y-1 opacity-50 pointer-events-none"></div>
        <div className="container mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5 relative z-10 max-w-7xl">
          {[
            { val: "99.9%", label: "Uptime SLA" },
            { val: "10k+", label: "Active Users" },
            { val: "<10ms", label: "Latency" },
            { val: "256-bit", label: "Encryption" }
          ].map((stat, i) => (
            <div key={i} className="group">
              <h4 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-1 group-hover:scale-110 transition-transform duration-300">{stat.val}</h4>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* --- Features Grid --- */}
      <section className="container mx-auto px-6 py-32 relative z-10 max-w-7xl">
        <div className="text-center mb-20">
          <span className="text-indigo-400 font-bold tracking-wider uppercase text-xs mb-4 block">Why Choose Us?</span>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Everything you need to connect</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">We've built Chats from the ground up to provide the most seamless messaging experience possible.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            delay={0.1}
            icon={<Shield size={28} />} 
            title="Secure by Default" 
            desc="Military-grade end-to-end encryption ensures your private conversations stay strictly private." 
          />
          <FeatureCard 
            delay={0.2}
            icon={<Zap size={28} />} 
            title="Lightning Fast" 
            desc="Built on a modern React & Firebase stack for instant message delivery and real-time sync across devices." 
          />
          <FeatureCard 
            delay={0.3}
            icon={<Globe size={28} />} 
            title="Global Community" 
            desc="Jump into global rooms to meet new people, or keep it locked down to your inner circle." 
          />
          <FeatureCard 
            delay={0.4}
            icon={<Users size={28} />} 
            title="Social Features" 
            desc="Share posts, follow friends, and build your own following with our built-in social feed." 
          />
          <FeatureCard 
            delay={0.5}
            icon={<Lock size={28} />} 
            title="Data Privacy" 
            desc="You own your data. No creepy ad tracking, no selling your information to third parties. Ever." 
          />
          <FeatureCard 
            delay={0.6}
            icon={<Sparkles size={28} />} 
            title="Beautiful UI" 
            desc="A stunning, accessible interface with automatic Dark Mode support to protect your eyes at night." 
          />
        </div>
      </section>

      {/* --- Bottom CTA --- */}
      <section className="container mx-auto px-6 py-20 mb-20 relative max-w-7xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 blur-[100px] -z-10 rounded-full opacity-50 pointer-events-none"></div>
        
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 md:p-24 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/30 transition-all duration-700"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">Ready to join the conversation?</h2>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">Create your free account in less than 60 seconds and start chatting immediately.</p>
            <Link 
              to="/signup" 
              className="inline-flex h-14 px-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:opacity-90 transition-all items-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] hover:scale-105 active:scale-95 text-lg"
            >
              Get Started for Free <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-white/5 bg-slate-950/50 backdrop-blur-md mt-auto">
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-indigo-500" />
            <span className="font-bold text-lg tracking-tight text-white">Chats</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Chats Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}