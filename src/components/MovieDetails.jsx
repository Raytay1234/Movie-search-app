import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { MovieContext } from "../context/MovieContext";

const API_KEY = "fa6f055c70ebe532bb30eceda30c7ade";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [loading, setLoading] = useState(true);

  const { addToWatchLater, watchLater, addToFavorites, favorites } =
    useContext(MovieContext);

  const isInWatchLater = watchLater.some((m) => m.id === movie?.id);
  const isFavorite = favorites.some((m) => m.id === movie?.id);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchMovie() {
      try {
        setLoading(true);

        // Try fetching movie details
        let detailsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`
        );

        // If movie not found, try TV show instead
        if (!detailsRes.ok) {
          console.warn(`Movie ID ${id} not found. Trying TV endpoint...`);
          detailsRes = await fetch(
            `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`
          );
        }

        if (!detailsRes.ok) {
          throw new Error(`No data found for ID ${id}`);
        }

        const detailsData = await detailsRes.json();
        setMovie(detailsData);

        // Fetch trailer (only if movie/TV exists)
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/${detailsData.title ? "movie" : "tv"}/${id}/videos?api_key=${API_KEY}&language=en-US`
        );

        if (videoRes.ok) {
          const videoData = await videoRes.json();
          const trailer = videoData?.results?.find(
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

  useEffect(() => {
    const saved = localStorage.getItem(`movie_rating_${id}`);
    if (saved) setUserRating(Number(saved));
  }, [id]);

  const handleRating = (value) => {
    setUserRating(value);
    localStorage.setItem(`movie_rating_${id}`, value);
  };

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
      {/* ✅ Blurred background */}
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

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">
              {movie.title || movie.name}
            </h1>
            <p className="text-gray-400 mb-4">
              {movie.release_date || movie.first_air_date || "Unknown"}
            </p>

            {/* ✅ TMDB Rating */}
            <div className="flex items-center gap-2 mb-4">
              <Star fill="gold" className="text-yellow-400" size={20} />
              <span className="text-lg font-semibold">{imdbRating}</span>
              <span className="text-gray-400 text-sm">/ 10</span>
              <span className="text-gray-500 text-xs ml-2">
                ({movie.vote_count?.toLocaleString() || 0} votes)
              </span>
            </div>

            {/* ✅ User Rating */}
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Your Rating:</p>
              <div className="flex gap-1">
                {[...Array(10)].map((_, i) => {
                  const value = i + 1;
                  const active = (hover || userRating) >= value;
                  return (
                    <Star
                      key={value}
                      size={22}
                      className={`cursor-pointer transition-transform duration-150 hover:scale-125 ${
                        active ? "text-yellow-400" : "text-gray-600"
                      }`}
                      onClick={() => handleRating(value)}
                      onMouseEnter={() => setHover(value)}
                      onMouseLeave={() => setHover(null)}
                      fill={active ? "yellow" : "none"}
                    />
                  );
                })}
              </div>
              {userRating > 0 && (
                <p className="text-sm text-gray-300 mt-1">
                  You rated this{" "}
                  <span className="font-semibold">{userRating}/10</span>
                </p>
              )}
            </div>

            {/* ✅ Overview */}
            <p className="leading-relaxed mt-6">
              {movie.overview || "No overview available."}
            </p>

            {/* ✅ Extra info */}
            <div className="mt-6 text-sm text-gray-400 space-y-1">
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

            {/* ✅ Watch Later + Favorites */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => (isFavorite ? null : addToFavorites(movie))}
                disabled={isFavorite}
                className={`px-4 py-2 rounded text-white font-medium ${
                  isFavorite
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isFavorite ? "Added to Favorites" : "Add to Favorites"}
              </button>

              <button
                onClick={() => (isInWatchLater ? null : addToWatchLater(movie))}
                disabled={isInWatchLater}
                className={`px-4 py-2 rounded text-white font-medium ${
                  isInWatchLater
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isInWatchLater ? "In Watch Later" : "Add to Watch Later"}
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
