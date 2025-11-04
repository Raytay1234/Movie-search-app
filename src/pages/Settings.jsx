import React, { useState, useEffect } from "react";
import { Moon, Sun, Save, Bell, Lock, User } from "lucide-react";

export default function Settings() {
  // Load user data and preferences from localStorage
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) ?? true
  );
  const [message, setMessage] = useState("");

  // Apply dark mode theme instantly
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSave = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    localStorage.setItem("notifications", JSON.stringify(notifications));
    if (password) localStorage.setItem("password", password); // simple demo storage

    setMessage("✅ Settings saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 to-gray-900 text-white flex items-center justify-center px-4 py-10">
      <div className="bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg transition-all">
        <h1 className="text-3xl font-bold text-center mb-8 text-indigo-400">
          Account Settings
        </h1>

        {/* Profile Preview */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={`https://i.pravatar.cc/120?u=${email || username}`}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-lg object-cover"
            />
          </div>
          <h2 className="text-lg mt-3 font-semibold text-gray-100">{username || "Your Name"}</h2>
          <p className="text-sm text-gray-400">{email || "you@example.com"}</p>
        </div>

        <div className="space-y-5">
          {/* Username */}
          <div>
            <label className=" text-gray-400 mb-1 flex items-center gap-2">
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

          {/* Email */}
          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Enter your email"
            />
          </div>

          {/* Change Password */}
          <div>
            <label className=" text-gray-400 mb-1 flex items-center gap-2">
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

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-400">
              <Bell size={16} /> Notifications
            </label>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                notifications ? "bg-indigo-600" : "bg-gray-700"
              }`}
            >
              {notifications ? "Enabled" : "Disabled"}
            </button>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-400">
              {darkMode ? <Moon size={16} /> : <Sun size={16} />}
              Dark Mode
            </label>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                darkMode ? "bg-indigo-600" : "bg-gray-700"
              }`}
            >
              {darkMode ? "On" : "Off"}
            </button>
          </div>

          {/* Save Button */}
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
