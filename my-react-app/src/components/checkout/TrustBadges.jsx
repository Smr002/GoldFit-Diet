import React from "react";
import { Paper, Typography, Grid } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ShieldIcon from "@mui/icons-material/Shield";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const TrustBadges = ({ isDarkMode }) => {
  const iconStyle = {
    fontSize: 28,
    mb: 1,
    color: isDarkMode ? '#FFD700' : '#6c63ff'
  };

  return (
    <Paper 
      elevation={isDarkMode ? 2 : 1} 
      sx={{ 
        p: 2, 
        borderRadius: 2,
        bgcolor: isDarkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        transition: 'all 0.3s ease'
      }}
    >
      <Grid container spacing={1} justifyContent="space-around">
        <Grid item xs={4} sx={{ textAlign: 'center' }}>
          <LockIcon sx={iconStyle} />
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
              fontWeight: 500
            }}
          >
            Secure Checkout
          </Typography>
        </Grid>
        
        <Grid item xs={4} sx={{ textAlign: 'center' }}>
          <ShieldIcon sx={iconStyle} />
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
              fontWeight: 500
            }}
          >
            Privacy Protected
          </Typography>
        </Grid>
        
        <Grid item xs={4} sx={{ textAlign: 'center' }}>
          <CreditCardIcon sx={iconStyle} />
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit',
              fontWeight: 500
            }}
          >
            Encrypted Payment
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TrustBadges;