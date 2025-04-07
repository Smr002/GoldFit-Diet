import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Fade,
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

const userHomePage = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [userName, setUserName] = useState("");
  const isMobileOrTablet = useMediaQuery("(max-width:1024px)");

  useEffect(() => {
    const isJustLoggedIn = true; // Temporary for testing
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (token) {
      let name = "User";
      if (user?.displayName) {
        name = user.displayName;
      } else if (user?.email) {
        name = user.email.split("@")[0];
      } else if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          name = payload.firstName || payload.username || "User";
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
      setUserName(name);
      setShowWelcomeModal(true);

      // Auto close after 3 seconds
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
        <Dialog
          open={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 600 }}
          PaperProps={{
            sx: {
              minWidth: { xs: "80%", sm: "400px" },
              p: 2,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(145deg, #2d2d2d 0%, #1a1a1a 100%)"
                  : "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(4px)",
            },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
            <Typography
              variant="h4"
              component="div"
              sx={{
                fontWeight: "bold",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Welcome back!
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                my: 2,
                animation: "fadeIn 0.5s ease-in",
              }}
            >
              Great to see you again, {userName}! 🎉
            </Typography>
          </DialogContent>
        </Dialog>

        <Box sx={{ minHeight: "100vh" }}>
          {/* Profile Header with welcome message */}
          <ProfileHeader />

          {/* Quick Action Buttons */}
          <QuickActions />
          <Grid item xs={12} sx={{ mb: 4 }}>
            <WeeklyTrackingChart
              width={isMobileOrTablet ? 300 : undefined}
              height={isMobileOrTablet ? 200 : undefined}
            />
          </Grid>

          {/* Main Dashboard Grid */}
          <Grid container spacing={3}>
            {/* Daily Summary */}
            <Grid item xs={12} md={6} lg={4}>
              <DailySummaryWidget />
            </Grid>

            {/* Workout Section */}
            <Grid item xs={12} md={6} lg={4}>
              <WorkoutSection />
            </Grid>

            {/* Progress & Goals */}
            <Grid item xs={12} md={6} lg={4}>
              <ProgressGoalsOverview />
            </Grid>

            {/* Notifications & Reminders */}
            <Grid item xs={12} md={6} lg={4}>
              <NotificationsReminders />
            </Grid>

            {/* Badge Section */}
            <Grid item xs={12} md={6} lg={4}>
              <BadgeSection />
            </Grid>

            {/* Support/FAQ */}
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

export default userHomePage;
