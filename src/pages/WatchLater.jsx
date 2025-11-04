import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import { Link } from "react-router-dom";
import { Clock, Trash2, Film } from "lucide-react";

export default function WatchLater() {
  const { watchLater, removeFromWatchLater } = useContext(MovieContext);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-950 to-gray-900 text-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Clock className="text-yellow-400" size={28} />
          <h1 className="text-3xl font-bold text-yellow-400 tracking-tight">
            Watch Later
          </h1>
        </div>

        {/* Empty State */}
        {watchLater.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film size={64} className="text-gray-700 mb-4" />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">
              No movies added yet
            </h2>
            <p className="text-gray-500 mb-6">
              You can save movies to watch later from any movie’s detail page.
            </p>
            <Link
              to="/"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg transition font-medium"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          // Movie Grid
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {watchLater.map((movie) => (
              <div
                key={movie.id}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1"
              >
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://placehold.co/300x450?text=No+Poster"
                    }
                    alt={movie.title || movie.name}
                    className="w-full h-80 object-cover"
                  />
                </Link>

                <div className="p-4 flex flex-col justify-between">
                  <h2 className="text-base font-semibold text-gray-100 truncate mb-3">
                    {movie.title || movie.name}
                  </h2>
                  <button
                    onClick={() => removeFromWatchLater(movie.id)}
                    className="flex items-center justify-center gap-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md px-3 py-2 font-medium transition"
                  >
                    <Trash2 size={16} />
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
