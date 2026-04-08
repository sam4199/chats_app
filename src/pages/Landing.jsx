<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nexus | Enterprise Messaging Infrastructure</title>
    
    <!-- React & ReactDOM -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    
    <!-- Babel for JSX -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Framer Motion -->
    <script src="https://unpkg.com/framer-motion@10.16.4/dist/framer-motion.js"></script>
    
    <!-- Lucide Icons (UMD build for React) -->
    <script src="https://unpkg.com/lucide-react@0.292.0/dist/umd/lucide-react.min.js"></script>

    <!-- Tailwind Config for Custom Colors/Fonts -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        background: '#020617', // Slate 950
                        surface: '#0f172a',    // Slate 900
                        primary: '#6366f1',    // Indigo 500
                        'primary-glow': '#818cf8',
                        accent: '#a855f7',     // Purple 500
                    },
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                    },
                    backgroundImage: {
                        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2e1065 0deg, #020617 180deg)',
                    }
                }
            }
        }
    </script>
    
    <style>
        /* Global Reset & Base Styles */
        body {
            background-color: #020617;
            color: #f8fafc;
            font-family: 'Inter', sans-serif;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
        }

        /* Subtle Noise Texture for "Premium" feel */
        .bg-noise {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 0;
            opacity: 0.03;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #020617;
        }
        ::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #334155;
        }

        /* Utility for glowing text */
        .text-glow {
            text-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
        }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect, useRef } = React;
        const { motion, useScroll, useTransform, useSpring, AnimatePresence } = window.Motion;
        const { 
            ArrowRight, Zap, Shield, Globe, Lock, CheckCircle2, 
            MessageSquare, Users, LayoutGrid, Sparkles, ChevronRight,
            Menu, X, Hexagon
        } = window.LucideReact;

        // --- Components ---

        // 1. Navigation
        const Navbar = () => {
            const [scrolled, setScrolled] = useState(false);
            const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

            useEffect(() => {
                const handleScroll = () => setScrolled(window.scrollY > 20);
                window.addEventListener('scroll', handleScroll);
                return () => window.removeEventListener('scroll', handleScroll);
            }, []);

            return (
                <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
                    <div className="container mx-auto px-6 flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                                <MessageSquare size={18} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">Nexus</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                            {['Product', 'Solutions', 'Enterprise', 'Pricing'].map((item) => (
                                <a key={item} href="#" className="hover:text-white transition-colors relative group">
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                                </a>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-4">
                            <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Sign In</a>
                            <button className="bg-white text-background px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                                Get Started
                            </button>
                        </div>

                        {/* Mobile Toggle */}
                        <button className="md:hidden text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>

                    {/* Mobile Menu Overlay */}
                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden bg-surface/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                            >
                                <div className="flex flex-col p-6 gap-4 text-center">
                                    {['Product', 'Solutions', 'Enterprise', 'Pricing'].map((item) => (
                                        <a key={item} href="#" className="text-slate-300 hover:text-white py-2 text-lg">{item}</a>
                                    ))}
                                    <hr className="border-white/10 my-2" />
                                    <a href="#" className="text-white font-medium py-2">Sign In</a>
                                    <button className="bg-primary text-white w-full py-3 rounded-xl font-semibold mt-2">Get Started</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>
            );
        };

        // 2. Hero Section with 3D Tilt Mockup
        const Hero = () => {
            return (
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                    {/* Ambient Glow Background */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
                    <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
                    
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
                            
                            {/* Text Content */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="flex-1 text-center lg:text-left z-10"
                            >
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold tracking-wider uppercase mb-6"
                                >
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    v2.0 Platform Live
                                </motion.div>
                                
                                <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-6 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500">
                                    Secure infrastructure <br className="hidden lg:block" />
                                    for modern teams.
                                </h1>
                                
                                <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                    Nexus provides the scalability of enterprise infrastructure with the elegance of a consumer app. End-to-end encrypted, real-time, and built for performance.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                    <button className="h-12 px-8 rounded-full bg-white text-background font-bold hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                                        Start Building <ArrowRight size={18} />
                                    </button>
                                    <button className="h-12 px-8 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-sm">
                                        <LayoutGrid size={18} className="text-slate-400" />
                                        View Documentation
                                    </button>
                                </div>
                                
                                <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-primary" />
                                        <span>99.99% Uptime</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-primary" />
                                        <span>SOC2 Compliant</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* High-Fidelity Mockup */}
                            <motion.div 
                                initial={{ opacity: 0, x: 50, rotateY: 10 }}
                                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="flex-1 w-full max-w-xl perspective-1000 hidden lg:block group"
                            >
                                <div className="relative w-full aspect-[4/3] bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-transform duration-500 group-hover:rotate-y-1 group-hover:rotate-x-1 group-hover:scale-[1.01]">
                                    
                                    {/* Sidebar */}
                                    <div className="absolute top-0 left-0 w-20 h-full border-r border-white/5 bg-white/5 flex flex-col items-center py-6 gap-6">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10" />
                                        {[1,2,3,4].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-slate-400">
                                                <MessageSquare size={18} />
                                            </div>
                                        ))}
                                        <div className="mt-auto w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                                            <Settings size={18} />
                                        </div>
                                    </div>

                                    {/* Main Chat Area */}
                                    <div className="absolute top-0 left-20 right-0 h-full flex flex-col">
                                        {/* Header */}
                                        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background/30 backdrop-blur-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                                <div>
                                                    <h3 className="font-semibold text-white">Engineering Team</h3>
                                                    <p className="text-xs text-slate-500">8 members online</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10" />
                                                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10" />
                                                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold border border-primary/20">+5</div>
                                            </div>
                                        </div>

                                        {/* Messages */}
                                        <div className="flex-1 p-8 space-y-6 overflow-hidden relative">
                                            {/* Abstract bg elements */}
                                            <div className="absolute top-10 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                                            
                                            {/* Message 1 */}
                                            <div className="flex gap-4 items-end">
                                                <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold border border-purple-500/20">JD</div>
                                                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-bl-none max-w-md">
                                                    <p className="text-sm text-slate-300">The deployment pipeline looks stable. Are we good to push the update?</p>
                                                </div>
                                            </div>

                                            {/* Message 2 */}
                                            <div className="flex gap-4 items-end flex-row-reverse">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/20">AI</div>
                                                <div className="bg-primary text-white p-4 rounded-2xl rounded-br-none max-w-md shadow-lg shadow-primary/10">
                                                    <p className="text-sm">All checks passed. Deploying to production now.</p>
                                                    <div className="mt-3 flex items-center gap-2 text-[10px] text-primary-200 bg-black/20 p-2 rounded-lg w-fit">
                                                        <Zap size={10} className="animate-pulse" />
                                                        <span>Processing 4,203 requests</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Input */}
                                        <div className="p-6 bg-background/50 backdrop-blur-md border-t border-white/5">
                                            <div className="h-12 w-full bg-white/5 rounded-full border border-white/10 flex items-center px-6 gap-4">
                                                <span className="text-slate-500 text-sm">Type a message...</span>
                                                <div className="ml-auto w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            );
        };

        const Settings = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;

        // 3. Marquee / Social Proof
        const LogoTicker = () => {
            const logos = ["Acme Corp", "Global Bank", "Nebula AI", "Vertex Systems", "Quantum", "Starlight"];
            
            return (
                <div className="w-full border-y border-white/5 bg-white/[0.02] py-8 overflow-hidden">
                    <div className="flex gap-16 animate-[marquee_30s_linear_infinite] w-max items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {[...logos, ...logos].map((logo, i) => (
                            <span key={i} className="text-xl font-bold tracking-widest uppercase text-slate-400 font-mono">
                                {logo}
                            </span>
                        ))}
                    </div>
                </div>
            );
        };

        // 4. Bento Grid Features
        const Features = () => {
            const features = [
                {
                    icon: <Lock className="text-primary" />,
                    title: "End-to-End Encryption",
                    desc: "Your data is encrypted on the device and only decrypted for the intended recipient. We cannot see your messages.",
                    span: "col-span-1 md:col-span-2"
                },
                {
                    icon: <Zap className="text-yellow-400" />,
                    title: "Real-time Sync",
                    desc: "Messages delivered in under 50ms globally via our Edge Network.",
                    span: "col-span-1"
                },
                {
                    icon: <Shield className="text-emerald-400" />,
                    title: "Enterprise Grade Security",
                    desc: "SOC2 Type II certified with SSO and audit logs.",
                    span: "col-span-1"
                },
                {
                    icon: <Globe className="text-blue-400" />,
                    title: "Global Edge Network",
                    desc: "Servers in 42 regions ensure low latency anywhere in the world.",
                    span: "col-span-1 md:col-span-2"
                }
            ];

            return (
                <section className="py-32 relative">
                    <div className="container mx-auto px-6">
                        <div className="mb-20">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Built for scale.</h2>
                            <p className="text-slate-400 text-lg max-w-2xl">
                                Don't let infrastructure slow you down. Nexus handles millions of concurrent connections with ease.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {features.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`${f.span} p-8 rounded-3xl bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-primary/50 transition-colors group`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {f.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                                    <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            );
        };

        // 5. Interactive Stats / Data Section
        const Stats = () => {
            return (
                <section className="py-20 border-y border-white/5 bg-white/[0.01]">
                    <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { val: "99.99%", label: "Uptime SLA" },
                            { val: "50ms", label: "Global Latency" },
                            { val: "10M+", label: "Daily Messages" },
                            { val: "256-bit", label: "Encryption" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center md:text-left">
                                <h4 className="text-4xl font-bold text-white mb-2 tracking-tight">{stat.val}</h4>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>
            );
        };

        // 6. CTA Section
        const CTA = () => {
            return (
                <section className="py-32 relative overflow-hidden">
                    {/* Decorative background glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-primary/20 blur-[120px] rounded-full -z-10" />
                    
                    <div className="container mx-auto px-6 text-center relative z-10">
                        <div className="inline-flex items-center justify-center p-2 px-4 rounded-full bg-white/5 border border-white/10 mb-8 text-sm text-slate-300">
                            <Sparkles size={14} className="text-yellow-400 mr-2" />
                            New: Nexus AI Assistants now available
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Ready to upgrade your <br/>communication stack?</h2>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="h-14 px-10 rounded-full bg-white text-background font-bold hover:bg-slate-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] flex items-center gap-2 text-lg">
                                Get Started Now <ArrowRight size={20} />
                            </button>
                            <button className="h-14 px-10 rounded-full border border-white/20 hover:bg-white/5 text-white font-medium transition-all text-lg">
                                Contact Sales
                            </button>
                        </div>
                        
                        <p className="mt-8 text-sm text-slate-500">No credit card required • 14-day free trial • Cancel anytime</p>
                    </div>
                </section>
            );
        };

        // 7. Footer
        const Footer = () => {
            return (
                <footer className="border-t border-white/5 bg-black/20 pt-16 pb-8">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                            <div className="col-span-2 lg:col-span-2">
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white">
                                        <MessageSquare size={14} />
                                    </div>
                                    <span className="text-xl font-bold tracking-tight text-white">Nexus</span>
                                </div>
                                <p className="text-slate-500 text-sm max-w-xs mb-6">
                                    Building the future of secure real-time communication for modern engineering teams.
                                </p>
                            </div>
                            
                            {[
                                { title: "Product", links: ["Features", "Integrations", "Changelog", "Docs"] },
                                { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
                                { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
                            ].map((col, i) => (
                                <div key={i}>
                                    <h4 className="text-white font-semibold mb-4">{col.title}</h4>
                                    <ul className="space-y-3">
                                        {col.links.map(link => (
                                            <li key={link}>
                                                <a href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">{link}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-slate-600 text-sm">
                            <p>© {new Date().getFullYear()} Nexus Inc. All rights reserved.</p>
                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <a href="#" className="hover:text-white transition-colors"><Globe size={16} /></a>
                                <a href="#" className="hover:text-white transition-colors"><MessageSquare size={16} /></a>
                                <a href="#" className="hover:text-white transition-colors"><Users size={16} /></a>
                            </div>
                        </div>
                    </div>
                </footer>
            );
        };

        // Main App Component
        const App = () => {
            return (
                <div className="min-h-screen relative text-foreground selection:bg-primary/30 selection:text-primary-foreground">
                    {/* Noise Overlay */}
                    <div className="bg-noise" />
                    
                    {/* Gradient Background Orbs */}
                    <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-20 pointer-events-none">
                        <div className="absolute top-[-10%] right-[0%] w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen" />
                        <div className="absolute bottom-[-10%] left-[0%] w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] mix-blend-screen" />
                    </div>

                    <Navbar />
                    <main>
                        <Hero />
                        <LogoTicker />
                        <Features />
                        <Stats />
                        <CTA />
                    </main>
                    <Footer />
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>