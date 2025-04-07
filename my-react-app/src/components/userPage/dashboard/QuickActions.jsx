import React from "react";
import { Grid, Button, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion"; // For animations
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import PoolIcon from "@mui/icons-material/Pool";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";

// Styled Button with premium design
const SupremeButton = styled(Button)(({ theme, gradient }) => ({
  height: 100,
  width: "100%",
  flexDirection: "column",
  textTransform: "none",
  borderRadius: "12px",
  background: gradient,
  boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.25)",
    background: gradient, // Maintain gradient on hover
    filter: "brightness(1.1)",
  },
}));

function QuickActions() {
  const actions = [
    {
      label: "Workouts",
      icon: FitnessCenterIcon,
      gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
    },

    {
      label: "Exercises",
      icon: PoolIcon,
      gradient: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
    },
    {
      label: "Log Nutrition",
      icon: RestaurantIcon,
      gradient: "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)",
    },
    {
      label: "Log Sleep",
      icon: NightsStayIcon,
      gradient: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    },
  ];

  return (
    <Grid
      container
      spacing={2.5}
      sx={{ display: { xs: "none", sm: "flex" }, mb: 5 }}
    >
      {actions.map((action, index) => (
        <Grid item xs={6} sm={4} md={3} key={action.label}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <SupremeButton
              variant="contained"
              gradient={action.gradient}
              sx={{ padding: 2 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 1.5,
                  background: "rgba(255, 255, 255, 0.15)",
                  borderRadius: "50%",
                  width: 40,
                  height: 40,
                }}
              >
                <action.icon sx={{ fontSize: 26, color: "#fff" }} />
              </Box>
              <Typography
                variant="body1"
                fontWeight={700}
                sx={{
                  color: "#fff",
                  fontSize: { xs: 14, sm: 16 },
                  letterSpacing: "0.5px",
                  textShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                {action.label}
              </Typography>
            </SupremeButton>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
}

export default QuickActions;
