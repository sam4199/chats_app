import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function Post({ data }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Destructure with fallbacks to prevent crashes if data is missing
  const {
    username = "User",
    userPhoto = "",
    caption = "",
    imageUrl = "",
    likes = 0,
    comments = 0
  } = data || {};

  return (
    <div className="bg-card text-card-foreground border border-border rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden mb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border border-border">
            {userPhoto ? (
              <img src={userPhoto} alt={username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm group-hover:underline">{username}</h3>
              <span className="text-xs text-muted-foreground font-medium">• Just now</span>
            </div>
            <p className="text-xs text-muted-foreground">@{username.toLowerCase()}</p>
          </div>
        </div>
        
        <button className="text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        {caption && (
          <p className="text-sm mb-3 leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {caption}
          </p>
        )}
        
        {imageUrl && (
          <div className="w-full bg-muted/50 rounded-2xl border border-border overflow-hidden">
            <img src={imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" loading="lazy" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-3 py-3 border-t border-border/50 bg-muted/10">
        <div className="flex gap-2 text-muted-foreground">
          <button 
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 p-2 rounded-full transition-all hover:bg-destructive/10 ${liked ? "text-destructive" : "hover:text-destructive"}`}
          >
            <Heart size={20} fill={liked ? "currentColor" : "none"} className={liked ? "scale-110 transition-transform" : ""} />
            <span className="text-xs font-bold">{liked ? likes + 1 : likes}</span>
          </button>
          
          <button className="flex items-center gap-1.5 p-2 rounded-full hover:bg-primary/10 hover:text-primary transition-all">
            <MessageCircle size={20} />
            <span className="text-xs font-bold">{comments}</span>
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