import React from 'react';
import { 
  Box, 
  Paper, 
  Skeleton, 
  Grid, 
  Divider,
  Stack
} from '@mui/material';

// Skeleton for Calorie Tracker
export const CalorieTrackerSkeleton = () => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: 'white',
      mb: 4
    }}
  >
    {/* Weekly Chart Skeleton */}
    <Box sx={{ height: 160, mb: 2, display: 'flex', alignItems: 'flex-end' }}>
      {[...Array(7)].map((_, i) => (
        <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Skeleton variant="rectangular" width="60%" height={40 + Math.random() * 100} sx={{ borderRadius: '4px 4px 0 0', mb: 1 }} />
          <Skeleton variant="text" width={20} height={14} />
          <Skeleton variant="text" width={30} height={14} />
        </Box>
      ))}
    </Box>

    <Divider sx={{ my: 2 }} />
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Box>
        <Skeleton variant="text" width={120} height={50} />
        <Skeleton variant="text" width={180} height={20} />
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Skeleton variant="text" width={60} height={25} />
        <Skeleton variant="text" width={80} height={20} />
      </Box>
    </Box>
    
    <Skeleton variant="rectangular" height={10} sx={{ borderRadius: 5, mb: 1 }} />
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
      <Skeleton variant="text" width={20} height={14} />
      <Skeleton variant="text" width={30} height={14} />
      <Skeleton variant="text" width={40} height={14} />
    </Box>
  </Paper>
);

// Skeleton for Macronutrient Breakdown
export const MacronutrientBreakdownSkeleton = () => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: 'white',
      mb: 4
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Skeleton variant="text" width={180} height={32} />
      <Skeleton variant="circular" width={24} height={24} />
    </Box>
    
    <Divider sx={{ mb: 3 }} />
    
    <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
      {/* Protein */}
      <Box sx={{ textAlign: 'center', width: '30%' }}>
        <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto' }} />
        <Skeleton variant="text" width="60%" height={18} sx={{ mx: 'auto' }} />
      </Box>
      
      {/* Carbs */}
      <Box sx={{ textAlign: 'center', width: '30%' }}>
        <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto' }} />
        <Skeleton variant="text" width="60%" height={18} sx={{ mx: 'auto' }} />
      </Box>
      
      {/* Fat */}
      <Box sx={{ textAlign: 'center', width: '30%' }}>
        <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', mb: 1 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto' }} />
        <Skeleton variant="text" width="60%" height={18} sx={{ mx: 'auto' }} />
      </Box>
    </Box>
    
    <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1, mb: 2 }} />
  </Paper>
);

// Skeleton for Meal Logger
export const MealLoggerSkeleton = () => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: 'white',
      height: '100%'
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Skeleton variant="text" width={120} height={32} />
      <Skeleton variant="circular" width={24} height={24} />
    </Box>
    
    <Divider sx={{ mb: 3 }} />
    
    <Stack spacing={2} sx={{ mb: 3 }}>
      {[...Array(4)].map((_, i) => (
        <Skeleton 
          key={i} 
          variant="rectangular" 
          height={80 + (i === 0 ? 40 : 0)} // First one taller to simulate expanded
          sx={{ 
            borderRadius: 1,
            borderLeft: '4px solid',
            borderColor: i === 0 ? '#ff9800' : 
                        i === 1 ? '#2196f3' : 
                        i === 2 ? '#9c27b0' : 
                        '#4caf50'
          }} 
        />
      ))}
    </Stack>
    
    <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
  </Paper>
);

// Skeleton for Water Tracker
export const WaterTrackerSkeleton = () => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: 'white',
      height: '100%'
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Skeleton variant="text" width={140} height={32} />
      <Skeleton variant="circular" width={24} height={24} />
    </Box>
    
    <Divider sx={{ mb: 3 }} />
    
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      <Skeleton 
        variant="circular" 
        width={180} 
        height={180} 
        sx={{ 
          mx: 'auto', 
          mb: 2,
          background: 'linear-gradient(transparent 60%, #E3F2FD 60%)',
        }} 
      />
      <Skeleton variant="text" width={160} height={24} sx={{ mx: 'auto' }} />
      <Skeleton variant="text" width={140} height={18} sx={{ mx: 'auto', mb: 2 }} />
    </Box>
    
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3 }}>
      <Skeleton variant="rectangular" width={60} height={40} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={60} height={40} sx={{ borderRadius: 1 }} />
      <Skeleton variant="rectangular" width={60} height={40} sx={{ borderRadius: 1 }} />
    </Box>
    
    <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
  </Paper>
);

// Skeleton for Sleep Tracker
export const SleepTrackerSkeleton = () => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: 'white'
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Skeleton variant="text" width={120} height={32} />
      <Skeleton variant="circular" width={24} height={24} />
    </Box>
    
    <Divider sx={{ mb: 3 }} />
    
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      <Skeleton 
        variant="circular" 
        width={180} 
        height={180} 
        sx={{ mx: 'auto', mb: 2 }} 
      />
      <Skeleton variant="text" width={220} height={24} sx={{ mx: 'auto', mb: 1 }} />
    </Box>
    
    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 20, mb: 3 }} />
    
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 20 }} />
    </Box>
    
    <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 1 }} />
  </Paper>
);

// Main skeleton component that combines all skeletons
export const NutritionPageSkeleton = () => (
  <Box sx={{ py: 4 }}>
    <Skeleton variant="text" width={260} height={48} sx={{ mb: 4 }} />
    
    <CalorieTrackerSkeleton />
    <MacronutrientBreakdownSkeleton />
    
    <Grid container spacing={3} sx={{ mb: 5 }}>
      <Grid item xs={12} md={6}>
        <MealLoggerSkeleton />
      </Grid>
      <Grid item xs={12} md={6}>
        <WaterTrackerSkeleton />
      </Grid>
    </Grid>
    
    <Box sx={{ my: 5 }}>
      <SleepTrackerSkeleton />
    </Box>
  </Box>
);

export default NutritionPageSkeleton;