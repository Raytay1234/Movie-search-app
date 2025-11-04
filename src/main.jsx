import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { MovieProvider } from "./context/MovieProvider";
import { WatchLaterProvider } from "./context/WatchLaterContext";
import { AuthProvider } from "./context/AuthContext"; // ✅ Add this
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* ✅ Auth wraps the whole app */}
        <MovieProvider>
          <WatchLaterProvider>
            <App />
          </WatchLaterProvider>
        </MovieProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
