import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";
import { Heart, Star, Clock } from "lucide-react";
import { motion as Motion } from "framer-motion";

const PLACEHOLDER = "https://placehold.co/300x445?text=No+Poster";

export default function MovieCard({ movie }) {
  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToWatchLater,
    removeFromWatchLater,
    isInWatchLater,
  } = useMovies();

  // Handle ID compatibility (OMDb vs TMDb)
  const movieId = movie.imdbID || movie.id;
  const title = movie.Title || movie.title;

  const favorite = isFavorite(movieId);
  const inWatchLater = isInWatchLater(movieId);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  // Load saved rating from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`movie_rating_${movieId}`);
    if (saved) setRating(Number(saved));
  }, [movieId]);

  // Sync rating across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === `movie_rating_${movieId}`) {
        const saved = localStorage.getItem(`movie_rating_${movieId}`);
        setRating(saved ? Number(saved) : 0);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [movieId]);

  const handleRating = (value) => {
    setRating(value);
    localStorage.setItem(`movie_rating_${movieId}`, value);
  };

  const resetRating = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setRating(0);
    localStorage.removeItem(`movie_rating_${movieId}`);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    favorite
      ? removeFromFavorites(movieId)
      : addToFavorites({ ...movie, imdbID: movieId });
  };

  const handleWatchLaterClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    inWatchLater
      ? removeFromWatchLater(movieId)
      : addToWatchLater({ ...movie, imdbID: movieId });
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <Link
        to={`/movie/${movieId}`}
        aria-label={`View details for ${title}`}
        className="group relative block"
      >
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : movie.Poster && movie.Poster !== "N/A"
              ? movie.Poster
              : PLACEHOLDER
          }
          alt={title}
          className="w-full h-[350px] object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute top-3 right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition ${
            favorite ? "text-red-500" : "text-gray-300 hover:text-red-400"
          }`}
        >
          <Heart fill={favorite ? "red" : "none"} size={18} />
        </button>

        {/* Watch Later Button */}
        <button
          onClick={handleWatchLaterClick}
          aria-label={
            inWatchLater ? "Remove from Watch Later" : "Add to Watch Later"
          }
          className={`absolute top-3 left-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition ${
            inWatchLater
              ? "text-yellow-400"
              : "text-gray-300 hover:text-yellow-300"
          }`}
        >
          <Clock fill={inWatchLater ? "yellow" : "none"} size={18} />
        </button>
      </Link>

      {/* Info Section */}
      <div className="p-3 flex flex-col gap-2">
        <h3
          className="text-gray-100 font-semibold text-sm truncate"
          title={title}
        >
          {title}
        </h3>

        <p className="text-gray-400 text-xs flex items-center gap-1">
          {movie.release_date
            ? movie.release_date.slice(0, 4)
            : movie.Year || "N/A"}{" "}
          •
          <span className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400" />{" "}
            {movie.vote_average?.toFixed(1) || movie.imdbRating || "N/A"}
          </span>
        </p>

        {/* ⭐ User Rating */}
        <div className="flex mt-1">
          {[...Array(10)].map((_, i) => {
            const value = i + 1;
            const active = (hover || rating) >= value;
            return (
              <Star
                key={value}
                size={15}
                className={`cursor-pointer transition-transform duration-150 hover:scale-125 ${
                  active ? "text-yellow-400" : "text-gray-600"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRating(value);
                }}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(null)}
                fill={active ? "yellow" : "none"}
              />
            );
          })}
        </div>

        {rating > 0 && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] bg-yellow-400/90 text-black px-2 rounded-md font-medium">
              Rated {rating}/10
            </span>
            <button
              onClick={resetRating}
              className="text-[11px] text-gray-400 hover:text-red-400 transition"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </Motion.div>
  );
}
