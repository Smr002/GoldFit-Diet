import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Divider,
} from "@mui/material";
import { LineChart, FileDown, TrendingDown, TrendingUp } from "lucide-react";

function ProgressGoalsOverview() {
  // Mock data
  const goalProgress = {
    current: 175,
    start: 185,
    goal: 165,
    percentComplete: 50,
  };

  const recentProgress = [
    {
      label: "Weight",
      value: "175 lbs",
      trend: "down",
      change: "2.5 lbs",
      color: "#10B981",
    },
    {
      label: "Bench PR",
      value: "205 lbs",
      trend: "up",
      change: "10 lbs",
      color: "#9B87F5",
    },
  ];

  return (
    <Paper
      sx={{
        p: 2.5,
        height: "100%",
        borderRadius: 3,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
        background: "linear-gradient(145deg, #ffffff, #f5f7ff)",
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
          <LineChart size={20} color="#7E69AB" />
          <Typography variant="h6" fontWeight={600} sx={{ color: "#1A1F2C" }}>
            Progress & Goals
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ color: "#403E43" }}
          >
            Weight Goal Progress
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "rgba(16, 185, 129, 0.08)",
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
              alignItems: "baseline",
            }}
          >
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: "#10B981" }}
            >
              Start: {goalProgress.start} lbs
            </Typography>
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{ color: "#10B981" }}
            >
              {goalProgress.current} lbs
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ color: "#10B981" }}
            >
              Goal: {goalProgress.goal} lbs
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={goalProgress.percentComplete}
            sx={{
              height: 10,
              borderRadius: 10,
              bgcolor: "rgba(16, 185, 129, 0.2)",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#10B981",
                borderRadius: 10,
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: "#10B981",
              display: "block",
              textAlign: "right",
              mt: 0.5,
            }}
          >
            {goalProgress.percentComplete}% complete
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2, opacity: 0.6 }} />

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{ color: "#403E43", mb: 1.5 }}
        >
          Recent Progress
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {recentProgress.map((item) => (
            <Box
              key={item.label}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                bgcolor: `${item.color}10`,
                borderRadius: 2,
                px: 2,
                py: 1.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 10px ${item.color}20`,
                },
              }}
            >
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ color: "#403E43" }}
              >
                {item.label}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ color: item.color }}
                >
                  {item.value}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: item.trend === "down" ? "#10B981" : "#EC4899",
                    bgcolor:
                      item.trend === "down"
                        ? "rgba(16, 185, 129, 0.1)"
                        : "rgba(236, 72, 153, 0.1)",
                    typography: "caption",
                    py: 0.5,
                    px: 0.8,
                    borderRadius: 1,
                  }}
                >
                  {item.trend === "down" ? (
                    <TrendingDown size={14} style={{ marginRight: "4px" }} />
                  ) : (
                    <TrendingUp size={14} style={{ marginRight: "4px" }} />
                  )}
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ color: "inherit" }}
                  >
                    {item.change}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Button
        variant="outlined"
        startIcon={<FileDown size={18} />}
        size="medium"
        fullWidth
        sx={{
          py: 1.2,
          borderColor: "#7E69AB",
          color: "#7E69AB",
          borderRadius: 2,
          fontWeight: 600,
          "&:hover": {
            borderColor: "#6E59A5",
            bgcolor: "rgba(126, 105, 171, 0.05)",
          },
        }}
      >
        Export Progress Report
      </Button>
    </Paper>
  );
}

export default ProgressGoalsOverview;
