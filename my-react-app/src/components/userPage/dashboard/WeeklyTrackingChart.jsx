import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Paper,
  Box,
  Typography,
  useTheme,
  Divider,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getWeeklySummary } from "../../../api";

function WeeklyTrackingChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const today = new Date();
        const weekStart = new Date(
          today.setDate(today.getDate() - today.getDay())
        )
          .toISOString()
          .split("T")[0];

        const summary = await getWeeklySummary(token, weekStart);

        // Transform the data for the chart
        const days = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const transformedData = days.map((day, index) => ({
          day,
          calories: summary.calories.daily[index] || 0,
          protein: summary.nutrition.averages.protein || 0,
          workouts: summary.workouts.completed || 0,
          caloriesBurned: summary.workouts.caloriesBurned || 0,
        }));

        setChartData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, []);

  if (loading) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 400,
        }}
      >
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            p: 2,
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            border: "none",
          }}
        >
          <Typography fontWeight="bold" mb={1}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                }}
              />
              <Typography variant="body2">
                {entry.name}: {entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        mb: 4,
        display: { xs: "none", sm: "flex" },
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
        overflowX: isMobile ? "auto" : "visible",
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-5px)",
        },
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mb={3}
        justifyContent="flex-start"
        minWidth={isMobile ? 600 : "auto"}
      >
        <TrendingUpIcon
          color="primary"
          sx={{
            fontSize: 32,
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.1)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        />
        <Typography
          variant="h5"
          fontWeight="800"
          sx={{
            fontSize: { xs: 16, sm: 20, md: 24 },
            background: "linear-gradient(45deg, #2196F3 30%, #FF9800 90%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Weekly Progress Tracker
        </Typography>
      </Box>

      <Divider sx={{ mb: 3, opacity: 0.6 }} />

      {/* Chart */}
      <Box sx={{ width: isMobile ? 600 : "100%" }}>
        <ResponsiveContainer width="100%" height={isMobile ? 280 : 380}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <defs>
              {[
                { id: "calories", color: "#ff9800" },
                { id: "protein", color: "#29b6f6" },
                { id: "caloriesBurned", color: "#3f51b5" },
              ].map(({ id, color }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.2}
            />
            <XAxis
              dataKey="day"
              stroke={theme.palette.text.secondary}
              tick={{ fontSize: isMobile ? 11 : 13 }}
              tickLine={false}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              tick={{ fontSize: isMobile ? 11 : 13 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              iconType="circle"
              height={50}
              wrapperStyle={{
                paddingBottom: "20px",
              }}
            />
            {[
              { key: "calories", name: "Calories Consumed", stroke: "#ff9800" },
              { key: "protein", name: "Protein (g)", stroke: "#29b6f6" },
              {
                key: "caloriesBurned",
                name: "Calories Burned",
                stroke: "#3f51b5",
              },
            ].map(({ key, name, stroke }) => (
              <Line
                key={key}
                type="monotoneX"
                dataKey={key}
                name={name}
                stroke={stroke}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 7, strokeWidth: 0 }}
                fill={`url(#${key})`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default WeeklyTrackingChart;
