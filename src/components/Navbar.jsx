import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900/95 backdrop-blur-md fixed w-full top-0 left-0 z-50 shadow-lg border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-5 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-indigo-400">
          Movie<span className="text-white">Vault</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center gap-6">
          <Link to="/" className="text-gray-300 hover:text-indigo-400 transition font-medium">
            Home
          </Link>
          <Link to="/movies" className="text-gray-300 hover:text-indigo-400 transition font-medium">
            Movies
          </Link>
          <Link to="/tvshows" className="text-gray-300 hover:text-indigo-400 transition font-medium">
            TV Shows
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none group"
              >
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full border border-gray-700 group-hover:border-indigo-400 transition"
                />
                <span className="hidden sm:inline-block text-sm text-gray-300 font-medium group-hover:text-white">
                  {user.name}
                </span>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
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
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition"
                      >
                        <User size={16} /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition"
                      >
                        <Settings size={16} /> Settings
                      </Link>
                      <Link
                        to="/library"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition"
                      >
                        📚 Library
                      </Link>
                      <hr className="border-gray-700 my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
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
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-300 hover:text-indigo-400 transition font-medium">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden text-gray-300"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ✅ Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden bg-gray-900 border-t border-gray-800"
          >
            <div className="px-5 py-4 flex flex-col gap-3 text-gray-300">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-indigo-400 transition"
              >
                Home
              </Link>
              <Link
                to="/movies"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-indigo-400 transition"
              >
                Movies
              </Link>
              <Link
                to="/tvShows"
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-indigo-400 transition"
              >
                TV Shows
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-indigo-400 transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-red-400 hover:text-red-300 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-indigo-400 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-indigo-400 transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
