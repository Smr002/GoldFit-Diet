
import React, { useEffect, useState } from "react";
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <IconButton 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      size="medium"
      sx={{ 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: '50%'
      }}
    >
      {theme === "light" ? (
        <DarkModeIcon fontSize="small" />
      ) : (
        <LightModeIcon fontSize="small" />
      )}
    </IconButton>
  );
}

export default ThemeToggle;
