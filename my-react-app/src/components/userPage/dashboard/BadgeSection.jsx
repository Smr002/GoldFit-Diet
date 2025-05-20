// BadgeSection.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  useTheme,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";       // trophy
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";     // medal
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import StarIcon from "@mui/icons-material/Star";
import { getUserBadges, getWorkoutStreak } from "@/api";

export default function BadgeSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [streak, setStreak] = useState(null);
  const [badgeInfo, setBadgeInfo] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem("token") || "";
        const { streak } = await getWorkoutStreak(token);
        setStreak(streak);
        const info = await getUserBadges(token);
        setBadgeInfo(info);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  // Build badges: first two are dynamic
  const badges = [
    {
      name: `${streak != null ? streak : "–"}-Day Streak`,
      
      Icon: EmojiEventsIcon,
      earned: streak > 0,
      progress: streak || 0,
      color: isDark ? "#FFD700" : "#FFC107",
    },
    {
      name: `${badgeInfo?.totalSessions ?? "–"} Workouts`,
      
      Icon: MilitaryTechIcon,
      earned: (badgeInfo?.totalSessions ?? 0) > 0,
      progress: badgeInfo?.totalSessions ?? 0,
      color: isDark ? "#BB86FC" : "#673AB7",
    },
    {
      name: badgeInfo?.badge ?? "Badge",
      
      Icon: StarIcon,
      earned: !!badgeInfo,
      color: isDark ? "#03DAC6" : "#009688",
    },
    {
      name: "Perfect Month",
      Icon: WorkspacePremiumIcon,
      earned: false,
      progress: 15,
      color: isDark ? "#CF6679" : "#E91E63",
    },
  ];

  const badgeSize = { xs: 60, sm: 70, md: 80 };
  const iconSize  = { xs: "2rem", sm: "2.2rem", md: "2.5rem" };

  return (
    <Paper
      elevation={4}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        boxShadow: isDark
          ? "0px 10px 30px -5px rgba(0,0,0,0.3)"
          : "0px 10px 30px -5px rgba(100,100,150,0.15)",
        background: isDark
          ? "linear-gradient(135deg,#1e1e1e 0%,#2d2d2d 100%)"
          : `linear-gradient(135deg,${theme.palette.grey[50]} 0%,${theme.palette.grey[100]} 100%)`,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 3,
          px: 1,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Your Achievements
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {badges.map(({ name, description, Icon, earned, progress, color }, idx) => (
          <Grid
            key={idx}
            item
            xs={6}
            sm={6}
            md={3}
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
                position: "relative",
                border: `1px solid ${
                  isDark ? "rgba(255,255,255,0.1)" : theme.palette.divider
                }`,
                backgroundColor: earned
                  ? "transparent"
                  : isDark
                  ? "rgba(255,255,255,0.05)"
                  : theme.palette.action.hover,
                opacity: earned ? 1 : 0.8,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px) scale(1.03)",
                  boxShadow: `0px 8px 20px -2px ${
                    earned ? `${color}30` : isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.1)"
                  }`,
                  border: `1px solid ${
                    earned
                      ? color
                      : isDark
                      ? "rgba(255,255,255,0.2)"
                      : theme.palette.grey[400]
                  }`,
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: badgeSize,
                  height: badgeSize,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {!earned && (
                  <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={badgeSize}
                    thickness={4}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      color,
                      circle: {
                        stroke: isDark
                          ? "rgba(255,255,255,0.1)"
                          : theme.palette.action.disabledBackground,
                      },
                    }}
                  />
                )}
                <Box
                  sx={{
                    width: `calc(100% - ${!earned ? "12px" : "0px"})`,
                    height: `calc(100% - ${!earned ? "12px" : "0px"})`,
                    borderRadius: "50%",
                    background: earned
                      ? `radial-gradient(circle, ${color}30 0%, ${color}10 70%)`
                      : isDark
                      ? "rgba(255,255,255,0.03)"
                      : theme.palette.background.default,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon sx={{ fontSize: iconSize, color, filter: earned ? `drop-shadow(0 2px 3px ${color}80)` : "none" }} />
                </Box>
              </Box>
              <Typography variant="body1" fontWeight={earned ? 600 : 500} color={earned ? "text.primary" : "text.secondary"}>
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
