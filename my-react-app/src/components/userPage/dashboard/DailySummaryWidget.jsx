import React from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { Droplet, Utensils, Moon } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";

function DailySummaryWidget() {
  // Mock data
  const calories = {
    consumed: 1450,
    goal: 2100,
    percentage: 69,
  };

  const macros = {
    protein: { amount: 95, goal: 150, percentage: 63, color: "#9B87F5" },
    carbs: { amount: 130, goal: 220, percentage: 59, color: "#6CCFBC" },
    fats: { amount: 40, goal: 70, percentage: 57, color: "#FF7D55" },
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
      sx={{
        p: 2.5,
        height: "100%",
        borderRadius: 3,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
        background: "linear-gradient(145deg, #ffffff, #f5f7ff)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Utensils size={20} style={{ color: "#7E69AB" }} />
        <Typography variant="h6" fontWeight={600} sx={{ color: "#1A1F2C" }}>
          Daily Summary
        </Typography>
      </Box>

      <Box sx={{ mb: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ color: "#403E43" }}
          >
            Calories
          </Typography>
          <Typography
            variant="body1"
            fontWeight={600}
            sx={{ color: "#403E43" }}
          >
            {calories.consumed}{" "}
            <span style={{ color: "#8E9196", fontWeight: 400 }}>
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
            bgcolor: "rgba(155, 135, 245, 0.15)",
            "& .MuiLinearProgress-bar": {
              bgcolor: "#9B87F5",
              borderRadius: 2,
            },
          }}
        />
      </Box>

      <Divider sx={{ my: 2, opacity: 0.6 }} />

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          fontWeight={600}
          sx={{ color: "#403E43", mb: 1.5 }}
        >
          Macronutrients
        </Typography>

        <Grid container spacing={2}>
          {Object.entries(macros).map(([name, data]) => (
            <Grid item xs={4} key={name} sx={{ textAlign: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "#8E9196", textTransform: "capitalize", mb: 0.5 }}
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
                    {data.percentage}%
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{ color: "#403E43" }}
              >
                {data.amount}
                <span
                  style={{
                    fontWeight: 400,
                    fontSize: "0.8rem",
                    marginLeft: "1px",
                  }}
                >
                  g
                </span>
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "#8E9196", display: "block" }}
              >
                of {data.goal}g
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 2, opacity: 0.6 }} />

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
                <Droplet size={18} style={{ color: "#3B82F6" }} />
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ color: "#403E43" }}
                >
                  Water
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: "#3B82F6" }}
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
                bgcolor: "rgba(59, 130, 246, 0.15)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#3B82F6",
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
                <Moon size={18} style={{ color: "#8B5CF6" }} />
                <Typography
                  variant="body1"
                  fontWeight={600}
                  sx={{ color: "#403E43" }}
                >
                  Sleep
                </Typography>
              </Box>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: "#8B5CF6" }}
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
                bgcolor: "rgba(139, 92, 246, 0.15)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#8B5CF6",
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
