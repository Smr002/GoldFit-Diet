import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  useTheme,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WeeklySummaryModal from "./summary_modal"; // Now imports from the index.js in the folder
import { getNotificationsByUser, getUserIdFromToken } from "../../../api";

function NotificationsReminders() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Add state for modal visibility
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    return monday.toISOString().split("T")[0];
  });

  //Testing start date for my database
  // const [currentWeekStart, setCurrentWeekStart] = useState("2024-04-22");

  // Modal handlers
  const handleOpenSummary = () => {
    setSummaryModalOpen(true);
  };

  const handleCloseSummary = () => {
    setSummaryModalOpen(false);
  };

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = getUserIdFromToken(token);
        if (!token || !userId) return;

        const response = await getNotificationsByUser(userId, token);
        // Sort by date and take latest 4
        const sortedNotifications = response
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((notification) => ({
            type: notification.type || "notification",
            message: notification.message,
            time: formatTimeAgo(new Date(notification.createdAt)),
            icon: getIconForType(notification.type),
            color: getColorForType(notification.type, isDarkMode),
            bgColor: getBgColorForType(notification.type, isDarkMode),
          }));

        setNotifications(sortedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [isDarkMode]);

  // Helper function to format time ago
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  // Helper function to get icon based on notification type
  const getIconForType = (type) => {
    switch (type?.toLowerCase()) {
      case "workout":
        return FitnessCenterIcon;
      case "nutrition":
        return RestaurantIcon;
      default:
        return NotificationsIcon;
    }
  };

  // Helper functions for colors
  const getColorForType = (type, isDark) => {
    switch (type?.toLowerCase()) {
      case "workout":
        return isDark ? "#BB86FC" : "#7E69AB";
      case "nutrition":
        return isDark ? "#03DAC6" : "#6CCFBC";
      default:
        return isDark ? "#CF6679" : "#FF7D55";
    }
  };

  const getBgColorForType = (type, isDark) => {
    const color = getColorForType(type, isDark);
    return `${color}1A`; // 10% opacity version of the color
  };

  return (
    <>
      <Paper
        sx={{
          p: 2.5,
          height: "100%",
          borderRadius: 3,
          boxShadow: isDarkMode
            ? "0px 4px 20px rgba(0, 0, 0, 0.3)"
            : "0px 4px 20px rgba(0, 0, 0, 0.08)",
          background: isDarkMode
            ? "linear-gradient(145deg, #1e1e1e, #2a2a2a)"
            : "linear-gradient(145deg, #ffffff, #f5f7ff)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <NotificationsIcon
              fontSize="medium"
              sx={{
                color: isDarkMode ? theme.palette.primary.main : "#7E69AB",
              }}
            />
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ color: theme.palette.text.primary }}
            >
              Reminders & Updates
            </Typography>
          </Box>
          <Chip
            label="3 Messages"
            size="small"
            sx={{
              bgcolor: isDarkMode
                ? "rgba(187, 134, 252, 0.15)"
                : "rgba(155, 135, 245, 0.15)",
              color: isDarkMode ? theme.palette.primary.main : "#9B87F5",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ mb: 1.5, color: theme.palette.text.primary }}
          >
            Recent Notifications
          </Typography>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  p: 1.5,
                  my: 1.5,
                  borderRadius: 2,
                  bgcolor: notification.bgColor,
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  "&:hover": {
                    transform: "translateX(5px)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "white",
                    borderRadius: "50%",
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    boxShadow: isDarkMode
                      ? "0 2px 8px rgba(0,0,0,0.3)"
                      : "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  <notification.icon
                    fontSize="small"
                    sx={{ color: notification.color }}
                  />
                </Box>
                <Box flexGrow={1}>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{ color: theme.palette.text.primary }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: theme.palette.text.secondary,
                      display: "block",
                      mt: 0.3,
                    }}
                  >
                    {notification.time}
                  </Typography>
                </Box>
                <ChevronRightIcon
                  fontSize="small"
                  sx={{ color: notification.color, mt: 0.5 }}
                />
              </Box>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: "center",
                py: 2,
              }}
            >
              No notifications to display
            </Typography>
          )}
        </Box>

        {/* Remove recommendations section and directly show the weekly summary button */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            color="primary"
            endIcon={<ChevronRightIcon />}
            onClick={handleOpenSummary} // Add onClick handler here
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 8,
              px: 3,
              py: 1,
              background: isDarkMode
                ? "linear-gradient(90deg, rgba(187, 134, 252, 0.1) 0%, rgba(187, 134, 252, 0.2) 100%)"
                : "linear-gradient(90deg, rgba(155, 135, 245, 0.1) 0%, rgba(126, 105, 171, 0.2) 100%)",
              color: isDarkMode ? theme.palette.primary.main : "#7E69AB",
              "&:hover": {
                background: isDarkMode
                  ? "linear-gradient(90deg, rgba(187, 134, 252, 0.2) 0%, rgba(187, 134, 252, 0.3) 100%)"
                  : "linear-gradient(90deg, rgba(155, 135, 245, 0.2) 0%, rgba(126, 105, 171, 0.3) 100%)",
              },
            }}
          >
            View Weekly Summary
          </Button>
        </Box>
      </Paper>

      {/* Add the Weekly Summary Modal */}
      <WeeklySummaryModal
        open={summaryModalOpen}
        onClose={handleCloseSummary}
        weekStart={currentWeekStart}
      />
    </>
  );
}

export default NotificationsReminders;
