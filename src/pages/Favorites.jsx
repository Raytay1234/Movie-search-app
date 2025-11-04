// src/pages/Favorites.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";

export default function Favorites() {
  const { favorites = [], removeFromFavorites } = useMovies();

  const handleRemove = (movie) => {
    // Normalize id: prefer movie.id (TMDB), fall back to imdbID or any other id field
    const idToRemove = movie.id ?? movie.imdbID ?? movie.imdb_id ?? movie.id_str;
    console.debug("Removing favorite id:", idToRemove, "movie:", movie);
    removeFromFavorites(idToRemove);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-5 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-indigo-400 text-center">
          Your Favorite Movies
        </h1>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <p className="text-gray-400 mb-4 text-lg">
              You haven’t added any favorite movies yet.
            </p>
            <Link
              to="/"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {favorites.map((movie) => (
              <div
                key={movie.id ?? movie.imdbID ?? movie.imdb_id}
                className="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-indigo-700/30 transition duration-300"
              >
                <Link to={`/movie/${movie.id ?? movie.imdbID ?? movie.imdb_id}`}>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/300x450?text=No+Poster"
                    }
                    alt={movie.title || movie.name}
                    className="w-full h-80 object-cover"
                  />
                </Link>
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-gray-100 truncate">
                    {movie.title || movie.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleRemove(movie)}
                    className="text-sm bg-red-600 hover:bg-red-700 rounded px-3 py-1 font-medium transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
