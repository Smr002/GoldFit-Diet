import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Avatar,
  Chip,
  useTheme,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import { getThemeColors } from '../utils/constants';

const NutritionSection = ({ nutritionData }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Grid item xs={12} md={6}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2.5, 
          borderRadius: 3,
          background: themeColors.paperBg,
          boxShadow: themeColors.paperShadow,
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            mb: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontWeight: 600
          }}
        >
          <Avatar sx={{ 
            bgcolor: themeColors.nutrition.bg,
            width: 36, 
            height: 36
          }}>
            <RestaurantIcon sx={{ color: themeColors.nutrition.primary }} />
          </Avatar>
          Nutrition
        </Typography>
        <Divider sx={{ mb: 2, opacity: 0.6 }} />
        
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Daily Average Macros</Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 1,
              borderRadius: 2,
              background: themeColors.nutrition.protein.bg
            }}>
              <Chip 
                label="Protein" 
                size="small" 
                sx={{ 
                  bgcolor: themeColors.nutrition.protein.chipBg, 
                  color: isDarkMode ? themeColors.nutrition.protein.text : 'white', 
                  mb: 1,
                  fontWeight: 'bold'
                }} 
              />
              <Typography variant="h6" fontWeight="bold" color={themeColors.nutrition.protein.text}>
                {nutritionData.averages.protein}g
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 1,
              borderRadius: 2,
              background: themeColors.nutrition.carbs.bg
            }}>
              <Chip 
                label="Carbs" 
                size="small" 
                sx={{ 
                  bgcolor: themeColors.nutrition.carbs.chipBg, 
                  color: isDarkMode ? themeColors.nutrition.carbs.text : 'white', 
                  mb: 1,
                  fontWeight: 'bold'
                }} 
              />
              <Typography variant="h6" fontWeight="bold" color={themeColors.nutrition.carbs.text}>
                {nutritionData.averages.carbs}g
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 1,
              borderRadius: 2,
              background: themeColors.nutrition.fat.bg
            }}>
              <Chip 
                label="Fat" 
                size="small" 
                sx={{ 
                  bgcolor: themeColors.nutrition.fat.chipBg, 
                  color: isDarkMode ? themeColors.nutrition.fat.text : 'white', 
                  mb: 1,
                  fontWeight: 'bold'
                }} 
              />
              <Typography variant="h6" fontWeight="bold" color={themeColors.nutrition.fat.text}>
                {nutritionData.averages.fat}g
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ mb: 2, opacity: 0.6 }} />
        
        <Box sx={{ 
          textAlign: 'center', 
          p: 2, 
          borderRadius: 3, 
          bgcolor: themeColors.nutrition.water.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1
        }}>
          <Avatar sx={{ 
            bgcolor: themeColors.nutrition.water.iconBg,
            width: 40, 
            height: 40
          }}>
            <WaterDropIcon sx={{ color: themeColors.nutrition.water.text }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Average Daily Water Intake
            </Typography>
            <Typography variant="h5" fontWeight="bold" color={themeColors.nutrition.water.text}>
              {nutritionData.waterIntake} L
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default NutritionSection;