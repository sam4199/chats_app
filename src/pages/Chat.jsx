import { useState, useEffect, useContext, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { Send, Image as ImageIcon, Heart, Info, ChevronDown, Edit, ArrowLeft } from "lucide-react";

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  
  // Start with no chat selected on mobile, or the global room by default
  const [activeChat, setActiveChat] = useState(null); 
  const messagesEndRef = useRef(null);

  // 1. Fetch Messages from Firebase
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));
    
    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  // 2. Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Send Message
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
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="h-screen bg-background text-foreground flex max-w-5xl mx-auto border-x border-border pb-16 md:pb-0">
      
      {/* --- LEFT SIDEBAR: Contact List --- */}
      <div className={`w-full md:w-80 border-r border-border flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 flex justify-between items-center border-b border-border bg-background/95 backdrop-blur-sm z-10 sticky top-0">
          <div className="flex items-center gap-1 font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity">
            {user?.displayName || "Chats"} <ChevronDown className="w-4 h-4" />
          </div>
          <Edit className="w-6 h-6 cursor-pointer hover:text-primary transition-colors" />
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Global Community Room Tab */}
          <div 
            onClick={() => setActiveChat({ id: "global", name: "Global Community Room" })}
            className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors hover:bg-muted/50 ${activeChat?.id === "global" ? 'bg-muted' : ''}`}
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-full border border-border bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                🌍
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Global Community Room</p>
              <p className="text-xs text-muted-foreground truncate">Join the public chat...</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: Chat Window --- */}
      <div className={`flex-1 flex-col ${activeChat ? 'flex' : 'hidden md:flex'} bg-background`}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border flex justify-between items-center bg-background/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveChat(null)} 
                  className="md:hidden p-1 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="w-10 h-10 rounded-full border border-border bg-primary/20 flex items-center justify-center text-lg">🌍</div>
                <span className="font-bold text-sm">{activeChat.name}</span>
              </div>
              <Info className="w-6 h-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 custom-scrollbar">
              <div className="text-center text-xs text-muted-foreground my-4">Welcome to the Global Chat!</div>
              
              {messages.map((msg) => {
                const isMe = msg.user === user?.email;

                return (
                  <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMe ? 'self-end' : 'self-start'}`}>
                    {!isMe && (
                      <span className="text-[10px] text-muted-foreground ml-2 mb-1">
                        {msg.displayName || msg.user}
                      </span>
                    )}
                    <div 
                      className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm break-words
                        ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-background">
              <form onSubmit={sendMessage} className="flex items-center gap-3 border border-border bg-muted/30 rounded-full px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message..." 
                  className="flex-1 bg-transparent outline-none text-sm py-1 placeholder:text-muted-foreground"
                />
                <div className="flex gap-3 text-muted-foreground items-center">
                  <ImageIcon className="w-5 h-5 cursor-pointer hover:text-foreground transition-colors hidden sm:block" />
                  <button type="submit" disabled={!message.trim()} className="text-primary font-bold text-sm hover:opacity-80 transition-opacity disabled:opacity-50">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
            <div className="w-24 h-24 border-2 border-foreground flex items-center justify-center rounded-full mb-4 shadow-lg shadow-primary/5">
              <Send className="w-12 h-12 text-foreground -ml-1" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Your Messages</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-xs">
              Select a room to start chatting with the community!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}