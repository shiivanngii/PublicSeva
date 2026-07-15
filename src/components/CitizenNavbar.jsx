import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Sun, Moon } from "lucide-react";
import { logout } from "../utils/auth";

export default function CitizenNavbar({
  mode = "citizen", // "citizen" | "admin"
  adminLinks = [],
} = {}) {
  const navigate = useNavigate();

  // ✅ initialize correctly
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // ✅ sync html + localStorage
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
      <div className="max-w-8xl mx-auto px-8 py-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-10">
          <div
            className="flex items-center gap-2 text-2xl font-bold text-green-700 dark:text-green-400 cursor-pointer"
            onClick={() => navigate("/citizen/home")}
          >
            <Leaf />
            PublicSeva
          </div>

          {/* Main controller logic */}
          <div className="flex gap-6 text-gray-700 dark:text-gray-200 font-medium">
            {mode === "citizen" && (
              <>
                <button onClick={() => navigate("/citizen/home")}>Home</button>
                <button onClick={() => navigate("/citizen/status")}>Check Status</button>
                <button onClick={() => navigate("/citizen/map")}>Map</button>
                <button onClick={() => navigate("/citizen/profile")}>Profile</button>
              </>
            )}

            {mode === "admin" &&
              adminLinks.map((link) => (
                <button key={link.path} onClick={() => navigate(link.path)}>
                  {link.label}
                </button>
              ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
