import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Divider,
} from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { motion } from "framer-motion";

// Animated percentage number
function AnimatedNumber({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 1000 / 60;
    const totalSteps = duration / stepTime;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const current = Math.round(progress * value);
      setDisplayValue(current);
      if (step >= totalSteps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [value]);

  return <></>;
}

function ProgressGoalsOverview() {
  const goalProgress = {
    current: 175,
    start: 185,
    goal: 165,
    percentComplete: 50,
  };

  const recentProgress = [
    { label: "Weight", value: "175 lbs", trend: "down", change: "2.5 lbs" },
    { label: "Bench PR", value: "205 lbs", trend: "up", change: "10 lbs" },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <InsightsIcon color="secondary" />
        <Typography variant="h6" fontWeight="bold">
          Progress & Goals
        </Typography>
      </Box>

      {/* Weight Goal */}
      <Box mb={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={0.5}
        >
          <Typography variant="body2" fontWeight={500}>
            Weight Goal
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="caption" color="text.secondary">
              {goalProgress.start} lbs
            </Typography>
            <Typography variant="caption">→</Typography>
            <Typography variant="caption" fontWeight={600}>
              {goalProgress.current} lbs
            </Typography>
            <Typography variant="caption">→</Typography>
            <Typography variant="caption" color="primary" fontWeight={600}>
              {goalProgress.goal} lbs
            </Typography>
          </Box>
        </Box>

        <Box position="relative" sx={{ mb: 0.5 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${goalProgress.percentComplete}%` }}
            transition={{ duration: 1 }}
          >
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{
                height: 10,
                borderRadius: 5,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#ff6f00",
                },
              }}
            />
          </motion.div>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            <AnimatedNumber value={goalProgress.percentComplete} />
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Recent Progress */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
        Recent Progress
      </Typography>

      <Box display="flex" flexDirection="column" gap={1.5} mb={3}>
        {recentProgress.map((item) => {
          const isDown = item.trend === "down";
          return (
            <Box
              key={item.label}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 2,
                py: 1.2,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="body2">{item.label}</Typography>

              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" fontWeight={600}>
                  {item.value}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: isDown ? "success.main" : "secondary.main",
                  }}
                >
                  {isDown ? (
                    <TrendingDownIcon fontSize="small" />
                  ) : (
                    <TrendingUpIcon fontSize="small" />
                  )}
                  <Typography
                    variant="caption"
                    sx={{ ml: 0.5, fontWeight: 500 }}
                  >
                    {item.change}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        size="small"
        fullWidth
      >
        Export Progress Report
      </Button>
    </Paper>
  );
}

export default ProgressGoalsOverview;
