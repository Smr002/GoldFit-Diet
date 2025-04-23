import React from "react";
import { Box, Typography, Paper, Divider, Button, Chip, useTheme } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";

function NotificationsReminders() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  // Mock data
  const reminders = [
    {
      type: "workout",
      message: "Workout reminder for 7 PM today",
      time: "2 hours from now",
      icon: FitnessCenterIcon,
      color: isDarkMode ? "#BB86FC" : "#7E69AB",
      bgColor: isDarkMode ? "rgba(187, 134, 252, 0.1)" : "rgba(126, 105, 171, 0.1)",
    },
    {
      type: "nutrition",
      message: "Don't forget to log your lunch",
      time: "Just now",
      icon: RestaurantIcon,
      color: isDarkMode ? "#03DAC6" : "#6CCFBC",
      bgColor: isDarkMode ? "rgba(3, 218, 198, 0.1)" : "rgba(108, 207, 188, 0.1)",
    },
  ];

  const recommendations = [
    {
      title: "New HIIT Workout Added",
      description: "15-minute fat burner",
      color: isDarkMode ? "#CF6679" : "#FF7D55",
      bgColor: isDarkMode ? "rgba(207, 102, 121, 0.1)" : "rgba(255, 125, 85, 0.1)",
    },
  ];

  return (
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
          <NotificationsIcon fontSize="medium" sx={{ color: isDarkMode ? theme.palette.primary.main : "#7E69AB" }} />
          <Typography variant="h6" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
            Reminders & Updates
          </Typography>
        </Box>
        <Chip
          label="3 New"
          size="small"
          sx={{
            bgcolor: isDarkMode ? "rgba(187, 134, 252, 0.15)" : "rgba(155, 135, 245, 0.15)",
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
          Today
        </Typography>
        {reminders.map((reminder, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              p: 1.5,
              my: 1.5,
              borderRadius: 2,
              bgcolor: reminder.bgColor,
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
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
                borderRadius: "50%",
                width: 36,
                height: 36,
                flexShrink: 0,
                boxShadow: isDarkMode 
                  ? "0 2px 8px rgba(0,0,0,0.3)" 
                  : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <reminder.icon fontSize="small" sx={{ color: reminder.color }} />
            </Box>
            <Box flexGrow={1}>
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ color: theme.palette.text.primary }}
              >
                {reminder.message}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, display: "block", mt: 0.3 }}
              >
                {reminder.time}
              </Typography>
            </Box>
            <ChevronRightIcon
              fontSize="small"
              sx={{ color: reminder.color, mt: 0.5 }}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          sx={{ mb: 1.5, color: theme.palette.text.primary }}
        >
          Recommendations
        </Typography>
        {recommendations.map((rec, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: rec.bgColor,
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
                bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'white',
                borderRadius: "50%",
                width: 36,
                height: 36,
                flexShrink: 0,
                boxShadow: isDarkMode 
                  ? "0 2px 8px rgba(0,0,0,0.3)" 
                  : "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <EventAvailableIcon fontSize="small" sx={{ color: rec.color }} />
            </Box>
            <Box flexGrow={1}>
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ color: theme.palette.text.primary }}
              >
                {rec.title}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, display: "block", mt: 0.3 }}
              >
                {rec.description}
              </Typography>
            </Box>
            <ChevronRightIcon
              fontSize="small"
              sx={{ color: rec.color, mt: 0.5 }}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          color="primary"
          endIcon={<ChevronRightIcon />}
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
  );
}

export default NotificationsReminders;
