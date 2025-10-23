import React, { useEffect, useState, useCallback } from "react";
import MovieCard from "../components/MovieCard";
import BackToTopButton from "../components/ScrollTop";

const API_KEY = "fa6f055c70ebe532bb30eceda30c7ade";

export default function TVShows() {
  const [shows, setShows] = useState([]);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortType, setSortType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGenres();
    fetchTrending();
  }, []);

  const fetchGenres = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`
      );
      const data = await res.json();
      setGenres(data.genres || []);
    } catch (err) {
      console.error("Error fetching TV genres:", err);
    }
  };

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`
      );
      const data = await res.json();
      setShows(data.results || []);
    } catch (err) {
      console.error("Error fetching trending TV shows:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchShows = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) return fetchTrending();

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
          searchTerm
        )}`
      );
      const data = await res.json();
      setShows(data.results || []);
    } catch (err) {
      console.error("Error searching TV shows:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) searchShows(query);
      else fetchTrending();
    }, 500);
    return () => clearTimeout(delay);
  }, [query, searchShows]);

  const filteredShows = shows
    .filter((show) =>
      selectedGenre ? show.genre_ids?.includes(Number(selectedGenre)) : true
    )
    .sort((a, b) => {
      if (sortType === "a-z") return a.name.localeCompare(b.name);
      if (sortType === "z-a") return b.name.localeCompare(a.name);
      if (sortType === "rating-high") return b.vote_average - a.vote_average;
      if (sortType === "rating-low") return a.vote_average - b.vote_average;
      return 0;
    });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search TV shows..."
          className="w-full sm:w-1/3 px-4 py-2 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Sort By</option>
          <option value="a-z">A → Z</option>
          <option value="z-a">Z → A</option>
          <option value="rating-high">Rating: High → Low</option>
          <option value="rating-low">Rating: Low → High</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-gray-400 text-center">Loading...</p>
      ) : filteredShows.length === 0 ? (
        <p className="text-gray-400 text-center">No TV shows found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredShows.map((show) => (
            <MovieCard key={show.id} movie={show} />
          ))}
        </div>
      )}

      <BackToTopButton />
    </div>
  );
}
