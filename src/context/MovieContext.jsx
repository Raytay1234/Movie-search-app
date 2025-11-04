/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";

export const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const fav = localStorage.getItem("favorites");
    if (fav) setFavorites(JSON.parse(fav));

    const watch = localStorage.getItem("watchLater");
    if (watch) setWatchLater(JSON.parse(watch));
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("watchLater", JSON.stringify(watchLater));
  }, [watchLater]);

  // --- Helper: Normalize ID ---
  const getId = (movie) =>
    movie.id || movie.imdbID || `${movie.media_type}-${movie.title || movie.name}`;

  // --- FAVORITES ---
  const addToFavorites = (movie) =>
    setFavorites((prev) => {
      const uid = getId(movie);
      if (prev.some((m) => getId(m) === uid)) return prev;
      return [...prev, movie];
    });

  const removeFromFavorites = (id) =>
    setFavorites((prev) => prev.filter((m) => getId(m) !== id && m.id !== id));

  const isFavorite = (id) =>
    favorites.some((m) => getId(m) === id || m.id === id);

  // --- WATCH LATER ---
  const addToWatchLater = (movie) =>
    setWatchLater((prev) => {
      const uid = getId(movie);
      if (prev.some((m) => getId(m) === uid)) return prev;
      return [...prev, movie];
    });

  const removeFromWatchLater = (id) =>
    setWatchLater((prev) => prev.filter((m) => getId(m) !== id && m.id !== id));

  const isInWatchLater = (id) =>
    watchLater.some((m) => getId(m) === id || m.id === id);

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
