import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx"; // Fixed import extension
import { Loader2 } from "lucide-react";

// 1. Dynamically import all your pages
// (Added .jsx extensions here as well just to be extra safe with Vite)
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Chat = lazy(() => import("./pages/Chat.jsx"));
const Search = lazy(() => import("./pages/Search.jsx"));
const Landing = lazy(() => import("./pages/Landing.jsx"));

function App() {
  // Use the new custom hook to get user and loading state
  const { user, loading } = useAuth();

  // Show a full-screen loader while Firebase checks auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Wrap Routes in Suspense to handle lazy-loaded chunks */}
      <Suspense 
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        }
      >
        <Routes>
          {!user ? (
            <>
              {/* Unauthenticated Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" />} /> 
            </>
          ) : (
            <>
              {/* Authenticated Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/search" element={<Search />} /> 
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;