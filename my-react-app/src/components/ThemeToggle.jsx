import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

const ThemeToggle = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    if (newDarkModeState) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
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

      <style jsx global>{`
        :root {
          --toggle-primary-color: #6c63ff; /* Purple for light mode */
          --toggle-secondary-color: #4834d4;
          --toggle-shadow-color: rgba(108, 99, 255, 0.3);
          --toggle-hover-shadow-color: rgba(108, 99, 255, 0.5);
        }

        .dark-mode {
          --toggle-primary-color: #FFD700; /* Gold for dark mode */
          --toggle-secondary-color: #DAA520;
          --toggle-shadow-color: rgba(255, 215, 0, 0.3);
          --toggle-hover-shadow-color: rgba(255, 215, 0, 0.5);
        }

        .theme-toggle-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .theme-toggle-button {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(to right, var(--toggle-primary-color), var(--toggle-secondary-color));
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 10px var(--toggle-shadow-color);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          font-size: 18px;
        }

        .theme-toggle-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px var(--toggle-hover-shadow-color);
        }

        .theme-options {
          margin-bottom: 15px;
          animation: fadeIn 0.3s ease;
        }

        .theme-option {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid var(--toggle-primary-color);
          color: var(--toggle-primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .theme-option:hover {
          background: rgba(var(--toggle-primary-color-rgb), 0.2);
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ThemeToggle;