import { Routes, Route, Navigate } from "react-router-dom";
import { useContext, lazy, Suspense } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import { Loader2 } from "lucide-react"; // Using the loader you already have in the project

// 1. Dynamically import all your pages instead of standard imports
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));
const Chat = lazy(() => import("./pages/Chat"));
const Search = lazy(() => import("./pages/Search"));
const Landing = lazy(() => import("./pages/Landing"));

function App() {
  const context = useContext(AuthContext);

  if (!context) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse font-semibold">Loading...</div>
      </div>
    );
  }

  const { user } = context;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 2. Wrap Routes in Suspense to show a loader while the page chunk downloads */}
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
              {/* Unauthenticated users see the Landing page at "/" */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<Navigate to="/" />} /> 
            </>
          ) : (
            <>
              {/* Authenticated users see Home at "/" */}
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