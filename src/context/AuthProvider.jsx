import { AuthProvider } from "./context/AuthContext";
// ... your other imports

export default function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <WatchLaterProvider>
          <Navbar />
          <main className="pt-20 min-h-screen bg-gray-950 text-gray-100">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/tv/:id" element={<TvDetails />} />
              <Route path="/watch-later" element={<WatchLater />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/tv-shows" element={<TVShows />} />
            </Routes>
          </main>
        </WatchLaterProvider>
      </MovieProvider>
    </AuthProvider>
  );
}
