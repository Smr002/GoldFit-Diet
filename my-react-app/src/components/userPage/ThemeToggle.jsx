import React, { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check for theme in localStorage instead of just document classes
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setTheme("dark");
      document.body.classList.add("dark-mode");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.body.classList.remove("dark-mode");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
    
    // Dispatch a custom event to notify other components of theme change
    const themeChangedEvent = new CustomEvent('themeChanged', {
      detail: { theme: newTheme }
    });
    document.dispatchEvent(themeChangedEvent);
  };

  return (
    <IconButton 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      size="medium"
      sx={{ 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: '50%',
        backgroundColor: theme === "dark" ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        color: theme === "dark" ? '#FFD700' : 'inherit',
        '&:hover': {
          backgroundColor: theme === "dark" ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      {theme === "light" ? (
        <DarkModeIcon fontSize="small" />
      ) : (
        <LightModeIcon fontSize="small" sx={{ color: '#FFD700' }} />
      )}
    </IconButton>
  );
}

export default ThemeToggle;
