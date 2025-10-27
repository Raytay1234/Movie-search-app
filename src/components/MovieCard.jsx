import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";
import { Heart, Star } from "lucide-react";
import { motion as Motion } from "framer-motion";

const PLACEHOLDER = "https://placehold.co/300x445?text=No+Poster";

export default function MovieCard({ movie }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovies();
  const favorite = isFavorite(movie.id);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  // Load saved rating from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`movie_rating_${movie.id}`);
    if (saved) setRating(Number(saved));
  }, [movie.id]);

  // Sync rating across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === `movie_rating_${movie.id}`) {
        const saved = localStorage.getItem(`movie_rating_${movie.id}`);
        setRating(saved ? Number(saved) : 0);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [movie.id]);

  const handleRating = (value) => {
    setRating(value);
    localStorage.setItem(`movie_rating_${movie.id}`, value);
  };

  const resetRating = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRating(0);
    localStorage.removeItem(`movie_rating_${movie.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
    >
      <Link to={`/movie/${movie.id}`} aria-label={`View details for ${movie.title}`}>
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : PLACEHOLDER
          }
          alt={movie.title}
          className="w-full h-[350px] object-cover transform hover:scale-105 transition duration-300"
        />
      </Link>

      <div className="p-3 flex flex-col gap-2">
        {/* Movie Title + Favorite Button */}
        <div className="flex justify-between items-center">
          <h3 className="text-gray-100 font-semibold text-sm truncate">
            {movie.title}
          </h3>
          <button
            onClick={handleFavoriteClick}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
            className={`transition transform hover:scale-110 ${
              favorite ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart fill={favorite ? "red" : "none"} size={18} />
          </button>
        </div>

        {/* Movie Metadata */}
        <p className="text-gray-400 text-xs">
          {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"} • ⭐{" "}
          {movie.vote_average?.toFixed(1) || "N/A"}
        </p>

        {/* ⭐ Rating System */}
        <div className="flex gap-1 mt-1">
          {[...Array(10)].map((_, i) => {
            const value = i + 1;
            return (
              <Star
                key={value}
                size={16}
                className={`cursor-pointer transition-colors duration-200 ${
                  (hover || rating) >= value
                    ? "text-yellow-400"
                    : "text-gray-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRating(value);
                }}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(null)}
                fill={(hover || rating) >= value ? "yellow" : "none"}
              />
            );
          })}
        </div>

        {/* Rated Badge + Reset */}
        {rating > 0 && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded-md">
              Rated {rating}/10
            </span>
            <button
              onClick={resetRating}
              className="text-xs text-gray-400 hover:text-red-400 transition"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </Motion.div>
  );
}
