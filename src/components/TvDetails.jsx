import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, Clock, Star } from "lucide-react";
import { useMovies } from "../hooks/useMovies";

const API_KEY = "fa6f055c70ebe532bb30eceda30c7ade";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "https://placehold.co/500x750?text=No+Poster";

export default function TvDetails() {
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToWatchLater,
    removeFromWatchLater,
    isInWatchLater,
  } = useMovies();

  useEffect(() => {
    async function fetchShow() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`
        );
        if (!res.ok) throw new Error("TV show not found");
        const data = await res.json();
        setShow({ ...data, type: "tv" });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchShow();
  }, [id]);

  if (loading)
    return <p className="text-center py-12 text-gray-400">Loading TV show details…</p>;
  if (error)
    return <p className="text-center text-red-500 py-12">{error}</p>;
  if (!show) return null;

  const fav = isFavorite(`${show.id}-tv`);
  const watch = isInWatchLater(`${show.id}-tv`);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-100">
      <img
        src={show.poster_path ? `${IMAGE_URL}${show.poster_path}` : PLACEHOLDER}
        alt={show.name}
        className="rounded-xl shadow-lg w-full"
      />

      <div className="md:col-span-2 space-y-4">
        <h1 className="text-4xl font-bold">
          {show.name}{" "}
          <span className="text-gray-400 text-2xl">
            ({show.first_air_date?.split("-")[0]})
          </span>
        </h1>

        <p className="text-sm text-gray-400">
          {show.genres?.map((g) => g.name).join(", ")} •{" "}
          {show.number_of_seasons} Seasons
        </p>

        <div className="flex items-center gap-2">
          <Star className="text-yellow-400" size={18} />
          <span className="font-semibold">
            {show.vote_average?.toFixed(1)} / 10
          </span>
        </div>

        <p className="leading-relaxed text-gray-300">{show.overview}</p>

        <ul className="text-sm space-y-1">
          <li>
            <strong>Episodes:</strong> {show.number_of_episodes}
          </li>
          <li>
            <strong>Status:</strong> {show.status}
          </li>
          <li>
            <strong>Language:</strong> {show.original_language?.toUpperCase()}
          </li>
        </ul>

        <div className="flex flex-wrap gap-4 mt-6">
          {/* Favorites */}
          <button
            onClick={() =>
              fav
                ? removeFromFavorites(`${show.id}-tv`)
                : addToFavorites({ ...show, type: "tv", idKey: `${show.id}-tv` })
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
                ? removeFromWatchLater(`${show.id}-tv`)
                : addToWatchLater({ ...show, type: "tv", idKey: `${show.id}-tv` })
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
      </div>
    </div>
  );
}
