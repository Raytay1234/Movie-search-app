import React, { useState } from "react";
import { Moon, Sun, Save, Bell, Lock, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { darkMode, setDarkMode } = useTheme();

  const [username, setUsername] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) ?? true
  );
  const [message, setMessage] = useState("");

  const handleSave = () => {
    updateProfile({ name: username, email }); // 🔄 sync to AuthContext

    localStorage.setItem("notifications", JSON.stringify(notifications));
    if (password) localStorage.setItem("password", password);

    setMessage("✅ Settings saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? "bg-gray-950 text-white" : "bg-gray-100 text-gray-900"}
        flex items-center justify-center px-4 py-10 transition-colors duration-300`}
    >
      <div className="dark:bg-gray-900/90 bg-white border border-gray-800 dark:border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg transition-all">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-500">Account Settings</h1>

        <div className="flex flex-col items-center mb-8">
          <img
            src={user?.avatar || `https://i.pravatar.cc/120?u=${email || username}`}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg object-cover"
          />
          <h2 className="text-lg mt-3 font-semibold">{username || "Your Name"}</h2>
          <p className="text-sm opacity-70">{email || "you@example.com"}</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-gray-400">
              <User size={16} /> Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-400">
              <Lock size={16} /> Change Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Enter new password"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-400">
              <Bell size={16} /> Notifications
            </label>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`px-4 py-2 rounded-lg font-medium transition ${notifications ? "bg-indigo-600" : "bg-gray-700"
                }`}
            >
              {notifications ? "Enabled" : "Disabled"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-400">
              {darkMode ? <Moon size={16} /> : <Sun size={16} />} Dark Mode
            </label>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg font-medium transition ${darkMode ? "bg-indigo-600" : "bg-gray-700"
                }`}
            >
              {darkMode ? "On" : "Off"}
            </button>
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-lg font-semibold transition"
          >
            <Save size={18} />
            Save Changes
          </button>

          {message && (
            <p className="text-green-400 text-center text-sm mt-3 animate-pulse">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
