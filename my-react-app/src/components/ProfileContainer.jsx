// src/components/profile/ProfileContainer.jsx
import React from "react";
import PropTypes from "prop-types";
import { Container, Box, Typography, Zoom, Paper } from "@mui/material";

export default function ProfileContainer({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2c3e50, #1a1a2e)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, sm: 3 },
      }}
    >
      <Container maxWidth="md">
        <Zoom in timeout={800}>
          <Paper
            elevation={12}
            sx={{
              backgroundColor: "rgba(30, 41, 59, 0.85)",
              backdropFilter: "blur(12px)",
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(90deg, #D4AF37, #FFC857)",
                py: 2,
                px: 4,
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                fontWeight="bold"
                sx={{ 
                  color: "#1a1a2e", 
                  textShadow: "0px 1px 1px rgba(255,255,255,0.2)",
                  letterSpacing: 1
                }}
              >
                User Profile
              </Typography>
            </Box>
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              {children}
            </Box>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}

ProfileContainer.propTypes = {
  children: PropTypes.node.isRequired,
};