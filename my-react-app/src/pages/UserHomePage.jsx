import React from "react";
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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isMobileOrTablet = useMediaQuery("(max-width:1024px)");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
            <Grid item xs={12} md={6} lg={4}>
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
