import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function Post() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="bg-card text-card-foreground border border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/50 rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-sm">
            JD
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm group-hover:underline">John Doe</h3>
              <span className="text-xs text-muted-foreground font-medium">• 2h</span>
            </div>
            <p className="text-xs text-muted-foreground">@johndoe_ui</p>
          </div>
        </div>
        
        <button className="text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm mb-3 leading-relaxed text-foreground/90">
          Just exploring this amazing new app layout! The dark mode toggle is super smooth, and the new color theme looks incredibly professional. 🚀✨
        </p>
        
        {/* Image Attachment Placeholder */}
        <div className="w-full aspect-video bg-muted/50 rounded-2xl flex items-center justify-center text-muted-foreground font-medium border border-border overflow-hidden">
          Image Attachment
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-3 py-3 border-t border-border/50 bg-muted/10">
        <div className="flex gap-2 text-muted-foreground">
          
          <button 
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 p-2 rounded-full transition-all hover:bg-destructive/10 ${liked ? "text-destructive" : "hover:text-destructive"}`}
          >
            <Heart size={20} fill={liked ? "currentColor" : "none"} className={liked ? "scale-110 transition-transform" : ""} />
            <span className="text-xs font-bold">{liked ? "125" : "124"}</span>
          </button>
          
          <button className="flex items-center gap-1.5 p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
            <MessageCircle size={20} />
            <span className="text-xs font-bold">24</span>
          </button>
          
          <button className="flex items-center gap-1.5 p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
            <Share2 size={20} />
          </button>

        </div>

        <button 
          onClick={() => setSaved(!saved)}
          className={`p-2 rounded-full transition-all hover:bg-primary/10 ${saved ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
        >
          <Bookmark size={20} fill={saved ? "currentColor" : "none"} className={saved ? "scale-110 transition-transform" : ""} />
        </button>
      </div>
      
    </div>
  );
}