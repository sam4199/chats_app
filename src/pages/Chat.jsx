import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Image as ImageIcon, Smile, ArrowLeft, Phone, Video, MoreVertical, Hash } from "lucide-react";

export default function Chat() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
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

    try {
      await addDoc(collection(db, "messages"), {
        text: message,
        userId: user.uid,
        user: user.email,
        displayName: user.displayName || "User",
        createdAt: serverTimestamp()
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-border flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-border flex items-center justify-between bg-background/95 backdrop-blur-xl">
          <h2 className="font-bold text-lg">{user?.displayName || "Messages"}</h2>
          <button className="p-2 hover:bg-muted rounded-full"><MoreVertical size={20} /></button>
        </div>
        
        <div className="p-3">
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input type="text" placeholder="Search" className="w-full h-10 pl-10 pr-4 bg-muted/50 rounded-xl border-transparent focus:bg-background focus:border-border outline-none text-sm" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div onClick={() => setActiveChat({ id: "global", name: "Global Chat", members: 1240 })} 
            className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors ${activeChat?.id === "global" ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-lg">🌍</div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Global Community</h3>
              <p className="text-xs text-muted-foreground truncate">Join the public chat...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 flex-col ${activeChat ? 'flex' : 'hidden md:flex'} bg-background`}>
        {activeChat ? (
          <>
            <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-background/95 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 hover:bg-muted rounded-full">
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">🌍</div>
                <div>
                  <h3 className="font-bold text-sm">{activeChat.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {activeChat.members} online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-muted rounded-full text-muted-foreground"><Phone size={18} /></button>
                <button className="p-2.5 hover:bg-muted rounded-full text-muted-foreground"><Video size={18} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
              <div className="text-center py-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 text-xs text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Today
                </span>
              </div>

              <AnimatePresence>
                {messages.map((msg, index) => {
                  const isMe = msg.userId === user?.uid;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        {!isMe && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                            {msg.displayName?.[0]}
                          </div>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-card border border-border rounded-bl-sm'}`}>
                          <p>{msg.text}</p>
                          <span className={`text-[10px] mt-1 block ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border bg-background/95 backdrop-blur-xl">
              <form onSubmit={sendMessage} className="flex items-center gap-3">
                <button type="button" className="p-3 text-muted-foreground hover:bg-muted rounded-full transition-colors">
                  <ImageIcon size={20} />
                </button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="w-full h-12 pl-4 pr-12 bg-muted/50 border border-border rounded-full focus:bg-background focus:border-primary/50 outline-none text-sm"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground">
                    <Smile size={18} />
                  </button>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  disabled={!message.trim()}
                  className="p-3 bg-primary text-primary-foreground rounded-full shadow-lg disabled:opacity-50"
                >
                  <Send size={20} className="ml-0.5" />
                </motion.button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6">
              <Send className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
            <p className="text-muted-foreground mb-6">Select a conversation to start chatting</p>
            <button onClick={() => setActiveChat({ id: "global", name: "Global Chat" })} className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold shadow-lg">
              Join Global Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}