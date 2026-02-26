import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Search from "./pages/Search"; 
import Landing from "./pages/Landing"; // <-- 1. Import your new Landing page
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

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
      <Routes>
        {!user ? (
          <>
            {/* 2. Unauthenticated users see the Landing page at "/" */}
            <Route path="/" element={<Landing />} />
            
            {/* 3. Move Login and Signup to their own explicit routes */}
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
    </div>
  );
}

export default App;