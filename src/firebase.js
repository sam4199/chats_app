import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
 apiKey: "AIzaSyD_1d1U8go0mvQigPuE0aY8NIUStVF88_I",
  authDomain: "chats-app-855d0.firebaseapp.com",
  projectId: "chats-app-855d0",
  storageBucket: "chats-app-855d0.firebasestorage.app",
  messagingSenderId: "319111348061",
  appId: "1:319111348061:web:03979844605968e96532b4",
  measurementId: "G-JTLDVK66EZ",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider(); 
