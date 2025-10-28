import React, { useState, useEffect } from "react";
import { MovieContext } from "./MovieContext";

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [watchLater, setWatchLater] = useState(() => {
    const saved = localStorage.getItem("watchLater");
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("watchLater", JSON.stringify(watchLater));
  }, [watchLater]);

  const triggerToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2000);
  };

  // --- FAVORITES ---
  const addToFavorites = (movie) => {
    if (!favorites.find((m) => m.imdbID === movie.imdbID)) {
      setFavorites((prev) => [...prev, movie]);
      triggerToast("Added to favorites!");
    } else {
      triggerToast("Already in favorites!");
    }
  };

  const removeFromFavorites = (imdbID) => {
    setFavorites((prev) => prev.filter((m) => m.imdbID !== imdbID));
    triggerToast("Removed from favorites.");
  };

  const isFavorite = (imdbID) => favorites.some((m) => m.imdbID === imdbID);

  // --- WATCH LATER ---
  const addToWatchLater = (movie) => {
    if (!watchLater.find((m) => m.imdbID === movie.imdbID)) {
      setWatchLater((prev) => [...prev, movie]);
      triggerToast("Added to Watch Later!");
    } else {
      triggerToast("Already in Watch Later!");
    }
  };

  const removeFromWatchLater = (imdbID) => {
    setWatchLater((prev) => prev.filter((m) => m.imdbID !== imdbID));
    triggerToast("Removed from Watch Later.");
  };

  const isInWatchLater = (imdbID) => watchLater.some((m) => m.imdbID === imdbID);

  return (
    <MovieContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        watchLater,
        addToWatchLater,
        removeFromWatchLater,
        isInWatchLater,
        toast,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
