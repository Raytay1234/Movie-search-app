import React from "react";
import { Link } from "react-router-dom";
import { Heart, Clock, Star } from "lucide-react";
import { motion as Motion } from "framer-motion";
import { useMovies } from "../hooks/useMovies";

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

  const {
    id,
    imdbID,
    title,
    name,
    poster_path,
    vote_average,
    release_date,
    first_air_date,
    media_type,
  } = movie;

  const displayTitle = title || name || "Untitled";
  const displayDate = release_date || first_air_date || "Unknown";
  const imageUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : PLACEHOLDER;

  const favorite = isFavorite(id || imdbID);
  const watchLater = isInWatchLater(id || imdbID);

  const handleFavoriteToggle = () => {
    if (favorite) removeFromFavorites(id);
    else addToFavorites(movie);
  };

  const handleWatchLaterToggle = () => {
    if (watchLater) removeFromWatchLater(id);
    else addToWatchLater(movie);
  };

  return (
    <Motion.div
      whileHover={{ scale: 1.05 }}
      className="relative bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-indigo-700/30 transition duration-300"
    >
      <Link to={`/${media_type === "tv" ? "tv" : "movie"}/${id}`}>
        <img
          src={imageUrl}
          alt={displayTitle}
          className="w-full h-72 object-cover"
          loading="lazy"
        />
      </Link>

      {/* Top Buttons (Favorite + Watch Later) */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <button
          onClick={handleFavoriteToggle}
          className={`p-2 rounded-full transition ${favorite ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
          aria-label="Toggle Favorite"
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>

        <button
          onClick={handleWatchLaterToggle}
          className={`p-2 rounded-full transition ${watchLater ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-300"
            }`}
          aria-label="Toggle Watch Later"
        >
          <Clock size={18} fill={watchLater ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Movie Details */}
      <div className="p-3 text-gray-100">
        <h3 className="font-semibold text-sm truncate" title={displayTitle}>
          {displayTitle}
        </h3>
        <div className="flex items-center justify-between text-xs text-gray-400 mt-1">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {displayDate.slice(0, 4)}
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400" />{" "}
            {vote_average ? vote_average.toFixed(1) : "N/A"}
          </span>
        </div>
      </div>
    </Motion.div>
  );
}
