// src/hooks/useMovies.js
import { useContext } from "react";
import { MovieContext } from "../context/MovieContext";

/**
 * Custom hook to access the global MovieContext.
 * Provides state and actions for favorites, watch later, etc.
 *
 * @returns {object} Movie context values and functions
 */
export const useMovies = () => {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error(
      "❌ useMovies must be used within a <MovieProvider>. Make sure your component tree is wrapped in MovieProvider."
    );
  }

  return context;
};
