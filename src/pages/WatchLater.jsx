import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import { Link } from "react-router-dom";

export default function WatchLater() {
  const { watchLater, removeFromWatchLater } = useContext(MovieContext);

  return (
    <div className="px-5 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">Watch Later</h1>

      {watchLater.length === 0 ? (
        <p className="text-gray-400">You haven’t added any movies yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {watchLater.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-md"
            >
              <Link to={`/movie/${movie.id}`}>
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
              <div className="p-3 flex flex-col gap-2">
                <h2 className="text-base font-semibold text-gray-100">
                  {movie.title || movie.name}
                </h2>
                <button
                  onClick={() => removeFromWatchLater(movie.id)}
                  className="text-sm bg-red-600 hover:bg-red-700 rounded px-3 py-1 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
