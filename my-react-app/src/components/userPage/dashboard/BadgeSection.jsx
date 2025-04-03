import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  CircularProgress,
  Tooltip,
  useTheme,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

const badges = [
  {
    name: "7-Day Streak",
    icon: EmojiEventsIcon,
    earned: true,
    description: "Log workouts for 7 days straight",
  },
  {
    name: "5 Workouts",
    icon: MilitaryTechIcon,
    earned: true,
    description: "Complete 5 workout sessions",
  },
  {
    name: "Weight Goal",
    icon: StarIcon,
    earned: false,
    progress: 75,
    description: "Reach your weight target goal",
  },
];

function BadgeSection() {
  const theme = useTheme();

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={2}>
        <WorkspacePremiumIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" fontWeight="bold">
          Achievements
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {badges.map((badge) => {
          const Icon = badge.icon;

          return (
            <Grid item xs={12} sm={4} key={badge.name}>
              <Tooltip
                title={
                  <Typography fontSize={13} fontWeight={500}>
                    {badge.description}
                  </Typography>
                }
                arrow
              >
                <Box
                  sx={{
                    borderRadius: 3,
                    background: badge.earned
                      ? "linear-gradient(135deg, #a855f7, #9333ea)"
                      : "background.paper",
                    color: badge.earned ? "white" : "text.secondary",
                    boxShadow: badge.earned ? 4 : 1,
                    p: 2,
                    minHeight: 130,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    transition: "transform 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  {badge.earned ? (
                    <>
                      <Avatar
                        sx={{
                          bgcolor: "white",
                          width: 56,
                          height: 56,
                          mb: 1,
                          boxShadow: 2,
                        }}
                      >
                        <Icon sx={{ color: "secondary.main", fontSize: 28 }} />
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>
                        {badge.name}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Box position="relative" width={64} height={64} mb={1}>
                        <CircularProgress
                          variant="determinate"
                          value={badge.progress}
                          size={64}
                          thickness={5}
                          sx={{
                            color: "primary.main",
                            position: "absolute",
                            top: 0,
                            left: 0,
                          }}
                        />
                        <Avatar
                          sx={{
                            bgcolor: "action.hover",
                            width: 56,
                            height: 56,
                            zIndex: 1,
                            position: "relative",
                            left: 2,
                          }}
                        >
                          <Icon
                            sx={{ color: "text.secondary", fontSize: 26 }}
                          />
                        </Avatar>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 2,
                            color: "text.primary",
                          }}
                        ></Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {badge.name}
                      </Typography>
                    </>
                  )}
                </Box>
              </Tooltip>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
}

export default BadgeSection;
