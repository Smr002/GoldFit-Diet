import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Typography,
  Button,
} from "@mui/material";

import ProfileHeader from "../components/userPage/dashboard/ProfileHeader";
import QuickActions from "../components/userPage/dashboard/QuickActions";
import DailySummaryWidget from "../components/userPage/dashboard/DailySummaryWidget";
import WorkoutSection from "../components/userPage/dashboard/WorkoutSection";
import ProgressGoalsOverview from "../components/userPage/dashboard/ProgressGoalsOverview";
import NotificationsReminders from "../components/userPage/dashboard/NotificationsReminders";
import BadgeSection from "../components/userPage/dashboard/BadgeSection";
import SupportFAQCard from "../components/userPage/dashboard/SupportFAQCard";
import WeeklyTrackingChart from "../components/userPage/dashboard/WeeklyTrackingChart";
import Footer from "@/components/Footer";
import MobileFooter from "../components/MobileFooter";
import SecondNavbar from "@/components/SecondNavbar";
import WelcomeModal from "../components/userPage/dashboard/WelcomeModal";
import ThemeToggle from "@/components/ThemeToggle";

const UserHomePage = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const isMobileOrTablet = useMediaQuery("(max-width:1024px)");

  // Check for dark mode preference and user data on component mount
  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      setIsDarkMode(false);
      document.body.classList.remove("dark-mode");
    }

    // User and token setup
    const storedToken = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (storedToken) {
      setToken(storedToken);
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        const id = payload.id || payload.userId || user.id || null; // Adjust based on token payload
        setUserId(id);
        const name =
          payload.firstName ||
          payload.username ||
          user.displayName ||
          user.email?.split("@")[0] ||
          "User";
        setUserName(name);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Create a theme based on the current mode
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "#FFD700" : "#1976d2", // Gold in dark mode, blue in light mode
      },
      secondary: {
        main: isDarkMode ? "#DAA520" : "#9c27b0", // Goldenrod in dark mode, purple in light mode
      },
      background: {
        default: isDarkMode ? "#121212" : "#fff",
        paper: isDarkMode ? "#1e1e1e" : "#fff",
      },
    },
    typography: {
      fontFamily: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
      ].join(","),
    },
    components: {
      MuiPaper: {
        defaultProps: {
          elevation: 1,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
          },
        },
      },
    },
  });

  // Handle welcome modal
  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    if (token && !hasSeenWelcome) {
      setShowWelcomeModal(true);
      sessionStorage.setItem("hasSeenWelcome", "true");

      setTimeout(() => {
        setShowWelcomeModal(false);
      }, 3000);
    }
  }, [token]);

  // Handler for theme changes from ThemeToggle
  useEffect(() => {
    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem("theme");
      setIsDarkMode(currentTheme === "dark");
    };

    window.addEventListener("storage", handleThemeChange);
    document.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      document.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Modal */}
        <WelcomeModal
          open={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
          userName={userName}
          theme={theme}
        />

        <Box sx={{ minHeight: "100vh" }}>
          {/* Navigation Bar */}
          <SecondNavbar />
          <br />
          <br />
          <br />

          {/* Weekly Chart */}
          <Grid item xs={12} sx={{ mb: 4 }}>
            <WeeklyTrackingChart
              width={isMobileOrTablet ? 300 : undefined}
              height={isMobileOrTablet ? 200 : undefined}
            />
          </Grid>

          {/* Main Dashboard Grid */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              {token && userId ? (
                <DailySummaryWidget
                  token={token}
                  userId={userId}
                  date={new Date()}
                />
              ) : (
                <Box sx={{ p: 2.5, textAlign: "center" }}>
                  <Typography color="error">
                    Please log in to view your daily summary
                  </Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <WorkoutSection />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <ProgressGoalsOverview />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <NotificationsReminders />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <BadgeSection />
            </Grid>
            <Grid item xs={12} md={6} lg={4} sx={{ pb: { xs: 8, sm: 5 } }}>
              <SupportFAQCard />
            </Grid>
          </Grid>
        </Box>
      </Container>
      {isMobileOrTablet ? <MobileFooter /> : <Footer />}
      <ThemeToggle />
    </ThemeProvider>
  );
};

export default UserHomePage;
