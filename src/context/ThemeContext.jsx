import React, { createContext, useContext, useState, useEffect } from "react";

// Create the Theme Context
const ThemeContext = createContext();

// Custom Hook to use Theme Context
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [selectedFont, setSelectedFont] = useState(() => localStorage.getItem("font") || "sans-serif");

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("font", selectedFont);
    document.querySelector("html").style.fontFamily = selectedFont;
  }, [selectedFont]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, selectedFont, setSelectedFont }}>
      {children}
    </ThemeContext.Provider>
  );
};
