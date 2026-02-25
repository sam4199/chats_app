import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    document.body.classList.toggle("dark");
    setDark(!dark);
  };

  return (
    <div className="navbar">
      <h2>Chats</h2>
      <div>
        <button onClick={toggleDark}>
          {dark ? "☀️" : "🌙"}
        </button>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
}
