// src/services/postService.js
import { db, storage } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export const createPost = async (userId, image, caption) => {
  // Image upload logic
  // Firestore document creation
  // Return post data
};

export const subscribeToPosts = (callback) => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, callback);
};