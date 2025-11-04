/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";

export const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);

  // ✅ Load from localStorage on mount
  useEffect(() => {
    const fav = localStorage.getItem("favorites");
    if (fav) setFavorites(JSON.parse(fav));

    const watch = localStorage.getItem("watchLater");
    if (watch) setWatchLater(JSON.parse(watch));
  }, []);

  // ✅ Persist favorites
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ✅ Persist watch later
  useEffect(() => {
    localStorage.setItem("watchLater", JSON.stringify(watchLater));
  }, [watchLater]);

  // ✅ Add to favorites (prevents duplicates)
  const addToFavorites = (movie) =>
    setFavorites((prev) => {
      if (prev.find((m) => m.id === movie.id || m.imdbID === movie.imdbID)) {
        return prev;
      }
      const updated = [...prev, movie];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });

  // ✅ Remove from favorites — flexible ID match
  const removeFromFavorites = (identifier) => {
    const idStr = String(identifier);
    setFavorites((prev) => {
      const updated = prev.filter((m) => {
        const ids = [m.id, m.imdbID, m.imdb_id, m.id_str].filter(Boolean);
        return !ids.some((cand) => String(cand) === idStr);
      });
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ Check if favorite
  const isFavorite = (id) =>
    favorites.some((m) => String(m.id) === String(id) || String(m.imdbID) === String(id));

  // ✅ Add to watch later
  const addToWatchLater = (movie) =>
    setWatchLater((prev) => {
      if (prev.find((m) => m.id === movie.id || m.imdbID === movie.imdbID)) {
        return prev;
      }
      const updated = [...prev, movie];
      localStorage.setItem("watchLater", JSON.stringify(updated));
      return updated;
    });

  // ✅ Remove from watch later — flexible ID match
  const removeFromWatchLater = (identifier) => {
    const idStr = String(identifier);
    setWatchLater((prev) => {
      const updated = prev.filter((m) => {
        const ids = [m.id, m.imdbID, m.imdb_id, m.id_str].filter(Boolean);
        return !ids.some((cand) => String(cand) === idStr);
      });
      localStorage.setItem("watchLater", JSON.stringify(updated));
      return updated;
    });
  };

  // ✅ Check if in watch later
  const isInWatchLater = (id) =>
    watchLater.some((m) => String(m.id) === String(id) || String(m.imdbID) === String(id));

  return (
    <MovieContext.Provider
      value={{
        favorites,
        watchLater,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addToWatchLater,
        removeFromWatchLater,
        isInWatchLater,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}
