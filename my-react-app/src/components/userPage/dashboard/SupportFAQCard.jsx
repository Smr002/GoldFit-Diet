import React from "react";
import { Box, Typography, Paper, Link, useTheme } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

function SupportFAQCard() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Paper
      sx={{
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        boxShadow: isDarkMode 
          ? "0px 4px 20px rgba(0, 0, 0, 0.3)" 
          : "0px 4px 20px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode 
            ? "linear-gradient(135deg, #4A3B7A 0%, #6F5AAD 100%)" 
            : "linear-gradient(135deg, #7E69AB 0%, #9B87F5 100%)",
          opacity: 0.85,
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          filter: isDarkMode ? "brightness(0.7)" : "none",
        }}
      />
      <Box
        sx={{
          px: 4,
          pt: 5,
          pb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{ color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}
        >
          Need Help?
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            mb: 3.5,
            color: "rgba(255, 255, 255, 0.9)",
            maxWidth: 300,
            mx: "auto",
            textShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Check out our guides or contact support for assistance with your
          fitness journey.
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Link
            href="#"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.9)",
              color: isDarkMode ? "#6F5AAD" : "#7E69AB",
              fontWeight: 600,
              py: 1.2,
              px: 3,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              transition: "all 0.2s",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              "&:hover": {
                bgcolor: "white",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
              },
            }}
          >
            <HelpOutlineIcon fontSize="small" />
            FAQs
          </Link>
          <Link
            href="#"
            sx={{
              bgcolor: "rgba(0,0,0,0.2)",
              color: "white",
              fontWeight: 600,
              py: 1.2,
              px: 3,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.3)",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.3)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <SupportAgentIcon fontSize="small" />
            Support
          </Link>
        </Box>
      </Box>
    </Paper>
  );
}

export default SupportFAQCard;
