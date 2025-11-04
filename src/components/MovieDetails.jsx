import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { MovieContext } from "../context/MovieContext";

const API_KEY = "fa6f055c70ebe532bb30eceda30c7ade";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);

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
      try {
        setLoading(true);

        // Try fetching as movie
        let res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
        );

        // If not found, try TV show endpoint
        if (!res.ok) {
          console.warn(`Movie ID ${id} not found. Trying TV...`);
          res = await fetch(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
          );
        }

        if (!res.ok) throw new Error(`No data found for ID ${id}`);

        const data = await res.json();
        setMovie(data);

        // Fetch trailer
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/${
            data.title ? "movie" : "tv"
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
        console.error("Error fetching details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8 text-gray-400">
        <div className="animate-pulse flex flex-col md:flex-row gap-6">
          <div className="bg-gray-700 rounded-lg h-[450px] w-full md:w-1/3" />
          <div className="flex-1 space-y-4">
            <div className="bg-gray-700 h-8 w-2/3 rounded" />
            <div className="bg-gray-700 h-4 w-1/2 rounded" />
            <div className="bg-gray-700 h-4 w-1/3 rounded" />
            <div className="bg-gray-700 h-24 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return <p className="text-gray-400 text-center mt-10">Movie not found.</p>;
  }

  const imdbRating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <div className="relative">
      {/* ✅ Background Blur */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-25 blur-2xl"
        style={{
          backgroundImage: `url(${
            movie.backdrop_path
              ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
              : "https://placehold.co/1200x600?text=No+Backdrop"
          })`,
        }}
      />

      <div className="max-w-5xl mx-auto p-4 sm:p-6 text-gray-100">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://placehold.co/400x600?text=No+Poster"
            }
            alt={movie.title || movie.name}
            className="rounded-lg w-full md:w-1/3 shadow-2xl"
          />

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
              {movie.title || movie.name}
            </h1>
            <p className="text-gray-400 mb-4 text-center md:text-left">
              {movie.release_date || movie.first_air_date || "Unknown"}
            </p>

            {/* ✅ Centered TMDB Rating */}
            <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
              <Star fill="gold" className="text-yellow-400" size={24} />
              <span className="text-2xl font-bold">{imdbRating}</span>
              <span className="text-gray-400 text-base">/ 10</span>
              <span className="text-gray-500 text-sm ml-2">
                ({movie.vote_count?.toLocaleString() || 0} votes)
              </span>
            </div>

            {/* ✅ Overview */}
            <p className="leading-relaxed text-gray-300 text-center md:text-left">
              {movie.overview || "No overview available."}
            </p>

            {/* ✅ Extra Info */}
            <div className="mt-6 text-sm text-gray-400 space-y-1 text-center md:text-left">
              <p>
                <strong className="text-gray-200">Runtime:</strong>{" "}
                {movie.runtime
                  ? `${movie.runtime} min`
                  : movie.episode_run_time?.[0]
                  ? `${movie.episode_run_time[0]} min`
                  : "N/A"}
              </p>
              <p>
                <strong className="text-gray-200">Genres:</strong>{" "}
                {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
              </p>
              <p>
                <strong className="text-gray-200">Language:</strong>{" "}
                {movie.original_language?.toUpperCase() || "N/A"}
              </p>
              <p>
                <strong className="text-gray-200">Status:</strong>{" "}
                {movie.status || "N/A"}
              </p>
            </div>

            {/* ✅ Actions */}
            <div className="mt-6 flex justify-center md:justify-start flex-wrap gap-3">
              {/* Favorites */}
              <button
                onClick={() =>
                  isFavorite(movie.id)
                    ? removeFromFavorites(movie.id)
                    : addToFavorites(movie)
                }
                className={`px-5 py-2 rounded text-white font-medium transition ${
                  isFavorite(movie.id)
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isFavorite(movie.id)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>

              {/* Watch Later */}
              <button
                onClick={() =>
                  isInWatchLater(movie.id)
                    ? removeFromWatchLater(movie.id)
                    : addToWatchLater(movie)
                }
                className={`px-5 py-2 rounded text-white font-medium transition ${
                  isInWatchLater(movie.id)
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isInWatchLater(movie.id)
                  ? "Remove from Watch Later"
                  : "Add to Watch Later"}
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Trailer Section */}
        {trailerKey && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
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
