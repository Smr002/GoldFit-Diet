import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Grid,
  Paper,
  CircularProgress,
  Divider,
  useTheme,
} from "@mui/material";
import OpacityIcon from "@mui/icons-material/Opacity";
import HotelIcon from "@mui/icons-material/Hotel";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { motion } from "framer-motion";

// Animated number for % values
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

      if (step >= totalSteps) {
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [value]);

  return <>{displayValue}%</>;
}

function DailySummaryWidget() {
  const theme = useTheme();

  const calories = {
    consumed: 1450,
    goal: 2100,
    percentage: 69,
  };

  const macros = {
    protein: { amount: 95, goal: 150, percentage: 63 },
    carbs: { amount: 130, goal: 220, percentage: 59 },
    fats: { amount: 40, goal: 70, percentage: 57 },
  };

  const hydration = {
    amount: 4,
    goal: 8,
    percentage: 50,
  };

  const sleep = {
    hours: 7.5,
    goal: 8,
    percentage: 94,
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <LocalFireDepartmentIcon color="error" />
        <Typography variant="h6" fontWeight="bold">
          Daily Summary
        </Typography>
      </Box>

      {/* Calories */}
      <Box sx={{ mb: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2" fontWeight={500}>
            Calories Consumed
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {calories.consumed} / {calories.goal} kcal
          </Typography>
        </Box>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${calories.percentage}%` }}
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
                backgroundColor: theme.palette.warning.main,
              },
            }}
          />
        </motion.div>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Macros */}
      <Grid
        container
        spacing={2}
        justifyContent="space-around"
        textAlign="center"
        sx={{ mb: 2 }}
      >
        {Object.entries(macros).map(([name, data]) => {
          const color =
            name === "protein"
              ? "secondary"
              : name === "carbs"
              ? "primary"
              : "warning";

          return (
            <Grid item xs={4} key={name}>
              <Typography variant="caption" fontWeight={500}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 1,
                  mb: 0.5,
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={data.percentage}
                  size={60}
                  thickness={5}
                  color={color}
                />
                <motion.div
                  initial={{ strokeDasharray: "0 100" }}
                  animate={{ strokeDasharray: "100 0" }}
                  transition={{ duration: 1 }}
                ></motion.div>
                <Box
                  sx={{
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="text.secondary"
                  >
                    {data.percentage}%
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" fontWeight={600}>
                {data.amount}g
              </Typography>
            </Grid>
          );
        })}
      </Grid>

      <Divider sx={{ mb: 2 }} />

      {/* Hydration and Sleep */}
      <Grid container spacing={2}>
        {[
          {
            label: "Hydration",
            icon: <OpacityIcon color="primary" fontSize="small" />,
            ...hydration,
            color: "primary",
          },
          {
            label: "Sleep",
            icon: <HotelIcon color="secondary" fontSize="small" />,
            ...sleep,
            color: "secondary",
          },
        ].map((item, idx) => (
          <Grid item xs={6} key={idx}>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              {item.icon}
              {item.label}
            </Typography>
            <Typography
              variant="caption"
              fontWeight={500}
              color="text.secondary"
            >
              {item.hours
                ? `${item.hours} / ${item.goal} hours`
                : `${item.amount} / ${item.goal} glasses`}
            </Typography>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ duration: 1 }}
            >
              <LinearProgress
                variant="determinate"
                value={100}
                color={item.color}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  mt: 0.5,
                  bgcolor: "grey.200",
                }}
              />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default DailySummaryWidget;
