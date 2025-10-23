import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Play } from "lucide-react";

const API_KEY = "fa6f055c70ebe532bb30eceda30c7ade";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hover, setHover] = useState(null);

  // Fetch movie details
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`)
      .then((res) => res.json())
      .then(setMovie)
      .catch(console.error);
  }, [id]);

  // Fetch movie trailers
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`)
      .then((res) => res.json())
      .then((data) => {
        const trailer = data.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) setTrailerKey(trailer.key);
      })
      .catch(console.error);
  }, [id]);

  // Load saved rating
  useEffect(() => {
    const saved = localStorage.getItem(`movie_rating_${id}`);
    if (saved) setUserRating(Number(saved));
  }, [id]);

  const handleRating = (value) => {
    setUserRating(value);
    localStorage.setItem(`movie_rating_${id}`, value);
  };

  if (!movie) return <p className="text-gray-400 text-center mt-10">Loading...</p>;

  const imdbStyleRating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 text-gray-100">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://placehold.co/400x600?text=No+Poster"
          }
          alt={movie.title}
          className="rounded-lg w-full md:w-1/3 shadow-lg"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-1">{movie.title}</h1>
          <p className="text-gray-400 mb-4">{movie.release_date}</p>

          {/* IMDb-style rating display */}
          <div className="flex items-center gap-2 mb-4">
            <Star fill="gold" className="text-yellow-400" size={20} />
            <span className="text-lg font-semibold">{imdbStyleRating}</span>
            <span className="text-gray-400 text-sm">/ 10</span>
            <span className="text-gray-500 text-xs ml-2">
              ({movie.vote_count?.toLocaleString()} votes)
            </span>
          </div>

          {/* User Rating System */}
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Your Rating:</p>
            <div className="flex gap-1">
              {[...Array(10)].map((_, i) => {
                const value = i + 1;
                return (
                  <Star
                    key={value}
                    size={20}
                    className={`cursor-pointer transition ${
                      (hover || userRating) >= value
                        ? "text-yellow-400"
                        : "text-gray-600"
                    }`}
                    onClick={() => handleRating(value)}
                    onMouseEnter={() => setHover(value)}
                    onMouseLeave={() => setHover(null)}
                    fill={(hover || userRating) >= value ? "yellow" : "none"}
                  />
                );
              })}
            </div>
            {userRating > 0 && (
              <p className="text-sm text-gray-300 mt-1">
                You rated this movie <span className="font-semibold">{userRating}/10</span>
              </p>
            )}
          </div>

          {/* Overview */}
          <p className="leading-relaxed mt-6">{movie.overview}</p>

          {/* Extra info */}
          <div className="mt-6 text-sm text-gray-400">
            <p>
              <strong className="text-gray-200">Runtime:</strong>{" "}
              {movie.runtime ? `${movie.runtime} min` : "N/A"}
            </p>
            <p>
              <strong className="text-gray-200">Genres:</strong>{" "}
              {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Trailer Section */}
      {trailerKey && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            <Play size={20} className="text-red-500" />
            Watch Trailer
          </h2>
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title={`${movie.title} Trailer`}
              allowFullScreen
              className="w-full h-[400px] rounded-lg"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
