import React from 'react';
import { DialogTitle, Box, Typography, Avatar, IconButton, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CloseIcon from '@mui/icons-material/Close';
import { getThemeColors } from './utils/constants';

const ModalHeader = ({ onClose }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const themeColors = getThemeColors(isDarkMode);
  
  return (
    <DialogTitle 
      sx={{ 
        background: themeColors.modalHeader,
        color: '#fff',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        py: 2.5,
        px: 3
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.2)', 
          width: 40, 
          height: 40,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <TrendingUpIcon />
        </Avatar>
        <Typography variant="h6" component="div" fontWeight="800" sx={{ letterSpacing: 0.5 }}>
          Weekly Progress Summary
        </Typography>
      </Box>
      <IconButton 
        onClick={onClose} 
        sx={{ 
          color: '#fff',
          bgcolor: 'rgba(255,255,255,0.15)',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.25)',
          } 
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

export default ModalHeader;