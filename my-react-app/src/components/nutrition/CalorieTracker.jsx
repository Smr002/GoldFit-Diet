import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  LinearProgress, 
  Tooltip, 
  IconButton, 
  Fade,
  Zoom,
  Divider,
  useTheme,
  CircularProgress
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WeeklyCalorieChart from './WeeklyCalorieChart';
import { getNutritionLog, getUserIdFromToken } from '@/api';
import { format } from 'date-fns';

const CalorieTracker = ({ calorieTarget, onDaySelect, refreshTrigger }) => {
  const theme = useTheme();
  
  // State for data and loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Animation states
  const [animateProgress, setAnimateProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  
  // Calculate percentage, capped at 100 for the progress bar
  const percentage = Math.min(Math.round((caloriesConsumed / calorieTarget) * 100), 100);
  
  // Calculate remaining calories
  const remaining = calorieTarget - caloriesConsumed;
  
  // Determine color based on percentage
  const getProgressColor = () => {
    if (percentage > 100) return theme.palette.error.main; // Red if over target
    if (percentage > 90) return theme.palette.warning.main;  // Orange if close to target
    return theme.palette.success.main;  // Green if below 90%
  };

  // Handle day selection from chart
  const handleDaySelect = (dayData) => {
    if (dayData) {
      setSelectedDate(dayData.fullDate);
      setCaloriesConsumed(weeklyData[dayData.index]);
      if (onDaySelect) {
        onDaySelect(dayData);
      }
    } else {
      // If no day selected, show today's data
      setSelectedDate(null);
      setCaloriesConsumed(weeklyData[6]);
      if (onDaySelect) {
        onDaySelect(null);
      }
    }
  };

  // Fetch nutrition data
  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get user ID from token
        const userId = getUserIdFromToken(token);
        if (!userId) {
          throw new Error('No user ID found in token');
        }

        // Get today's date
        const today = new Date();
        
        // Generate array of dates for the past week
        const dates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(today.getDate() - (6 - i));
          return date;
        });

        // Fetch data for each day
        const nutritionPromises = dates.map(date => 
          getNutritionLog(token, userId, date)
        );

        const results = await Promise.all(nutritionPromises);
        
        console.log('Raw API results:', results); // Debug log
        
        // Extract calorie data from results
        const newWeeklyData = results.map(result => {
          if (!result) return 0;
          // If result is an array, sum up all entries for that day
          if (Array.isArray(result)) {
            const total = result.reduce((sum, entry) => sum + (entry?.totalCalories || 0), 0);
            return Number(total.toFixed(2));
          }
          // If result is a single object
          return Number((result?.totalCalories || 0).toFixed(2));
        });

        console.log('Processed weekly data:', newWeeklyData); // Debug log
        setWeeklyData(newWeeklyData);
        setCaloriesConsumed(newWeeklyData[6]); // Today's calories (last in array)
      } catch (err) {
        console.error('Error fetching nutrition data:', err);
        setError(err.message || 'Failed to load nutrition data');
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, [refreshTrigger]); // Add refreshTrigger to dependency array

  // Animation effect for progress bar
  useEffect(() => {
    if (!loading) {
      setShowContent(true);
      
      const timer = setTimeout(() => {
        setAnimateProgress(percentage);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [percentage, loading]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Fade in={showContent} timeout={600}>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }
        }}
      >
        {/* Weekly Chart Section */}
        <WeeklyCalorieChart 
          calorieData={weeklyData} 
          calorieTarget={calorieTarget}
          onDaySelect={handleDaySelect}
        />
        
        <Divider sx={{ my: 2 }} />
        
        {/* Today's Calorie Section */}
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
                  alignItems: 'baseline',
                  color: 'text.primary'
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
                {selectedDate ? format(selectedDate, 'MMMM d') : 'Today'}'s Target: {calorieTarget}
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
                    color: theme.palette.mode === 'dark' 
                      ? theme.palette.success.light 
                      : theme.palette.success.main,
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
            value={animateProgress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.12)'
                : '#e0e0e0',
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
              backgroundColor: theme.palette.mode === 'dark' 
                ? theme.palette.grey[300] 
                : theme.palette.grey[800],
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