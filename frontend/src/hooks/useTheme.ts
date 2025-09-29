import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Theme = "light" | "dark" | "system";

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

export const useTheme = (): UseThemeReturn => {
  const { value: storedTheme, setValue: setStoredTheme } =
    useLocalStorage<Theme>("theme", "system");

  // Ensure storedTheme is never null
  const theme = storedTheme || "system";
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Get system theme preference
  const getSystemTheme = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "light";

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  // Apply theme to document
  const applyTheme = useCallback((theme: "light" | "dark") => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, []);

  // Update resolved theme based on current theme setting
  useEffect(() => {
    const newResolvedTheme = theme === "system" ? getSystemTheme() : theme;

    setResolvedTheme(newResolvedTheme);
    applyTheme(newResolvedTheme);
  }, [theme, getSystemTheme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const systemTheme = getSystemTheme();
      setResolvedTheme(systemTheme);
      applyTheme(systemTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [storedTheme, getSystemTheme, applyTheme]);

  // Set theme
  const setTheme = useCallback(
    (theme: Theme) => {
      setStoredTheme(theme);
    },
    [setStoredTheme]
  );

  // Toggle between light and dark (ignoring system)
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setStoredTheme(newTheme);
  }, [resolvedTheme, setStoredTheme]);

  return {
    theme: theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === "dark",
    isLight: resolvedTheme === "light",
  };
};

// Hook for theme-aware colors
export const useThemeColors = () => {
  const { isDark } = useTheme();

  const colors = {
    // Background colors
    background: isDark ? "bg-gray-900" : "bg-white",
    backgroundSecondary: isDark ? "bg-gray-800" : "bg-gray-50",
    backgroundTertiary: isDark ? "bg-gray-700" : "bg-gray-100",

    // Text colors
    text: isDark ? "text-gray-100" : "text-gray-900",
    textSecondary: isDark ? "text-gray-300" : "text-gray-600",
    textTertiary: isDark ? "text-gray-400" : "text-gray-500",

    // Border colors
    border: isDark ? "border-gray-700" : "border-gray-200",
    borderSecondary: isDark ? "border-gray-600" : "border-gray-300",

    // Hover colors
    hover: isDark ? "hover:bg-gray-800" : "hover:bg-gray-50",
    hoverSecondary: isDark ? "hover:bg-gray-700" : "hover:bg-gray-100",

    // Focus colors
    focus: isDark ? "focus:ring-blue-400" : "focus:ring-blue-500",
    focusBorder: isDark ? "focus:border-blue-400" : "focus:border-blue-500",

    // Shadow colors
    shadow: isDark ? "shadow-gray-900/50" : "shadow-gray-200/50",
    shadowLg: isDark ? "shadow-gray-900/75" : "shadow-gray-200/75",
  };

  return colors;
};

// Hook for responsive design
export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  return {
    windowSize,
    isMobile: windowSize.width < breakpoints.md,
    isTablet:
      windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg,
    isDesktop: windowSize.width >= breakpoints.lg,
    isLarge: windowSize.width >= breakpoints.xl,
    isXLarge: windowSize.width >= breakpoints["2xl"],
    breakpoints,
  };
};
