import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    // Charge la préférence depuis localStorage ou détecte automatiquement
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <button onClick={() => setDarkMode(!darkMode)} style={{ marginLeft: "auto" }}>
      {darkMode ? <FaSun/> : <FaMoon/>}
    </button>
  );
}

export default DarkModeToggle;