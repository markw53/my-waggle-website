// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { themes } from "../config/theme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Load saved theme or detect system preference
    const getInitialTheme = () => {
        if (typeof window !== "undefined") {
            const storedTheme = localStorage.getItem("theme");
            if (storedTheme) return storedTheme;
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return "light"; // Default theme for SSR
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // Update localStorage & apply theme change
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", theme);
            // Apply theme to the document
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    }, []);

    const contextValue = useMemo(() => ({
        theme,
        toggleTheme,
        colors: themes[theme].colors,
        shadows: themes[theme].shadows,
        isDark: theme === "dark",
    }), [theme]);

    return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}