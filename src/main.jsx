import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { MovieProvider } from "./context/MovieContext";
import { WatchLaterProvider } from "./context/WatchLaterContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider> {/* ✅ Apply dark mode globally */}
          <MovieProvider>
            <WatchLaterProvider>
              <App />
            </WatchLaterProvider>
          </MovieProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
