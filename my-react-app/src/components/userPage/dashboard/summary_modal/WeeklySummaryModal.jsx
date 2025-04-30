import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  Grid,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import { motion } from 'framer-motion';
import { getWeeklySummary } from '../../../../api';
import { formatNumber } from './utils/formatNumbers';

// Custom hook
import useScrollLock from './utils/useScrollLock';

// Components
import ModalHeader from './ModalHeader';
import CalorieSection from './sections/CalorieSection';
import WorkoutSection from './sections/WorkoutSection';
import NutritionSection from './sections/NutritionSection';

// Utilities
import { defaultSummaryData } from './utils/constants';

const WeeklySummaryModal = ({ open, onClose, weekStart }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weekData, setWeekData] = useState(defaultSummaryData);
  
  useScrollLock(open);

  const formatWeekData = (data) => {
    // Format calories array before mapping
    const formattedDailyCalories = data.calories.daily.map(cal => {
      const value = Number(cal);
      // Return rounded whole number for calories
      return isNaN(value) ? 0 : Math.round(value);
    });

    return {
      calories: {
        daily: formattedDailyCalories,
        goal: Math.round(Number(data.calories.goal)),
        average: Math.round(Number(data.calories.average))
      },
      // ...rest of the formatting remains the same
      workouts: {
        completed: Number(data.workouts.completed),
        duration: formatNumber(data.workouts.duration),
        caloriesBurned: formatNumber(data.workouts.caloriesBurned),
        types: data.workouts.types
      },
      nutrition: {
        averages: {
          protein: formatNumber(data.nutrition.averages.protein),
          carbs: formatNumber(data.nutrition.averages.carbs),
          fat: formatNumber(data.nutrition.averages.fat)
        },
        waterIntake: formatNumber(data.nutrition.waterIntake)
      }
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!open || !weekStart) return;

      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token'); // Adjust based on where you store the token
        if (!token) throw new Error('No authentication token found');
        
        const data = await getWeeklySummary(token, weekStart);
        setWeekData(formatWeekData(data));
      } catch (err) {
        setError(err.message);
        setWeekData(defaultSummaryData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, weekStart]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      disableScrollLock={true}
      PaperComponent={motion.div}
      PaperProps={{
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.3 },
        sx: {
          borderRadius: { xs: '16px 16px 0 0', sm: 3 }, // Rounded top corners on mobile
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 40px rgba(255,255,255,0.08)'
            : '0 8px 40px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
          position: 'fixed',
          margin: 0,
          bottom: { xs: 0, sm: 'auto' }, // Stick to bottom on mobile
          left: { xs: 0, sm: 'auto' },
          right: { xs: 0, sm: 'auto' },
          width: { xs: '100%', sm: 'auto' },
          maxHeight: { xs: '90vh', sm: '90vh' }, // Control max height
          overflowY: 'auto'
        }
      }}
    >
      <ModalHeader onClose={onClose} />
      
      <DialogContent 
        sx={{ 
          p: { xs: 2, sm: 3 }, // Smaller padding on mobile
          bgcolor: theme.palette.background.default,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
        }}
      >
        {loading ? (
          <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
            <CircularProgress />
          </Grid>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3 }} // Smaller gaps on mobile
            sx={{ 
              width: '100%',
              margin: 0,
              '& .MuiGrid-item': {
                paddingTop: { xs: '16px', sm: '24px' },
                width: '100%'
              }
            }}
          >
            <CalorieSection calorieData={weekData.calories} />
            <WorkoutSection workoutData={weekData.workouts} />
            <NutritionSection nutritionData={weekData.nutrition} />
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WeeklySummaryModal;