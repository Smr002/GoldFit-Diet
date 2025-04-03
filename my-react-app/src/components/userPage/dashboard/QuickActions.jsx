import React from "react";
import { Grid, Button, Typography, Box } from "@mui/material";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import NightsStayIcon from "@mui/icons-material/NightsStay";

function QuickActions() {
  const actions = [
    {
      label: "Start Workout",
      icon: FitnessCenterIcon,
      color: "primary",
    },
    {
      label: "Log Nutrition",
      icon: RestaurantIcon,
      color: "secondary",
    },
    {
      label: "Log Sleep",
      icon: NightsStayIcon,
      color: "info",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Grid item xs={12} sm={4} key={action.label}>
            <Button
              fullWidth
              variant="contained"
              color={action.color}
              sx={{
                py: 2,
                height: 100,
                borderRadius: 3,
                boxShadow: 2,
                textTransform: "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  boxShadow: 4,
                },
              }}
            >
              <Icon sx={{ fontSize: 28 }} />
              <Typography variant="body2" fontWeight={600}>
                {action.label}
              </Typography>
            </Button>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default QuickActions;
