import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import MovieDetails from "./components/MovieDetails";
import Navbar from "./components/Navbar";
import TVShows from "./pages/TVShows";
import WatchLater from "./pages/WatchLater";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-gray-950 text-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/watch-later" element={<WatchLater />} />
          <Route path="/tv-shows" element={<TVShows />} />
        </Routes>
      </main>
    </>
  );
}
