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
        background: isDarkMode 
          ? 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)'
          : 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        py: 2.5,
        px: 3,
        boxShadow: isDarkMode
          ? '0 4px 20px rgba(0, 0, 0, 0.4)'
          : '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          sx={{ 
            width: 42,
            height: 42,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: `0 4px 12px ${isDarkMode ? 'rgba(187, 134, 252, 0.3)' : 'rgba(155, 135, 245, 0.3)'}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 16px ${isDarkMode ? 'rgba(187, 134, 252, 0.4)' : 'rgba(155, 135, 245, 0.4)'}`,
            }
          }}
        >
          <TrendingUpIcon 
            sx={{ 
              color: '#fff',
              fontSize: 24,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} 
          />
        </Avatar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            letterSpacing: '0.5px',
            // Removed the '&::after' pseudo-element that created the underline
          }}
        >
          Weekly Progress Summary
        </Typography>
      </Box>
      <IconButton
        onClick={onClose}
        sx={{
          width: 35,
          height: 35,
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette.text.secondary,
          borderRadius: '50%',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: 'transparent',
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            color: '#fff',
            borderColor: 'transparent',
            backgroundColor: theme.palette.error.main,
            '& .closeIcon': {
              transform: 'rotate(180deg)',
            }
          }
        }}
      >
        <Typography 
          className="closeIcon"
          sx={{ 
            fontSize: '28px', 
            lineHeight: 1,
            fontWeight: 300,
            transition: 'transform 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ×
        </Typography>
      </IconButton>
    </DialogTitle>
  );
};

export default ModalHeader;