import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  useTheme, // Import useTheme to access theme properties
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

// Helper function to lighten/darken colors (optional, but can be useful)
// You might need a library like `polished` or write a simple version
// For simplicity, we'll stick to MUI's theme or hardcoded values here.

function BadgeSection() {
  const theme = useTheme(); // Access the theme

  // Mock data - Added descriptive text
  const badges = [
    {
      name: "7-Day Streak",
      description: "Completed workouts 7 days in a row!",
      icon: EmojiEventsIcon,
      earned: true,
      color: "#FFC107", // Brighter Gold
    },
    {
      name: "5 Workouts",
      description: "Logged your first 5 workouts.",
      icon: MilitaryTechIcon,
      earned: true,
      color: "#673AB7", // Deep Purple
    },
    {
      name: "Weight Goal",
      description: "Reach your target weight.",
      icon: StarIcon,
      earned: false,
      progress: 65, // Changed progress for variety
      color: "#009688", // Teal
    },
    // Add more badges if needed
    {
      name: "Perfect Month",
      description: "Workout every scheduled day in a month.",
      icon: WorkspacePremiumIcon, // Re-using icon for example
      earned: false,
      progress: 15,
      color: "#E91E63", // Pink
    },
  ];

  const badgeSize = { xs: 60, sm: 70, md: 80 }; // Centralized size control
  const iconSize = { xs: "2rem", sm: "2.2rem", md: "2.5rem" }; // Centralized icon size

  return (
    <Paper
      elevation={4} // Slightly more pronounced elevation
      sx={{
        p: { xs: 2, sm: 3 }, // Responsive padding
        height: "100%",
        borderRadius: 4, // Softer corners
        boxShadow: "0px 10px 30px -5px rgba(100, 100, 150, 0.15)", // Softer, deeper shadow
        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`, // Subtle gradient using theme colors
        overflow: "hidden", // Ensure nothing spills out
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3.5, // Increased margin bottom
          px: 1, // Add some horizontal padding
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <WorkspacePremiumIcon
            sx={{
              fontSize: 36,
              color: theme.palette.primary.main,
              filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.2))",
            }}
          />
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
          >
            Your Achievements
          </Typography>
        </Box>
        {/* Optional: Add a "View All" link or button here */}
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {" "}
        {/* Responsive spacing */}
        {badges.map((badge, index) => (
          <Grid
            item
            xs={6} // Show 2 badges per row on extra-small screens
            sm={6} // Show 2 badges per row on small screens
            md={3} // Show 4 badges per row on medium screens and up
            key={badge.name + index} // Use index if names aren't unique
            sx={{ display: "flex", justifyContent: "center" }} // Center grid item content
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 1,
                p: { xs: 1, sm: 1.5 }, // Responsive padding
                borderRadius: 3, // Consistent rounding
                width: "100%", // Take full width of grid item
                maxWidth: 180, // Max width for very large screens
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                position: "relative", // Needed for potential future absolute elements
                border: `1px solid ${theme.palette.divider}`, // Subtle border
                backgroundColor: badge.earned
                  ? "transparent"
                  : theme.palette.action.hover, // Different bg for unearned
                opacity: badge.earned ? 1 : 0.8, // Slightly fade unearned
                "&:hover": {
                  transform: "translateY(-4px) scale(1.03)", // More noticeable hover lift + scale
                  boxShadow: `0px 8px 20px -2px ${
                    badge.earned ? `${badge.color}30` : "rgba(0,0,0,0.1)"
                  }`, // Dynamic shadow on hover
                  border: `1px solid ${
                    badge.earned ? badge.color : theme.palette.grey[400]
                  }`,
                },
              }}
            >
              {/* Icon Container with Circular Progress */}
              <Box
                sx={{
                  position: "relative", // Needed for positioning progress and icon
                  width: badgeSize,
                  height: badgeSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1, // Margin below icon circle
                }}
              >
                {!badge.earned && (
                  <CircularProgress
                    variant="determinate"
                    value={badge.progress || 0}
                    size={badgeSize}
                    thickness={4}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color: badge.color,
                      circle: {
                        stroke: theme.palette.action.disabledBackground,
                      },
                      animation: !badge.earned
                        ? "pulse-progress 2s infinite ease-in-out"
                        : "none",
                      "@keyframes pulse-progress": {
                        "0%": { opacity: 0.7 },
                        "50%": { opacity: 1 },
                        "100%": { opacity: 0.7 },
                      },
                    }}
                  />
                )}

                <Box
                  sx={{
                    width: `calc(100% - ${!badge.earned ? "12px" : "0px"})`,
                    height: `calc(100% - ${!badge.earned ? "12px" : "0px"})`,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                    background: badge.earned
                      ? `radial-gradient(circle, ${badge.color}30 0%, ${badge.color}10 70%)`
                      : theme.palette.background.default,
                    boxShadow: badge.earned
                      ? `0 0 15px 0px ${badge.color}50`
                      : `inset 0 1px 3px rgba(0,0,0,0.1)`,
                  }}
                >
                  <badge.icon
                    sx={{
                      fontSize: iconSize,
                      color: badge.earned
                        ? badge.color
                        : theme.palette.text.disabled,
                      filter: badge.earned
                        ? `drop-shadow(0 2px 3px ${badge.color}80)`
                        : "none",
                      transition: "color 0.3s ease",
                    }}
                  />
                </Box>
              </Box>

              <Typography
                variant="body1"
                fontWeight={badge.earned ? 600 : 500}
                color={badge.earned ? "text.primary" : "text.secondary"}
                sx={{
                  lineHeight: 1.3, // Adjust line height
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                }}
              >
                {badge.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default BadgeSection;
