import { Link } from "react-router-dom";
import { 
  MessageCircle, ArrowRight, Sparkles, Shield, Zap, Globe, 
  Users, Lock, ChevronRight, Star, Check, Play, Quote,
  Github, Twitter, Linkedin, ArrowUpRight
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Landing() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-primary/30">
      
      {/* --- Animated Gradient Background --- */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-20" />
      </div>

      {/* --- Navigation --- */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="bg-gradient-to-br from-primary to-purple-600 text-white p-2.5 rounded-xl shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
              <MessageCircle size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Chats
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Testimonials', 'Pricing', 'About'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 flex items-center gap-2 group"
            >
              Get Started 
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* --- Hero Section --- */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Hero Text */}
            <motion.div 
              className="flex-1 text-center lg:text-left max-w-3xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                variants={itemVariants} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide mb-6 uppercase backdrop-blur-sm"
              >
                <Sparkles size={14} className="animate-pulse" />
                <span>ChatX 2.0 is now live</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </motion.div>
              
              <motion.h1 
                variants={itemVariants} 
                className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]"
              >
                Connect with the world <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient">
                  Faster than ever.
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants} 
                className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Experience the next generation of messaging. Secure, lightning-fast, and beautifully designed for teams who demand excellence. Join <span className="text-foreground font-semibold">10,000+</span> professionals already on board.
              </motion.p>
              
              <motion.div 
                variants={itemVariants} 
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12"
              >
                <Link 
                  to="/signup" 
                  className="w-full sm:w-auto h-14 px-8 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl active:scale-95 text-lg group"
                >
                  Start Free Trial
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button 
                  className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-border bg-card/50 backdrop-blur-sm hover:bg-card font-semibold transition-all flex items-center justify-center gap-2 text-lg group hover:border-primary/50"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Play size={14} className="fill-primary text-primary ml-0.5" />
                  </div>
                  Watch Demo
                </button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
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
              </motion.div>
            </motion.div>

            {/* Hero Visual Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 100, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: -5 }}
              transition={{ duration: 1, delay: 0.5, type: "spring" }}
              style={{ y, opacity }}
              className="flex-1 w-full max-w-lg lg:max-w-xl perspective-1000"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2.5rem] blur opacity-30 animate-pulse" />
                
                <div className="relative w-full aspect-[4/5] bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden backdrop-blur-xl bg-background/80">
                  {/* App Header */}
                  <div className="h-16 border-b border-border/50 flex items-center px-6 bg-muted/20 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 ring-2 ring-primary/20" />
                      <div>
                        <div className="h-3 w-24 bg-foreground/80 rounded-full mb-1.5" />
                        <div className="h-2 w-16 bg-muted-foreground/40 rounded-full" />
                      </div>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground">Online</span>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="p-6 space-y-6">
                    <div className="flex gap-4 items-end">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 shrink-0" />
                      <div className="space-y-2 max-w-[80%]">
                        <div className="h-16 w-full bg-muted rounded-2xl rounded-bl-sm p-3">
                          <div className="h-2 w-full bg-foreground/20 rounded-full mb-2" />
                          <div className="h-2 w-2/3 bg-foreground/20 rounded-full" />
                        </div>
                        <span className="text-[10px] text-muted-foreground ml-2">10:42 AM</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-end flex-row-reverse">
                      <div className="space-y-2 max-w-[80%]">
                        <div className="h-12 w-full bg-primary rounded-2xl rounded-br-sm p-3 shadow-lg shadow-primary/20">
                          <div className="h-2 w-full bg-white/30 rounded-full mb-2" />
                          <div className="h-2 w-1/2 bg-white/30 rounded-full" />
                        </div>
                        <span className="text-[10px] text-muted-foreground mr-2 text-right block">10:43 AM</span>
                      </div>
                    </div>

                    <div className="flex gap-4 items-end">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 shrink-0" />
                      <div className="space-y-2 max-w-[80%]">
                        <div className="h-20 w-full bg-muted rounded-2xl rounded-bl-sm p-3">
                          <div className="h-2 w-full bg-foreground/20 rounded-full mb-2" />
                          <div className="h-2 w-full bg-foreground/20 rounded-full mb-2" />
                          <div className="h-2 w-1/3 bg-foreground/20 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Typing Indicator */}
                    <div className="flex gap-4 items-end">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 shrink-0" />
                      <div className="h-10 w-20 bg-muted rounded-2xl rounded-bl-sm flex items-center justify-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Input Area */}
                  <div className="absolute bottom-0 w-full h-20 border-t border-border/50 bg-background/80 backdrop-blur-md flex items-center px-6 gap-3">
                    <div className="h-10 w-full bg-muted rounded-full flex items-center px-4">
                      <span className="text-muted-foreground text-sm">Type a message...</span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
                      <ArrowUpRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-6 top-20 bg-card border border-border/50 p-4 rounded-2xl shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Zap size={20} className="text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Delivered</div>
                      <div className="text-xs text-muted-foreground">in 0.02s</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-6 bottom-32 bg-card border border-border/50 p-4 rounded-2xl shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-primary" />
                    <span className="text-xs font-semibold">End-to-end encrypted</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* --- Logo Cloud --- */}
      <section className="border-y border-border/50 bg-muted/30 backdrop-blur-sm py-12">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
            Trusted by innovative teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Google', 'Microsoft', 'Stripe', 'Slack', 'Notion'].map((company) => (
              <div key={company} className="text-2xl font-bold text-foreground/60 hover:text-foreground transition-colors cursor-default">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Stats Banner --- */}
      <section className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-card border border-border rounded-3xl shadow-2xl shadow-primary/5 p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "99.9%", label: "Uptime SLA", sub: "Guaranteed" },
              { value: "10k+", label: "Active Users", sub: "Growing daily" },
              { value: "<10ms", label: "Latency", sub: "Global average" },
              { value: "256-bit", label: "Encryption", sub: "Military-grade" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="space-y-1"
              >
                <h4 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {stat.value}
                </h4>
                <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="container mx-auto px-6 py-32">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 mb-6">
              Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">connect</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              We've built Chats from the ground up to provide the most seamless messaging experience possible. No compromises.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Shield size={28} />} 
            title="Secure by Default" 
            desc="Military-grade end-to-end encryption ensures your private conversations stay strictly private. Zero knowledge architecture."
            color="from-blue-500 to-cyan-500"
            delay={0}
          />
          <FeatureCard 
            icon={<Zap size={28} />} 
            title="Lightning Fast" 
            desc="Built on a modern edge network for instant message delivery. Real-time sync across all your devices with zero lag."
            color="from-yellow-500 to-orange-500"
            delay={0.1}
          />
          <FeatureCard 
            icon={<Globe size={28} />} 
            title="Global Infrastructure" 
            desc=" deployed across 200+ edge locations worldwide. Experience low latency no matter where you or your team are located."
            color="from-green-500 to-emerald-500"
            delay={0.2}
          />
          <FeatureCard 
            icon={<Users size={28} />} 
            title="Team Collaboration" 
            desc="Channels, threads, and direct messages organized your way. Powerful search helps you find any conversation instantly."
            color="from-purple-500 to-pink-500"
            delay={0.3}
          />
          <FeatureCard 
            icon={<Lock size={28} />} 
            title="Enterprise Compliance" 
            desc="GDPR, SOC2, and HIPAA compliant. Data residency options available for organizations with strict requirements."
            color="from-red-500 to-pink-500"
            delay={0.4}
          />
          <FeatureCard 
            icon={<Sparkles size={28} />} 
            title="AI-Powered" 
            desc="Smart replies, conversation summaries, and intelligent search powered by state-of-the-art language models."
            color="from-primary to-purple-500"
            delay={0.5}
          />
        </div>
      </section>

      {/* --- Social Proof / Testimonials --- */}
      <section id="testimonials" className="container mx-auto px-6 py-24 bg-muted/30 rounded-[3rem] mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Loved by teams worldwide</h2>
          <p className="text-muted-foreground">See what our customers have to say about their experience</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "Chats has completely transformed how our remote team communicates. The speed and reliability are unmatched.",
              author: "Sarah Chen",
              role: "CTO at TechCorp",
              rating: 5
            },
            {
              quote: "We migrated from Slack and never looked back. The encryption gives us peace of mind for sensitive client communications.",
              author: "Marcus Johnson",
              role: "Security Lead at FinanceHub",
              rating: 5
            },
            {
              quote: "The best messaging platform I've used. Beautiful UI, fast, and the mobile app is just as good as desktop.",
              author: "Elena Rodriguez",
              role: "Product Manager at StartupXYZ",
              rating: 5
            }
          ].map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-card border border-border/50 p-8 rounded-3xl relative"
            >
              <Quote size={32} className="text-primary/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-foreground/90 mb-6 leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Bottom CTA --- */}
      <section className="container mx-auto px-6 mb-24">
        <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-foreground to-foreground/90 text-background p-12 md:p-24 text-center">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to upgrade your conversations?
            </h2>
            <p className="text-lg text-background/80 mb-10">
              Join thousands of teams already using Chats. Start your free 14-day trial today. No credit card required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link 
                to="/signup" 
                className="h-14 px-10 rounded-full bg-background text-foreground font-bold hover:bg-background/90 transition-all inline-flex items-center justify-center gap-2 shadow-2xl active:scale-95 text-lg group"
              >
                Get Started Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-background/70">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-400" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-400" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-br from-primary to-purple-600 text-white p-2 rounded-lg">
                  <MessageCircle size={20} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-xl tracking-tight">Chats</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                The next generation messaging platform for modern teams. Secure, fast, and beautifully designed.
              </p>
              <div className="flex gap-4">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {['Features', 'Security', 'Enterprise', 'Pricing', 'Changelog'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-foreground transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {['About', 'Blog', 'Careers', 'Press', 'Partners'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-foreground transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {['Documentation', 'Help Center', 'Community', 'Contact', 'Status'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-foreground transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Chats Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="#" className="hover:text-foreground transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Enhanced Feature Card Component
function FeatureCard({ icon, title, desc, color, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group relative p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{desc}</p>
      
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </motion.div>
  );
}