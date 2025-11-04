/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from "react";

export const WatchLaterContext = createContext();

export function WatchLaterProvider({ children }) {
  const [watchLater, setWatchLater] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("watch_later_v1");
    if (stored) setWatchLater(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("watch_later_v1", JSON.stringify(watchLater));
  }, [watchLater]);

  const addToWatchLater = (movie) => {
    if (!watchLater.some((m) => m.id === movie.id)) {
      setWatchLater([...watchLater, movie]);
    }
  };

  const removeFromWatchLater = (id) => {
    setWatchLater(watchLater.filter((m) => m.id !== id));
  };

  const isInWatchLater = (id) => watchLater.some((m) => m.id === id);

  return (
    <WatchLaterContext.Provider
      value={{ watchLater, addToWatchLater, removeFromWatchLater, isInWatchLater }}
    >
      {children}
    </WatchLaterContext.Provider>
  );
}
