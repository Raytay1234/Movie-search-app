// src/hooks/useFavorites.js
import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load favorites:", error);
      return [];
    }
  });

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  }, [favorites]);

  // Add or remove a movie from favorites
  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === movie.id);
      return exists
        ? prev.filter((fav) => fav.id !== movie.id)
        : [...prev, movie];
    });
  };

  // Explicitly remove a favorite
  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  // Check if a movie is favorited
  const isFavorite = (id) => favorites.some((fav) => fav.id === id);

  return { favorites, toggleFavorite, removeFromFavorites, isFavorite };
}
