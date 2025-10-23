import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";
import { Heart, Star } from "lucide-react";

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

  // Save rating persistently
  const handleRating = (value) => {
    setRating(value);
    localStorage.setItem(`movie_rating_${movie.id}`, value);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition">
      <Link to={`/movie/${movie.id}`}>
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : PLACEHOLDER
          }
          alt={movie.title}
          className="w-full h-[350px] object-cover"
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
            className={`transition ${
              favorite ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart fill={favorite ? "red" : "none"} size={18} />
          </button>
        </div>

        {/* ⭐ IMDb-style 1–10 Rating System */}
        <div className="flex gap-1 mt-1">
          {[...Array(10)].map((_, i) => {
            const value = i + 1;
            return (
              <Star
                key={value}
                size={16}
                className={`cursor-pointer transition ${
                  (hover || rating) >= value
                    ? "text-yellow-400"
                    : "text-gray-500"
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

        {/* Show numeric rating below */}
        {rating > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            You rated this movie <span className="text-gray-200 font-semibold">{rating}/10</span>
          </p>
        )}
      </div>
    </div>
  );
}
