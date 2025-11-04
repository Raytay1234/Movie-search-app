import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import ScrollTop from "../components/ScrollTop";

const API_KEY = "fa6f055c70ebe532bb30eceda30c7ade";
const IMG_BASE = "https://image.tmdb.org/t/p/original";

export default function Home() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [genres, setGenres] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortType, setSortType] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ✅ Fetch genres
  const fetchGenres = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
      );
      const data = await res.json();
      setGenres(data.genres || []);
    } catch (err) {
      console.error("Error fetching genres:", err);
    }
  }, []);

  // ✅ Fetch featured (popular) movies
  const fetchFeatured = useCallback(async (pageNumber = 1, reset = false) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pageNumber}`
      );
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        if (reset) {
          setMovies(data.results);
          setFeatured(data.results[0]); // Highlight first movie
        } else {
          setMovies((prev) => [...prev, ...(data.results || [])]);
        }
      }
      setHasMore(pageNumber < data.total_pages);
    } catch (err) {
      console.error("Error fetching featured movies:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Initial load
  useEffect(() => {
    fetchGenres();
    fetchFeatured(1, true);
  }, [fetchGenres, fetchFeatured]);

  // ✅ Search movies
  const searchMovies = useCallback(
    async (searchTerm, pageNumber = 1, reset = false) => {
      if (!searchTerm.trim()) return fetchFeatured(1, true);
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            searchTerm
          )}&page=${pageNumber}`
        );
        const data = await res.json();
        if (reset) {
          setMovies(data.results || []);
          setFeatured(null); // Hide banner on search
        } else {
          setMovies((prev) => [...prev, ...(data.results || [])]);
        }
        setHasMore(pageNumber < data.total_pages);
      } catch (err) {
        console.error("Error searching movies:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchFeatured]
  );

  // ✅ Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim() !== "") searchMovies(query, 1, true);
      else fetchFeatured(1, true);
      setPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query, searchMovies, fetchFeatured]);

  // ✅ Filter + sort
  const filteredMovies = movies
    .filter((movie) =>
      selectedGenre ? movie.genre_ids?.includes(Number(selectedGenre)) : true
    )
    .sort((a, b) => {
      if (sortType === "a-z") return a.title.localeCompare(b.title);
      if (sortType === "z-a") return b.title.localeCompare(a.title);
      if (sortType === "rating-high") return b.vote_average - a.vote_average;
      if (sortType === "rating-low") return a.vote_average - b.vote_average;
      return 0;
    });

  // ✅ Load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    if (query.trim()) searchMovies(query, nextPage);
    else fetchFeatured(nextPage);
  };

  return (
    <div className="max-w-6xl mx-auto p-0 sm:p-6">
      {/* 🎬 Featured Banner */}
      {featured && (
        <div
          className="relative w-full h-[60vh] sm:h-[75vh] mb-10 rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `url(${IMG_BASE}${featured.backdrop_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-10 left-8 text-white max-w-xl">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 drop-shadow-lg">
              {featured.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-200 line-clamp-3 mb-4">
              {featured.overview}
            </p>
            <button
              onClick={() => navigate(`/movie/${featured.id}`)}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition"
            >
              Watch Now
            </button>
          </div>
        </div>
      )}

      {/* 🔍 Search + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 px-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search featured movies..."
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

      {/* 🎥 Featured Movies Grid */}
      {loading && movies.length === 0 ? (
        <p className="text-gray-400 text-center">Loading featured movies...</p>
      ) : filteredMovies.length === 0 ? (
        <p className="text-gray-400 text-center">No featured movies found.</p>
      ) : (
        <>
          <h2 className="text-xl sm:text-2xl font-bold text-white px-4 mb-4">
            Featured Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 px-4">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 transition-transform active:scale-95 shadow-md"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
      <ScrollTop />
    </div>
  );
}
