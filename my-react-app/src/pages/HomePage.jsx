import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Navbar from "../components/Navbar";
import Landing from "../components/Landing";
import OurVision from "../components/OurVision";
import Workouts from "../components/LandingWorkouts";
import Prices from "../components/Prices";
import ThemeToggle from "../components/ThemeToggle";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";

function HomePage({ setModalOpen, isModalOpen }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // Check for dark mode preference on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setIsDarkMode(true);
            document.body.classList.add("dark-mode");
        } else {
            setIsDarkMode(false);
            document.body.classList.remove("dark-mode");
        }
    }, []);

    // Listen for theme changes
    useEffect(() => {
        const handleThemeChange = () => {
            const currentTheme = localStorage.getItem("theme");
            setIsDarkMode(currentTheme === "dark");
        };

        window.addEventListener('storage', handleThemeChange);
        document.addEventListener('themeChanged', handleThemeChange);

        return () => {
            window.removeEventListener('storage', handleThemeChange);
            document.removeEventListener('themeChanged', handleThemeChange);
        };
    }, []);

    // Create a theme based on the current mode
    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
            primary: {
                main: isDarkMode ? "#FFD700" : "#1976d2", // Gold in dark mode, blue in light mode
            },
            secondary: {
                main: isDarkMode ? "#DAA520" : "#9c27b0", // Goldenrod in dark mode, purple in light mode
            },
            background: {
                default: isDarkMode ? '#121212' : '#fff',
                paper: isDarkMode ? '#1e1e1e' : '#fff',
            },
            text: {
                primary: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
                secondary: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={isDarkMode ? "dark-mode-container" : "light-mode-container"}>
                <Navbar setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
                <ThemeToggle />
                <Landing setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
                <OurVision />
                <Workouts setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
                <Prices setModalOpen={setModalOpen} isModalOpen={isModalOpen} />
                <ContactUs />
                <Footer />
            </div>
            
            {/* Add dynamic styles specific to this component */}
            <style jsx>{`
                .dark-mode-container {
                    background-color: var(--dark-bg-primary, #121212);
                    color: var(--dark-text-primary, #ffffff);
                    min-height: 100vh;
                }
                
                .light-mode-container {
                    background-color: var(--light-bg-primary, #ffffff);
                    color: var(--light-text-primary, rgba(0, 0, 0, 0.87));
                    min-height: 100vh;
                }
            `}</style>
        </ThemeProvider>
    );
}

export default HomePage;
