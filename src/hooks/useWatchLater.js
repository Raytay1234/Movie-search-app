import { useContext } from "react";
import { WatchLaterContext } from "../context/WatchLaterContext";

export const useWatchLater = () => {
  const context = useContext(WatchLaterContext);
  if (!context) throw new Error("useWatchLater must be used within a WatchLaterProvider");
  return context;
};
