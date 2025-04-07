import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  LinearProgress, 
  Tooltip, 
  IconButton, 
  Fade,
  Zoom
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CalorieTracker = ({ caloriesConsumed, calorieTarget }) => {
  // Animation states
  const [animateProgress, setAnimateProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  
  // Calculate percentage, capped at 100 for the progress bar
  const percentage = Math.min(Math.round((caloriesConsumed / calorieTarget) * 100), 100);
  
  // Calculate remaining calories
  const remaining = calorieTarget - caloriesConsumed;
  
  // Determine color based on percentage
  const getProgressColor = () => {
    if (percentage > 100) return '#e53935'; // Red if over target
    if (percentage > 90) return '#ff9800';  // Orange if close to target
    return '#4caf50';  // Green if below 90%
  };

  // Animation effect for progress bar
  useEffect(() => {
    setShowContent(true);
    
    const timer = setTimeout(() => {
      setAnimateProgress(percentage);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <Fade in={showContent} timeout={600}>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'white',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Zoom in={showContent} timeout={800}>
            <Box>
              <Typography 
                variant="h3" 
                component="div" 
                fontWeight="bold" 
                sx={{ 
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'baseline'
                }}
              >
                <Box 
                  component="span" 
                  sx={{
                    display: 'inline-block',
                    animation: 'countUp 1.5s ease-out forwards',
                    '@keyframes countUp': {
                      from: { opacity: 0, transform: 'translateY(20px)' },
                      to: { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                >
                  {caloriesConsumed}
                </Box>
                <Typography 
                  component="span" 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ ml: 1 }}
                >
                  KCAL
                </Typography>
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  animation: 'fadeIn 1s ease-in-out',
                  '@keyframes fadeIn': {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                  }
                }}
              >
                Target: {calorieTarget}
              </Typography>
            </Box>
          </Zoom>
          
          <Zoom in={showContent} timeout={1000}>
            <Box sx={{ textAlign: 'right', display: 'flex', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  mr: 1,
                  animation: 'slideLeft 0.8s ease-out',
                  '@keyframes slideLeft': {
                    from: { opacity: 0, transform: 'translateX(20px)' },
                    to: { opacity: 1, transform: 'translateX(0)' }
                  }
                }}
              >
                <Typography variant="h6" component="div" fontWeight="bold" color={getProgressColor()}>
                  {remaining > 0 ? remaining : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Remaining
                </Typography>
              </Box>
              
              <Tooltip title="Daily calorie target based on your profile and goals">
                <IconButton 
                  size="small" 
                  sx={{
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.05)' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Zoom>
        </Box>
        
        <Box sx={{ position: 'relative', pt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={animateProgress} // Use animated value
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: getProgressColor(),
                transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }
            }}
          />
          
          {/* Target marker */}
          <Box 
            sx={{ 
              position: 'absolute',
              height: 14,
              width: 2,
              backgroundColor: '#212121',
              right: 0,
              top: -1,
              animation: 'fadeIn 1.5s ease-in-out',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 }
              }
            }} 
          />
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mt: 1, 
          px: 0.5,
          fontSize: '0.75rem',
          color: 'text.secondary',
          opacity: 0,
          animation: 'fadeIn 1.5s ease-in-out forwards',
          animationDelay: '0.8s',
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 }
          }
        }}>
          <Typography variant="caption">0</Typography>
          <Typography variant="caption">{percentage}%</Typography>
          <Typography variant="caption">{calorieTarget}</Typography>
        </Box>
      </Paper>
    </Fade>
  );
};

export default CalorieTracker;