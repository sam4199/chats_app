import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import MobileNav from "./components/MobileNav";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Search from "./pages/Search";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      {/* ADDED: future prop to fix the warning */}
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-background text-foreground font-sans">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* App Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <div className="flex flex-col h-screen">
                    <Navbar />
                    <div className="flex flex-1 overflow-hidden pt-16">
                      <Sidebar />
                      <main className="flex-1 overflow-y-auto w-full lg:w-auto">
                        <Routes>
                          <Route path="/home" element={<Home />} />
                          <Route path="/create" element={<CreatePost />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/chat" element={<Chat />} />
                          <Route path="/search" element={<Search />} />
                        </Routes>
                      </main>
                    </div>
                    <MobileNav />
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;