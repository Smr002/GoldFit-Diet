import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
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

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
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

const UserHomePage = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [userName, setUserName] = useState("");
  const isMobileOrTablet = useMediaQuery("(max-width:1024px)");

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (token && !hasSeenWelcome) {
      let name = "User";

      if (user?.displayName) {
        name = user.displayName;
      } else if (user?.email) {
        name = user.email.split("@")[0];
      } else {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          name = payload.firstName || payload.username || "User";
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }

      setUserName(name);
      setShowWelcomeModal(true);
      sessionStorage.setItem("hasSeenWelcome", "true");

      setTimeout(() => {
        setShowWelcomeModal(false);
      }, 3000);
    }
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

          {/* Quick Action Buttons (if needed) */}
          {/* <QuickActions /> */}

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
              <DailySummaryWidget />
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
    </ThemeProvider>
  );
};

export default UserHomePage;
