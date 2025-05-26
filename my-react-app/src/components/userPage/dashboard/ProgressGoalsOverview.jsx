// ProgressGoalsOverview.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Divider,
  useTheme,
} from "@mui/material";
import { LineChart, FileDown, TrendingDown, TrendingUp } from "lucide-react";
import ExportPDFModal from "./ExportPDFModal";
import { getRecentExercises } from "@/api";

export default function ProgressGoalsOverview() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // Export modal state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  // Real recent exercises state
  const [recentExercises, setRecentExercises] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const data = await getRecentExercises(token);
        setRecentExercises(data);
      } catch (err) {
        console.error("Failed to load recent exercises:", err);
      }
    })();
  }, []);

  const goalProgress = {
    current: 175,
    start: 185,
    goal: 165,
    percentComplete: 50,
  };

  const handleOpenExportModal = () => setExportModalOpen(true);
  const handleCloseExportModal = () => setExportModalOpen(false);

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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LineChart
            size={20}
            color={isDarkMode ? theme.palette.primary.main : "#7E69AB"}
          />
          <Typography variant="h6" fontWeight={600} color="text.primary">
            Progress & Goals
          </Typography>
        </Box>
      </Box>

      {/* Weight Goal Progress */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          fontWeight={600}
          color="text.primary"
          sx={{ mb: 1 }}
        >
          Weight Goal Progress
        </Typography>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: isDarkMode
              ? "rgba(16,185,129,0.05)"
              : "rgba(16,185,129,0.08)",
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
            <Typography variant="body2" fontWeight={500} color="#10B981">
              Start: {goalProgress.start} lbs
            </Typography>
            <Typography variant="body1" fontWeight={600} color="#10B981">
              {goalProgress.current} lbs
            </Typography>
            <Typography variant="body2" fontWeight={500} color="#10B981">
              Goal: {goalProgress.goal} lbs
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={goalProgress.percentComplete}
            sx={{
              height: 10,
              borderRadius: 10,
              bgcolor: isDarkMode
                ? "rgba(16,185,129,0.1)"
                : "rgba(16,185,129,0.2)",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#10B981",
                borderRadius: 10,
              },
            }}
          />
          <Typography
            variant="caption"
            color="#10B981"
            sx={{ display: "block", textAlign: "right", mt: 0.5 }}
          >
            {goalProgress.percentComplete}% complete
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2, opacity: isDarkMode ? 0.2 : 0.6 }} />

      {/* Recent Progress (Real Data) */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="body1"
          fontWeight={600}
          color="text.primary"
          sx={{ mb: 1.5 }}
        >
          Recent Progress
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {recentExercises.map(
            ({ exerciseId, name, currentWeight, previousWeight }) => {
              const change = currentWeight - previousWeight;
              const trendUp = change > 0;
              const color = trendUp ? "#EC4899" : "#10B981";

              return (
                <Box
                  key={exerciseId}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: isDarkMode ? `${color}08` : `${color}10`,
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: isDarkMode
                        ? `0 4px 10px ${color}15`
                        : `0 4px 10px ${color}20`,
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color="text.primary"
                  >
                    {name}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body1" fontWeight={600} sx={{ color }}>
                      {currentWeight} kg
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color,
                        bgcolor: trendUp
                          ? isDarkMode
                            ? "rgba(236,72,153,0.08)"
                            : "rgba(236,72,153,0.1)"
                          : isDarkMode
                          ? "rgba(16,185,129,0.08)"
                          : "rgba(16,185,129,0.1)",
                        typography: "caption",
                        py: 0.5,
                        px: 0.8,
                        borderRadius: 1,
                      }}
                    >
                      {trendUp ? (
                        <TrendingUp size={14} style={{ marginRight: 4 }} />
                      ) : (
                        <TrendingDown size={14} style={{ marginRight: 4 }} />
                      )}
                      <Typography variant="caption" fontWeight={600}>
                        {Math.abs(change)} kg
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            }
          )}
        </Box>
      </Box>

      {/* Export Buutton */}
      <Button
        variant="outlined"
        startIcon={<FileDown size={18} />}
        fullWidth
        onClick={handleOpenExportModal}
        sx={{
          py: 1.2,
          borderColor: isDarkMode ? theme.palette.primary.main : "#7E69AB",
          color: isDarkMode ? theme.palette.primary.main : "#7E69AB",
          borderRadius: 2,
          fontWeight: 600,
          "&:hover": {
            borderColor: isDarkMode ? "#DAA520" : "#6E59A5",
            bgcolor: isDarkMode
              ? "rgba(255,215,0,0.05)"
              : "rgba(126,105,171,0.05)",
          },
        }}
      >
        Export Progress Report
      </Button>

      <ExportPDFModal
        open={exportModalOpen}
        onClose={handleCloseExportModal}
        token={localStorage.getItem("token")}
      />
    </Paper>
  );
}
