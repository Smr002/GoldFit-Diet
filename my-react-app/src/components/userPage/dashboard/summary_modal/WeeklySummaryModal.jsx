import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  Grid,
  useTheme,
  CircularProgress,
  Alert,
  useMediaQuery
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
          fats: formatNumber(data.nutrition.averages.fat)
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
      fullScreen={useMediaQuery(theme.breakpoints.down('sm'))} // Full screen on mobile
      disableScrollLock={true}
      PaperComponent={motion.div}
      PaperProps={{
        initial: { y: '100%', opacity: 1 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '100%' },
        transition: { duration: 0.3 },
        sx: {
          borderRadius: { xs: 0, sm: 3 }, // No border radius on mobile
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 40px rgba(255,255,255,0.08)'
            : '0 8px 40px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
          position: { xs: 'fixed', sm: 'relative' },
          margin: 0,
          height: { xs: '100%', sm: 'auto' }, // Full height on mobile
          width: '100%',
          maxHeight: { xs: '100vh', sm: '90vh' },
          overflowY: 'auto'
        }
      }}
    >
      <ModalHeader 
        onClose={onClose} 
        sx={{ 
          position: { xs: 'sticky', sm: 'relative' },
          top: 0,
          backgroundColor: theme.palette.background.paper,
          zIndex: 1200,
          borderBottom: `1px solid ${theme.palette.divider}`
        }} 
      />
      
      <DialogContent 
        sx={{ 
          p: { xs: 0, sm: 3 }, // No padding on mobile
          bgcolor: theme.palette.background.default,
          overflowY: 'auto',
          height: { xs: 'calc(100vh - 56px)', sm: 'auto' }, // Full height minus header
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
              justifyContent: 'center', // Add this to center horizontally
              px: { xs: 2, sm: 3 }, // Add horizontal padding on mobile
              pt: { xs: 2, sm: 0 }, // Add top padding
              pb: { xs: 3, sm: 0 }, // Add bottom padding
              '& .MuiGrid-item': {
                paddingTop: { xs: '16px', sm: '24px' },
                width: '100%',
                // Remove maxWidth for desktop view, keep it only for mobile
                maxWidth: { xs: '100%', sm: '100%' },
                mx: 'auto', // Center items horizontally
              }
            }}
          >
            <Grid item xs={12} md={12}>
              <CalorieSection calorieData={weekData.calories} />
            </Grid>
            <Grid item xs={12} md={12}>
              <WorkoutSection workoutData={weekData.workouts} />
            </Grid>
            <Grid item xs={12} md={12}>
              <NutritionSection nutritionData={weekData.nutrition} />
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WeeklySummaryModal;