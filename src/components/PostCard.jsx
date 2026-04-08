import { memo } from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import LazyImage from "./LazyImage";

const PostCard = memo(({ post, onLike, isLiked }) => {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img 
            src={post.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.username}`} 
            alt="" 
            className="w-10 h-10 rounded-full bg-muted object-cover ring-2 ring-background" 
          />
          <div>
            <h4 className="font-semibold text-sm text-foreground">{post.username}</h4>
            <p className="text-xs text-muted-foreground">
              {post.createdAt?.toDate?.().toLocaleDateString() || 'Just now'}
            </p>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative aspect-[4/5] sm:aspect-square bg-muted">
          <LazyImage src={post.image} alt="Post content" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Actions & Footer */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onLike(post.id, post.likes)} 
              className="group transition-transform active:scale-90"
            >
              <Heart 
                size={26} 
                className={`transition-all ${isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-foreground group-hover:text-red-500'}`} 
              />
            </button>
            <button className="transition-transform active:scale-90 hover:text-primary">
              <MessageCircle size={26} />
            </button>
            <button className="transition-transform active:scale-90 hover:text-primary">
              <Share2 size={26} />
            </button>
          </div>
          <button className="transition-transform active:scale-90 hover:text-primary">
            <Bookmark size={24} />
          </button>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {post.likes || 0} likes
          </p>
          {post.caption && (
            <p className="text-sm text-foreground">
              <span className="font-semibold mr-2">{post.username}</span>
              {post.caption}
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
});

export default PostCard;