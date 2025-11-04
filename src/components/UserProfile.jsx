import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings } from "lucide-react";

export default function UserProfile({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 focus:outline-none group"
      >
        <img
          src={user?.avatar || "https://i.pravatar.cc/40?img=8"}
          alt="User Avatar"
          className="w-9 h-9 rounded-full border border-gray-700 group-hover:border-indigo-400 transition"
        />
        <span className="hidden sm:inline-block text-sm text-gray-300 font-medium group-hover:text-white">
          {user?.name || "Guest"}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="py-2 text-sm text-gray-300">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition"
              >
                <User size={16} /> Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition"
              >
                <Settings size={16} /> Settings
              </Link>
              <hr className="border-gray-700 my-1" />
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout?.();
                }}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
