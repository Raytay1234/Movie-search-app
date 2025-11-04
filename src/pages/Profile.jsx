import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Star, Clock, Save, Image } from "lucide-react";

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "https://i.pravatar.cc/150?img=8");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white px-6">
        <h2 className="text-3xl font-semibold mb-4">You’re not logged in.</h2>
        <button
          onClick={() => navigate("/login")}
          className="bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg transition font-medium"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateProfile({ name, avatar });
    setTimeout(() => {
      setIsSaving(false);
      setMessage("✅ Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-gray-950 to-gray-900 text-gray-100 px-4">
      <div className="max-w-lg w-full bg-gray-900/90 backdrop-blur-md border border-gray-800 shadow-2xl rounded-2xl p-8 transition-all">
        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-8 text-indigo-400 tracking-tight">
          Profile Settings
        </h2>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={avatar}
              alt="Profile Avatar"
              className="w-28 h-28 rounded-full border-4 border-indigo-500 shadow-lg object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 p-2 rounded-full cursor-pointer transition">
              <Image size={16} />
              <input
                type="text"
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Paste image URL"
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-400 mt-3">Change your avatar URL below</p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="text-sm text-gray-400 font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full mt-1 px-4 py-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 font-medium">Avatar URL</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Paste new avatar image URL"
              className="w-full mt-1 px-4 py-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 font-medium">Change Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full mt-1 px-4 py-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {message && (
            <p className="text-green-400 text-center text-sm mt-2 animate-pulse">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className={`w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 mt-4 px-4 py-2.5 rounded-lg font-medium transition ${
              isSaving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <Save size={18} />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Quick Links */}
        <div className="mt-8 border-t border-gray-800 pt-5 flex flex-wrap justify-between text-sm">
          <button
            onClick={() => navigate("/favorites")}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition"
          >
            <Star size={16} /> Favorites
          </button>
          <button
            onClick={() => navigate("/watchlater")}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
          >
            <Clock size={16} /> Watch Later
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
