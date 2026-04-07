// Chat.jsx
import { useState, useEffect, useContext, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Image as ImageIcon, Heart, Info, ChevronDown, 
  Edit3, ArrowLeft, MoreVertical, Phone, Video, Smile,
  Check, CheckCheck
} from "lucide-react";

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!message.trim() || !user) return;

    const textToSend = message;
    setMessage("");
    
    try {
      await addDoc(collection(db, "messages"), {
        text: textToSend,
        user: user.email,
        displayName: user.displayName || "User",
        userId: user.uid,
        createdAt: serverTimestamp(),
        read: false
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen bg-background text-foreground flex max-w-6xl mx-auto border-x border-border relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Left Sidebar */}
      <div className={`w-full md:w-80 border-r border-border flex-col bg-card/30 backdrop-blur-sm ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 flex justify-between items-center border-b border-border bg-background/95 backdrop-blur-xl sticky top-0 z-10">
          <div className="flex items-center gap-2 font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity group">
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {user?.displayName || "Chats"}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-muted rounded-xl transition-colors"
          >
            <Edit3 className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {/* Search Bar */}
          <div className="px-2 mb-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-xl text-sm focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Global Room */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            onClick={() => setActiveChat({ id: "global", name: "Global Community", avatar: "🌍" })}
            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${activeChat?.id === "global" ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50 border border-transparent'}`}
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-2xl border-2 border-background shadow-lg">
                🌍
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold truncate">Global Community</p>
                <span className="text-xs text-muted-foreground">Now</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">Join the public conversation...</p>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="px-3 py-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</span>
          </div>
        </div>
      </div>

      {/* Right Side - Chat Window */}
      <div className={`flex-1 flex-col ${activeChat ? 'flex' : 'hidden md:flex'} bg-background/50 backdrop-blur-sm`}>
        <AnimatePresence mode="wait">
          {activeChat ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col h-full"
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex justify-between items-center bg-background/95 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveChat(null)} 
                    className="md:hidden p-2 -ml-2 hover:bg-muted rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-lg border-2 border-background shadow-md">
                      {activeChat.avatar}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block">{activeChat.name}</span>
                    <span className="text-xs text-green-500 font-medium">Active now</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Connected to Global Community
                  </div>
                </div>
                
                {messages.map((msg, index) => {
                  const isMe = msg.userId === user?.uid;
                  const showAvatar = index === 0 || messages[index - 1]?.userId !== msg.userId;

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      key={msg.id} 
                      className={`flex gap-3 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                    >
                      {!isMe && showAvatar && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
                          {(msg.displayName || "U")[0].toUpperCase()}
                        </div>
                      )}
                      {!isMe && !showAvatar && <div className="w-8 shrink-0" />}
                      
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {showAvatar && !isMe && (
                          <span className="text-[10px] text-muted-foreground mb-1 ml-1">
                            {msg.displayName || "User"}
                          </span>
                        )}
                        <div 
                          className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm break-words relative group
                            ${isMe 
                              ? 'bg-gradient-to-br from-primary to-purple-600 text-white rounded-tr-sm' 
                              : 'bg-card border border-border/50 text-foreground rounded-tl-sm'
                            }`}
                        >
                          <p className="leading-relaxed">{msg.text}</p>
                          <div className={`flex items-center gap-1 mt-1 ${isMe ? 'text-white/70' : 'text-muted-foreground'}`}>
                            <span className="text-[10px]">{formatTime(msg.createdAt)}</span>
                            {isMe && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border bg-background/95 backdrop-blur-xl">
                <form onSubmit={sendMessage} className="flex items-center gap-3">
                  <button type="button" className="p-2.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..." 
                      className="w-full h-12 pl-4 pr-12 bg-muted/50 border border-border rounded-full focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all outline-none text-sm"
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit" 
                    disabled={!message.trim()}
                    className="p-3 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-8"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6 shadow-2xl shadow-primary/10">
                <Send className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
              <p className="text-muted-foreground max-w-sm mb-8">
                Select a conversation to start chatting with friends and communities
              </p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveChat({ id: "global", name: "Global Community", avatar: "🌍" })}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
              >
                Join Global Chat
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Add SearchIcon component since it was missing
function SearchIcon(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}