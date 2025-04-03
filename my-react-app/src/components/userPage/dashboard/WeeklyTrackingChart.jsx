import React from "react";
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
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const data = [
  { day: "Monday", weights: 0, calories: 22, reps: 18 },
  { day: "Tuesday", weights: 15, calories: 10, reps: 30 },
  { day: "Wednesday", weights: 40, calories: 20, reps: 25 },
  { day: "Thursday", weights: 28, calories: 15, reps: 40 },
  { day: "Friday", weights: 30, calories: 50, reps: 42 },
  { day: "Saturday", weights: 18, calories: 52, reps: 41 },
  { day: "Sunday", weights: 32, calories: 49, reps: 30 },
];

function WeeklyTrackingChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        mb: 4,
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0px 8px 24px -4px rgba(0,0,0,0.06)`,
        overflowX: isMobile ? "auto" : "visible", // allow scroll if needed
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
        justifyContent="flex-start"
        minWidth={isMobile ? 600 : "auto"} // prevents squished text
      >
        <TrendingUpIcon color="primary" />
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            fontSize: { xs: 15, sm: 18, md: 20 },
            textAlign: "left",
          }}
        >
          WE HAVE BEEN KEEPING{" "}
          <Box
            component="span"
            color="warning.main"
            fontWeight="bold"
            display="inline"
          >
            TRACK
          </Box>{" "}
          OF YOU
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Chart */}
      <Box sx={{ width: isMobile ? 600 : "100%" }}>
        <ResponsiveContainer width="100%" height={isMobile ? 240 : 320}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme.palette.grey[300]}
            />
            <XAxis
              dataKey="day"
              stroke={theme.palette.text.secondary}
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              tick={{ fontSize: isMobile ? 10 : 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: 8,
                border: "1px solid #e0e0e0",
                fontSize: 13,
              }}
              labelStyle={{ fontWeight: 600 }}
              itemStyle={{ color: theme.palette.text.primary }}
            />
            <Legend verticalAlign="top" iconType="circle" height={36} />
            <Line
              type="monotone"
              dataKey="weights"
              name="Weights"
              stroke="#29b6f6"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              name="Calories"
              stroke="#ff9800"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="reps"
              name="Total Reps"
              stroke="#3f51b5"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default WeeklyTrackingChart;
