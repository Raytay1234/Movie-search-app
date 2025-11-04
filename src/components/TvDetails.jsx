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

  const { addToFavorites, removeFromFavorites, isFavorite, addToWatchLater, removeFromWatchLater, isInWatchLater } = useMovies();

  useEffect(() => {
    async function fetchShow() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=en-US`);
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

  if (loading) return <p className="text-center py-12">Loading TV show details…</p>;
  if (error) return <p className="text-center text-red-500 py-12">{error}</p>;
  if (!show) return null;

  const fav = isFavorite(`${show.id}-tv`);
  const watch = isInWatchLater(`${show.id}-tv`);

  return (
    <div className="max-w-5xl mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <img src={show.poster_path ? `${IMAGE_URL}${show.poster_path}` : PLACEHOLDER} alt={show.name} className="w-full md:col-span-1 rounded-lg shadow-lg" />
      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold">{show.name} <span className="text-gray-400 text-xl">({show.first_air_date?.split("-")[0]})</span></h2>
        <p className="text-sm text-gray-400 my-2">{show.genres?.map(g => g.name).join(", ")} • {show.number_of_seasons} Seasons</p>
        <p className="my-4">{show.overview}</p>
        <ul className="text-sm space-y-1">
          <li><strong>Episodes:</strong> {show.number_of_episodes}</li>
          <li><strong>Rating:</strong> {show.vote_average?.toFixed(1)}/10</li>
        </ul>

        <div className="mt-6 flex gap-3">
          <button onClick={() => fav ? removeFromFavorites(`${show.id}-tv`) : addToFavorites({ ...show, type: "tv", idKey: `${show.id}-tv` })}
            className={`px-4 py-2 rounded transition ${fav ? "bg-red-600 hover:bg-red-500" : "bg-indigo-600 hover:bg-indigo-500"}`}>
            <Heart size={18} /> {fav ? "Remove Favorite" : "Add to Favorites"}
          </button>

          <button onClick={() => watch ? removeFromWatchLater(`${show.id}-tv`) : addToWatchLater({ ...show, type: "tv", idKey: `${show.id}-tv` })}
            className={`px-4 py-2 rounded transition ${watch ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"}`}>
            <Clock size={18} /> {watch ? "Remove Watch Later" : "Watch Later"}
          </button>
        </div>
      </div>
    </div>
  );
}
