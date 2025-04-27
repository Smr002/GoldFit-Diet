import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Grid,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import { Droplet, Utensils, Moon } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";
import { getNutritionLog } from "@/api"; // Adjust the import path

function DailySummaryWidget({ token, userId, date }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // State to store fetched data
  const [nutritionData, setNutritionData] = useState({
    calories: { consumed: 0, goal: 2100, percentage: 0 },
    macros: {
      protein: {
        amount: 0,
        goal: 150,
        percentage: 0,
        color: isDarkMode ? "#BB86FC" : "#9B87F5",
      },
      carbs: {
        amount: 0,
        goal: 220,
        percentage: 0,
        color: isDarkMode ? "#03DAC6" : "#6CCFBC",
      },
      fats: {
        amount: 0,
        goal: 70,
        percentage: 0,
        color: isDarkMode ? "#CF6679" : "#FF7D55",
      },
    },
    hydration: { amount: 0, goal: 8, percentage: 0 },
    sleep: { hours: 0, goal: 8, percentage: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch nutrition logs when component mounts or dependencies change
  useEffect(() => {
    const fetchNutritionLogs = async () => {
      try {
        setLoading(true);
        const logs = await getNutritionLog(token, userId, date); // userId not needed as per updated backend

        // Assuming logs is an array; take the first log or adjust if single object
        const log = Array.isArray(logs) ? logs[0] : logs;

        // Map API data to component state
        const calories = {
          consumed: log.totalCalories || 0, // Use totalCalories instead of calories
          goal: 2100, // Hardcoded as goal is not in API response
          percentage: log.totalCalories
            ? Math.min((log.totalCalories / 2100) * 100, 100)
            : 0,
        };

        const macros = {
          protein: {
            amount: log.protein || 0,
            goal: 150, // Hardcoded
            percentage: log.protein
              ? Math.min((log.protein / 150) * 100, 100)
              : 0,
            color: isDarkMode ? "#BB86FC" : "#9B87F5",
          },
          carbs: {
            amount: log.carbs || 0,
            goal: 220, // Hardcoded
            percentage: log.carbs ? Math.min((log.carbs / 220) * 100, 100) : 0,
            color: isDarkMode ? "#03DAC6" : "#6CCFBC",
          },
          fats: {
            amount: log.fats || 0,
            goal: 70, // Hardcoded
            percentage: log.fats ? Math.min((log.fats / 70) * 100, 100) : 0,
            color: isDarkMode ? "#CF6679" : "#FF7D55",
          },
        };

        const hydration = {
          amount: log.hydration || 0, // Use hydration instead of water
          goal: 8, // Hardcoded
          percentage: log.hydration
            ? Math.min((log.hydration / 8) * 100, 100)
            : 0,
        };

        // Sleep data is not available in the API response
        // Option 1: Remove sleep section (commented out below in UI)
        // Option 2: Fetch sleep data separately if available from another endpoint
        const sleep = {
          hours: 0, // No sleep data in API response
          goal: 8, // Hardcoded
          percentage: 0,
        };

        setNutritionData({ calories, macros, hydration, sleep });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching nutrition logs:", err);
        setError(err.message || "Failed to load nutrition data");
        setLoading(false);
      }
    };

    if (token && date) {
      fetchNutritionLogs();
    } else {
      setError("Missing required parameters (token or date)");
      setLoading(false);
    }
  }, [token, date, isDarkMode]);

  // Render loading state
  if (loading) {
    return (
      <Paper sx={{ p: 2.5, height: "100%", borderRadius: 3 }}>
        <Typography>Loading...</Typography>
      </Paper>
    );
  }

  // Render error state
  if (error) {
    return (
      <Paper sx={{ p: 2.5, height: "100%", borderRadius: 3 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  // Destructure fetched data
  const { calories, macros, hydration, sleep } = nutritionData;

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Utensils
          size={20}
          style={{ color: isDarkMode ? theme.palette.primary.main : "#7E69AB" }}
        />
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ color: theme.palette.text.primary }}
        >
          Daily Summary
        </Typography>
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ color: theme.palette.text.primary }}
          >
            Calories
          </Typography>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ color: theme.palette.text.primary }}
          >
            {calories.consumed}{" "}
            <span
              style={{ color: theme.palette.text.secondary, fontWeight: 400 }}
            >
              / {calories.goal} kcal
            </span>
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={calories.percentage}
          sx={{
            height: 10,
            borderRadius: 2,
            bgcolor: isDarkMode
              ? "rgba(187, 134, 252, 0.15)"
              : "rgba(155, 135, 245, 0.15)",
            "& .MuiLinearProgress-bar": {
              bgcolor: isDarkMode ? "#BB86FC" : "#9B87F5",
              borderRadius: 2,
            },
          }}
        />
      </Box>

      <Divider sx={{ my: 2, opacity: isDarkMode ? 0.2 : 0.6 }} />

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{ color: theme.palette.text.primary, mb: 1.5 }}
        >
          Macronutrients
        </Typography>

        <Grid container spacing={2}>
          {Object.entries(macros).map(([name, data]) => (
            <Grid item xs={4} key={name} sx={{ textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  textTransform: "capitalize",
                  mb: 0.5,
                }}
              >
                {name}
              </Typography>
              <Box
                sx={{ position: "relative", display: "inline-flex", my: 0.5 }}
              >
                <CircularProgress
                  variant="determinate"
                  value={data.percentage}
                  size={66}
                  thickness={4}
                  sx={{
                    color: data.color,
                    "& .MuiCircularProgress-circle": {
                      strokeLinecap: "round",
                    },
                  }}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    fontWeight={600}
                    sx={{ color: data.color, fontSize: "0.9rem" }}
                  >
                    {Math.round(data.percentage)}%
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ color: theme.palette.text.primary }}
              >
                {data.amount}
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "0.8rem",
                    marginLeft: "1px",
                    color: theme.palette.text.secondary,
                  }}
                >
                  g
                </span>
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: theme.palette.text.secondary, display: "block" }}
              >
                of {data.goal}g
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 2, opacity: isDarkMode ? 0.2 : 0.6 }} />

      <Grid container spacing={3} sx={{ mt: 0.5 }}>
        <Grid item xs={6}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.8,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <Droplet
                  size={18}
                  style={{ color: isDarkMode ? "#90CAF9" : "#3B82F6" }}
                />
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ color: theme.palette.text.primary }}
                >
                  Water
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: isDarkMode ? "#90CAF9" : "#3B82F6" }}
              >
                {hydration.amount}/{hydration.goal}{" "}
                <span style={{ fontSize: "0.7rem" }}>L</span>
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={hydration.percentage}
              color="primary"
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: isDarkMode
                  ? "rgba(144, 202, 249, 0.15)"
                  : "rgba(59, 130, 246, 0.15)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: isDarkMode ? "#90CAF9" : "#3B82F6",
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Grid>
        {/* Comment out Sleep section since data is not available */}
        {/* <Grid item xs={6}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.8,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <Moon
                  size={18}
                  style={{ color: isDarkMode ? "#BB86FC" : "#8B5CF6" }}
                />
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ color: theme.palette.text.primary }}
                >
                  Sleep
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: isDarkMode ? "#BB86FC" : "#8B5CF6" }}
              >
                {sleep.hours} <span style={{ fontSize: "0.7rem" }}>hrs</span>
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={sleep.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: isDarkMode
                  ? "rgba(187, 134, 252, 0.15)"
                  : "rgba(139, 92, 246, 0.15)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: isDarkMode ? "#BB86FC" : "#8B5CF6",
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Grid> */}
      </Grid>
    </Paper>
  );
}

export default DailySummaryWidget;
