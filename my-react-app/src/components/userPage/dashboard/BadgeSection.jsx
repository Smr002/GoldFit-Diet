import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  useTheme,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

function BadgeSection() {
  const theme = useTheme();

  const badges = [
    {
      name: "7-Day Streak",
      description: "Completed workouts 7 days in a row!",
      icon: EmojiEventsIcon,
      earned: true,
      color: "#FFC107",
    },
    {
      name: "5 Workouts",
      description: "Logged your first 5 workouts.",
      icon: MilitaryTechIcon,
      earned: true,
      color: "#673AB7",
    },
    {
      name: "Weight Goal",
      description: "Reach your target weight.",
      icon: StarIcon,
      earned: false,
      progress: 65,
      color: "#009688",
    },
    {
      name: "Perfect Month",
      description: "Workout every scheduled day in a month.",
      icon: WorkspacePremiumIcon,
      earned: false,
      progress: 15,
      color: "#E91E63",
    },
  ];

  const badgeSize = { xs: 60, sm: 70, md: 80 };
  const iconSize = { xs: "2rem", sm: "2.2rem", md: "2.5rem" };

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, sm: 3 },
        height: "100%",
        borderRadius: 4,
        boxShadow: "0px 10px 30px -5px rgba(100, 100, 150, 0.15)",
        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3.5,
          px: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <WorkspacePremiumIcon
            fontSize="large"
            sx={{ color: theme.palette.primary.main }}
          />
          <Typography variant="h5" fontWeight={700} color="text.primary">
            Your Achievements
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {badges.map((badge, index) => (
          <Grid
            item
            xs={6}
            sm={6}
            md={3}
            key={badge.name + index}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: 1,
                p: { xs: 1, sm: 1.5 },
                borderRadius: 3,
                width: "100%",
                maxWidth: 180,
                transition:
                  "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                position: "relative",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: badge.earned
                  ? "transparent"
                  : theme.palette.action.hover,
                opacity: badge.earned ? 1 : 0.8,
                "&:hover": {
                  transform: "translateY(-4px) scale(1.03)",
                  boxShadow: `0px 8px 20px -2px ${
                    badge.earned ? `${badge.color}30` : "rgba(0,0,0,0.1)"
                  }`,
                  border: `1px solid ${
                    badge.earned ? badge.color : theme.palette.grey[400]
                  }`,
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: badgeSize,
                  height: badgeSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1,
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
                  lineHeight: 1.3,
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
