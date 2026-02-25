import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Search from "./pages/Search"; // <-- Imported Search
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
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/" />} /> 
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/search" element={<Search />} /> {/* <-- Added Search Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;