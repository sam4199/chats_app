import { memo } from 'react';

const PostCard = memo(({ post, onLike }) => {
  return null; // FIXED: Replaced empty parentheses/comment with 'null'
}, (prevProps, nextProps) => {
  return prevProps.post.id === nextProps.post.id && 
         prevProps.post.likes === nextProps.post.likes;
});

export default PostCard;