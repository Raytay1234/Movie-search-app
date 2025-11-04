import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Star, Play, Heart, Clock } from "lucide-react";
import { MovieContext } from "../context/MovieContext";

const API_KEY = "fa6f055c70ebe532bb30eceda30c7ade";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "https://placehold.co/500x750?text=No+Poster";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    addToWatchLater,
    removeFromWatchLater,
    isInWatchLater,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  } = useContext(MovieContext);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchMovie() {
      setLoading(true);
      setError("");
      try {
        let res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
        );

        // fallback for TV (if user accessed via movie route)
        if (!res.ok) {
          res = await fetch(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
          );
        }

        if (!res.ok) throw new Error("Movie not found");
        const data = await res.json();
        setMovie(data);

        // fetch trailer
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/${data.title ? "movie" : "tv"
          }/${id}/videos?api_key=${API_KEY}&language=en-US`
        );
        if (videoRes.ok) {
          const videoData = await videoRes.json();
          const trailer = videoData.results?.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );
          if (trailer) setTrailerKey(trailer.key);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  if (loading)
    return <p className="text-center py-12 text-gray-400">Loading movie details…</p>;
  if (error)
    return <p className="text-center text-red-500 py-12">{error}</p>;
  if (!movie) return null;

  const fav = isFavorite(movie.id);
  const watch = isInWatchLater(movie.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-100">
      <img
        src={
          movie.poster_path
            ? `${IMAGE_URL}${movie.poster_path}`
            : PLACEHOLDER
        }
        alt={movie.title || movie.name}
        className="rounded-xl shadow-lg w-full"
      />

      <div className="md:col-span-2 space-y-4">
        <h1 className="text-4xl font-bold">
          {movie.title || movie.name}{" "}
          <span className="text-gray-400 text-2xl">
            ({(movie.release_date || movie.first_air_date)?.split("-")[0]})
          </span>
        </h1>

        <p className="text-sm text-gray-400">
          {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
        </p>

        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" size={18} />
          <span className="font-semibold">
            {movie.vote_average?.toFixed(1)} / 10
          </span>
        </div>

        <p className="leading-relaxed text-gray-300">{movie.overview}</p>

        <ul className="text-sm space-y-1">
          {movie.runtime && (
            <li>
              <strong>Runtime:</strong> {movie.runtime} min
            </li>
          )}
          <li>
            <strong>Language:</strong>{" "}
            {movie.original_language?.toUpperCase()}
          </li>
          <li>
            <strong>Status:</strong> {movie.status || "Unknown"}
          </li>
        </ul>

        <div className="flex flex-wrap gap-4 mt-6">
          {/* Favorites */}
          <button
            onClick={() =>
              fav
                ? removeFromFavorites(movie.id)
                : addToFavorites(movie)
            }
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all ${fav
                ? "bg-red-600 hover:bg-red-500"
                : "bg-indigo-600 hover:bg-indigo-500"
              }`}
          >
            <Heart size={18} />
            {fav ? "Remove Favorite" : "Add to Favorites"}
          </button>

          {/* Watch Later */}
          <button
            onClick={() =>
              watch
                ? removeFromWatchLater(movie.id)
                : addToWatchLater(movie)
            }
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-all ${watch
                ? "bg-blue-600 hover:bg-blue-500"
                : "bg-gray-800 hover:bg-gray-700"
              }`}
          >
            <Clock size={18} />
            {watch ? "Remove Watch Later" : "Add to Watch Later"}
          </button>
        </div>

        {trailerKey && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Play size={20} className="text-red-500" />
              Watch Trailer
            </h2>
            <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title={`${movie.title || movie.name} Trailer`}
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
