import { ToastContainer } from "react-toastify";
import { useTheme } from "../contexts/ThemeContext";

/** Toast container that follows the active app theme. */
export function ThemeToastContainer() {
  const { theme } = useTheme();
  return (
    <ToastContainer
      position="top-right"
      theme={theme === "dark" ? "dark" : "light"}
      autoClose={4000}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
    />
  );
}
