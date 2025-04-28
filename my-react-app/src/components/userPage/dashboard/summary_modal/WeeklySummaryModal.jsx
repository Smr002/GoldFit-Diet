import React from 'react';
import { 
  Dialog,
  DialogContent,
  Grid,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';

// Custom hook
import useScrollLock from './utils/useScrollLock';

// Components
import ModalHeader from './ModalHeader';
import CalorieSection from './sections/CalorieSection';
import WorkoutSection from './sections/WorkoutSection';
import NutritionSection from './sections/NutritionSection';
import WeightSection from './sections/WeightSection';

// Utilities
import { defaultSummaryData } from './utils/constants';

const WeeklySummaryModal = ({ open, onClose, data }) => {
  const theme = useTheme();
  
  // Prevent background scrolling when modal is open
  useScrollLock(open);
  
  // Use provided data or fallback to default
  const weekData = data || defaultSummaryData;
  
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
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 40px rgba(255,255,255,0.08)'
            : '0 8px 40px rgba(0,0,0,0.12)',
          overflow: 'hidden',
          bgcolor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff'
        }
      }}
    >
      <ModalHeader onClose={onClose} />
      
      <DialogContent sx={{ p: 3, bgcolor: theme.palette.background.default }}>
        <Grid container spacing={3}>
          {/* Calories Section */}
          <CalorieSection calorieData={weekData.calories} />
          
          {/* Workouts Section */}
          <WorkoutSection workoutData={weekData.workouts} />
          
          {/* Nutrition Section */}
          <NutritionSection nutritionData={weekData.nutrition} />
          
          {/* Weight Progress Section */}
          <WeightSection progressData={weekData.progress} />
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklySummaryModal;