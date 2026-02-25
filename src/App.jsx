import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const context = useContext(AuthContext);

  // Show a smooth loading state while checking Firebase Auth
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
        {/* IF USER IS NOT LOGGED IN */}
        {!user ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Redirect any unknown URLs back to login */}
            <Route path="*" element={<Navigate to="/" />} /> 
          </>
        ) : (
          /* IF USER IS LOGGED IN */
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
            {/* Redirect any unknown URLs back to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;