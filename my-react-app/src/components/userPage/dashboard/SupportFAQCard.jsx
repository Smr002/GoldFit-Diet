import React from "react";
import { Box, Typography, Paper, Link, Button, useTheme } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

function SupportFAQCard() {
  const theme = useTheme();

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        borderRadius: 3,
        p: 4,
        textAlign: "center",
        background: "rgba(25, 118, 210, 0.1)",
        backdropFilter: "blur(8px)",
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: `0 8px 16px rgba(25, 118, 210, 0.2)`,
        marginBottom:12,
      }}
    >
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          width: 64,
          height: 64,
          borderRadius: "50%",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: 3,
        }}
      >
        <HelpOutlineIcon fontSize="large" />
      </Box>

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Need Help?
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, maxWidth: 260 }}
      >
        We’re here to support your fitness journey. Explore FAQs or get in touch
        with our support team.
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          size="small"
          sx={{ textTransform: "none" }}
          href="#"
        >
          FAQs
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ textTransform: "none" }}
          href="#"
        >
          Contact Support
        </Button>
      </Box>
    </Paper>
  );
}

export default SupportFAQCard;
