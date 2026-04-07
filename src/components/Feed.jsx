// components/feed/PostCard.jsx
import { memo } from 'react';

const PostCard = memo(({ post, onLike }) => {
  return (
    // Your post JSX
  );
}, (prevProps, nextProps) => {
  return prevProps.post.id === nextProps.post.id && 
         prevProps.post.likes === nextProps.post.likes;
});

export default PostCard;