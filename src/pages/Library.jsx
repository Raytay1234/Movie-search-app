import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";
import { Heart, Clock, Trash2 } from "lucide-react";

export default function Library() {
    const {
        favorites,
        watchLater,
        removeFromFavorites,
        removeFromWatchLater,
    } = useContext(MovieContext);

    const renderMovieCard = (movie, type) => (
        <div
            key={movie.id}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
        >
            <Link to={`/movie/${movie.id}`}>
                <img
                    src={
                        movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : "https://placehold.co/300x445?text=No+Poster"
                    }
                    alt={movie.title || movie.name}
                    className="w-full h-64 object-cover"
                />
            </Link>
            <div className="p-3 text-gray-200">
                <h3 className="font-semibold text-lg truncate mb-1">
                    {movie.title || movie.name}
                </h3>
                <p className="text-sm text-gray-400">
                    {movie.release_date || movie.first_air_date || "Unknown"}
                </p>

                <button
                    onClick={() =>
                        type === "fav"
                            ? removeFromFavorites(movie.id)
                            : removeFromWatchLater(movie.id)
                    }
                    className="mt-3 w-full py-1.5 rounded bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 text-sm"
                >
                    <Trash2 size={16} />
                    Remove
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 text-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center">My Library</h1>

            {/* ✅ Favorites Section */}
            <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <Heart className="text-pink-500" />
                    <h2 className="text-2xl font-semibold">Favorites</h2>
                </div>
                {favorites.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                        {favorites.map((movie) => renderMovieCard(movie, "fav"))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-6">
                        You haven’t added any favorites yet.
                    </p>
                )}
            </section>

            {/* ✅ Watch Later Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="text-green-500" />
                    <h2 className="text-2xl font-semibold">Watch Later</h2>
                </div>
                {watchLater.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                        {watchLater.map((movie) => renderMovieCard(movie, "watch"))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-6">
                        You haven’t added anything to Watch Later.
                    </p>
                )}
            </section>
        </div>
    );
}
