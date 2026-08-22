import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";
export type ThemePreference = Theme | "system";

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setPreference: (preference: ThemePreference) => void;
}

const STORAGE_KEY = "theme";
const LEGACY_KEY = "darkmode";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
  if (stored === "dark" || stored === "light" || stored === "system") return stored;
  return "system";
}

function resolveTheme(preference: ThemePreference): Theme {
  return preference === "system" ? getSystemTheme() : preference;
}

function applyThemeToDocument(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  root.dataset.theme = theme;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readStoredPreference());
  const [theme, setThemeState] = useState<Theme>(() => resolveTheme(readStoredPreference()));

  const persist = useCallback((pref: ThemePreference, resolved: Theme) => {
    localStorage.setItem(STORAGE_KEY, pref);
    // Keep legacy key in sync for older code paths
    localStorage.setItem(LEGACY_KEY, resolved);
    applyThemeToDocument(resolved);
  }, []);

  useEffect(() => {
    const resolved = resolveTheme(preference);
    setThemeState(resolved);
    persist(preference, resolved);
  }, [preference, persist]);

  // React to OS theme changes when preference is "system"
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (preference === "system") {
        const resolved = getSystemTheme();
        setThemeState(resolved);
        applyThemeToDocument(resolved);
        localStorage.setItem(LEGACY_KEY, resolved);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setPreferenceState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setPreferenceState((prev) => {
      const current = resolveTheme(prev);
      return current === "light" ? "dark" : "light";
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, preference, toggleTheme, setTheme, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
