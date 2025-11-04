import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "../components/MovieCard";
import BackToTopButton from "../components/ScrollTop";

const API_KEY = "fa6f055c70ebe532bb30eceda30c7ade";
const BASE_URL = "https://api.themoviedb.org/3";

export default function TVShows() {
  const [shows, setShows] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchShows = useCallback(
    async (pageNum = 1) => {
      setLoading(true);
      try {
        const url = query
          ? `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
            query
          )}&page=${pageNum}`
          : `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${pageNum}`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.results) {
          // Normalize TV show data for MovieCard compatibility
          const normalized = data.results.map((show) => ({
            id: show.id,
            imdbID: show.id, // for favorite system consistency
            title: show.name || show.original_name || "Untitled Show",
            overview: show.overview || "No description available.",
            poster_path: show.poster_path,
            vote_average: show.vote_average || 0,
            release_date: show.first_air_date || "Unknown",
            media_type: "tv",
          }));

          setShows((prev) =>
            pageNum === 1 ? normalized : [...prev, ...normalized]
          );
          setHasMore(pageNum < data.total_pages);
        }
      } catch (err) {
        console.error("Failed to fetch TV shows:", err);
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    setPage(1);
    fetchShows(1);
  }, [fetchShows]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchShows(next);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search TV shows..."
        className="w-full sm:w-1/3 px-4 py-2 rounded-lg bg-gray-800 text-gray-100 mb-4"
      />

      {shows.length === 0 && !loading && (
        <p className="text-gray-400 text-center py-12">No TV shows found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {shows.map((show, index) => (
          <MovieCard key={`${show.id}-${index}`} movie={show} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      <BackToTopButton />
    </div>
  );
}
