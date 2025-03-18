import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const ThemeToggle = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved theme preference on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    
    // Apply theme changes using CSS class
    if (newDarkModeState) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
    
    // Close the menu after selecting an option
    setIsMenuOpen(false);
  };

  return (
    <div className="theme-toggle-container">
      {isMenuOpen && (
        <div className="theme-options">
          <button className="theme-option" onClick={toggleDarkMode}>
            <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
          </button>
        </div>
      )}
      <button className="theme-toggle-button" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faEllipsisH} />
      </button>
    </div>
  );
};

export default ThemeToggle;