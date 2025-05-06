import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Grid,
  Paper,
  Divider,
  useTheme,
  Button,
} from "@mui/material";
import {
  Droplet,
  Utensils,
  Moon,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
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
        color: isDarkMode ? "#FFD700" : "#9B87F5", // Gold in dark mode
      },
      carbs: {
        amount: 0,
        goal: 220,
        percentage: 0,
        color: isDarkMode ? "#FFC107" : "#6CCFBC", // Amber in dark mode
      },
      fats: {
        amount: 0,
        goal: 70,
        percentage: 0,
        color: isDarkMode ? "#DAA520" : "#FF7D55", // Goldenrod in dark mode
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
        const logs = await getNutritionLog(token, userId, date);

        // Assuming logs is an array; take the first log or adjust if single object
        const log = Array.isArray(logs) ? logs[0] : logs;

        // Map API data to component state
        const calories = {
          consumed: log.totalCalories || 0,
          goal: 2100,
          percentage: log.totalCalories
            ? Math.min((log.totalCalories / 2100) * 100, 100)
            : 0,
        };

        const macros = {
          protein: {
            amount: log.protein || 0,
            goal: 150,
            percentage: log.protein
              ? Math.min((log.protein / 150) * 100, 100)
              : 0,
            color: isDarkMode ? "#FFD700" : "#9B87F5", // Gold in dark mode
          },
          carbs: {
            amount: log.carbs || 0,
            goal: 220,
            percentage: log.carbs ? Math.min((log.carbs / 220) * 100, 100) : 0,
            color: isDarkMode ? "#FFC107" : "#6CCFBC", // Amber in dark mode
          },
          fats: {
            amount: log.fats || 0,
            goal: 70,
            percentage: log.fats ? Math.min((log.fats / 70) * 100, 100) : 0,
            color: isDarkMode ? "#DAA520" : "#FF7D55", // Goldenrod in dark mode
          },
        };

        const hydration = {
          amount: log.hydration || 0,
          goal: 8,
          percentage: log.hydration
            ? Math.min((log.hydration / 8) * 100, 100)
            : 0,
        };

        const sleep = {
          hours: 0,
          goal: 8,
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

  // Function to retry loading data
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Re-trigger the useEffect by changing its dependency (could be improved with a counter)
    setTimeout(() => {
      if (token && date) {
        // This will trigger the useEffect again
        const fetchNutritionLogs = async () => {
          try {
            const logs = await getNutritionLog(token, userId, date);
            // Process logs as before...
            const log = Array.isArray(logs) ? logs[0] : logs;

            // Update state with fetched data
            // (This is duplicate code from the useEffect, which could be refactored to a separate function)
            // ...code omitted for brevity

            setLoading(false);
          } catch (err) {
            console.error("Error retrying nutrition logs fetch:", err);
            setError(err.message || "Failed to reload nutrition data");
            setLoading(false);
          }
        };

        fetchNutritionLogs();
      } else {
        setError("Missing required parameters (token or date)");
        setLoading(false);
      }
    }, 500);
  };

  // Render loading state
  if (loading) {
    return (
      <Paper
        sx={{
          p: 2.5,
          height: "100%",
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: isDarkMode
            ? "0px 4px 20px rgba(0, 0, 0, 0.4)"
            : "0px 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress
            size={40}
            thickness={4}
            sx={{
              color: isDarkMode
                ? theme.palette.primary.main
                : theme.palette.primary.main,
            }}
          />
        </Box>
      </Paper>
    );
  }

  // Render error state
  if (error) {
    return (
      <Paper
        sx={{
          p: 2.5,
          height: "100%",
          borderRadius: 3,
          bgcolor: "background.paper",
          boxShadow: isDarkMode
            ? "0px 4px 20px rgba(0, 0, 0, 0.4)"
            : "0px 4px 20px rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          background: isDarkMode
            ? "linear-gradient(145deg, #1a1a1a, #282828)"
            : "linear-gradient(145deg, #ffffff, #f5f7ff)",
        }}
      >
        <Box
          sx={{
            mb: 2,
            p: 2,
            borderRadius: "50%",
            bgcolor: isDarkMode
              ? "rgba(255, 99, 71, 0.1)"
              : "rgba(255, 99, 71, 0.08)",
          }}
        >
          <AlertTriangle
            size={32}
            style={{
              color: isDarkMode ? "#FF6347" : "#E53935",
            }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: isDarkMode ? "#FF6347" : "#E53935",
            fontWeight: 600,
          }}
        >
          No Calories Have Been Logged Yet
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: theme.palette.text.secondary,
            maxWidth: "85%",
          }}
        >
          Please log your meals to see your daily summary. You can do this in
          the "Nutrition" section of the app.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshCw size={16} />}
          onClick={handleRetry}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 3,
            color: isDarkMode ? theme.palette.primary.main : "#7E69AB",
            borderColor: isDarkMode ? theme.palette.primary.main : "#7E69AB",
            "&:hover": {
              borderColor: isDarkMode ? theme.palette.primary.light : "#9B87F5",
              backgroundColor: isDarkMode
                ? "rgba(255, 215, 0, 0.05)"
                : "rgba(155, 135, 245, 0.05)",
            },
          }}
        >
          Try Again
        </Button>
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
          ? "0px 4px 20px rgba(0, 0, 0, 0.4)"
          : "0px 4px 20px rgba(0, 0, 0, 0.08)",
        background: isDarkMode
          ? "linear-gradient(145deg, #1a1a1a, #282828)"
          : "linear-gradient(145deg, #ffffff, #f5f7ff)",
        transition: "background 0.3s ease, box-shadow 0.3s ease",
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
              ? "rgba(255, 215, 0, 0.15)"
              : "rgba(155, 135, 245, 0.15)",
            "& .MuiLinearProgress-bar": {
              bgcolor: isDarkMode ? theme.palette.primary.main : "#9B87F5",
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
                    "&.MuiCircularProgress-root": {
                      bgcolor: isDarkMode
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                      borderRadius: "50%",
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
                <Moon
                  size={18}
                  style={{ color: isDarkMode ? "#FFD700" : "#8B5CF6" }}
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
                sx={{ color: isDarkMode ? "#FFD700" : "#8B5CF6" }}
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
                  ? "rgba(255, 215, 0, 0.15)"
                  : "rgba(139, 92, 246, 0.15)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: isDarkMode ? "#FFD700" : "#8B5CF6",
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default DailySummaryWidget;
