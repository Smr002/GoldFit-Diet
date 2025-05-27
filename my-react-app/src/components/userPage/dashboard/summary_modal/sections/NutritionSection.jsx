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
import KebabDiningIcon from '@mui/icons-material/KebabDining'; // for protein
import LocalPizzaIcon from '@mui/icons-material/LocalPizza'; // for carbs
import IcecreamIcon from '@mui/icons-material/Icecream'; // for fats
import GrainIcon from '@mui/icons-material/Grain';
import OilBarrelIcon from '@mui/icons-material/OilBarrel';
import { getThemeColors } from '../utils/constants';

const calculateMacroPercentages = (protein, carbs, fats) => {
  // Convert macros to calories
  const proteinCals = protein * 4;
  const carbsCals = carbs * 4;
  const fatsCals = fats * 9;
  
  // Calculate total calories
  const totalCals = proteinCals + carbsCals + fatsCals;
  
  // Prevent division by zero
  if (totalCals === 0) return { protein: 0, carbs: 0, fats: 0 };
  
  return {
    protein: Math.round((proteinCals / totalCals) * 100),
    carbs: Math.round((carbsCals / totalCals) * 100),
    fats: Math.round((fatsCals / totalCals) * 100)
  };
};

const NutritionSection = ({ nutritionData }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const themeColors = getThemeColors(isDarkMode);

  // Calculate percentages using the new function
  const { protein: proteinPercentage, carbs: carbsPercentage, fats: fatsPercentage } = calculateMacroPercentages(
    nutritionData.averages.protein,
    nutritionData.averages.carbs,
    nutritionData.averages.fats
  );

  return (
    <Grid item xs={12} sm={6} md={6}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2.5, 
          borderRadius: 3,
          background: themeColors.paperBg,
          boxShadow: themeColors.paperShadow,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 2 }}>
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
          <Divider sx={{ opacity: 0.6 }} />
        </Box>
        
        {/* Macros Section */}
        <Box sx={{ flex: '1 0 auto' }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              mb: 1, 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5 
            }}
          >
            Daily Average Macros
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 1 }}>
            {/* Protein Card */}
            <Grid item xs={4}>
              <Box sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                p: 1.5,
                borderRadius: 2,
                background: themeColors.nutrition.protein.bg
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mb: 1 
                }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: themeColors.nutrition.protein.chipBg,
                      mb: 0.5
                    }}
                  >
                    <KebabDiningIcon fontSize="small" sx={{ color: isDarkMode ? themeColors.nutrition.protein.text : 'white' }} />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Protein
                </Typography>
                <Typography variant="h6" fontWeight="bold" color={themeColors.nutrition.protein.text}
                sx={{
                  fontSize: {
                    xs: '1rem',     
                    sm: '1.25rem'   
                  }
                }}>
                  {nutritionData.averages.protein}g
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {proteinPercentage}% of calories
                </Typography>
              </Box>
            </Grid>
            
            {/* Carbs Card */}
            <Grid item xs={4}>
              <Box sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                p: 1.5,
                borderRadius: 2,
                background: themeColors.nutrition.carbs.bg
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mb: 1 
                }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: themeColors.nutrition.carbs.chipBg,
                      mb: 0.5
                    }}
                  >
                    <LocalPizzaIcon fontSize="small" sx={{ color: isDarkMode ? themeColors.nutrition.carbs.text : 'white' }} />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Carbs
                </Typography>
                <Typography variant="h6" fontWeight="bold" color={themeColors.nutrition.carbs.text}
                sx={{
                  fontSize: {
                    xs: '1rem',     
                    sm: '1.25rem'   
                  }
                }}>
                  {nutritionData.averages.carbs}g
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {carbsPercentage}% of calories
                </Typography>
              </Box>
            </Grid>
            
            {/* Fats Card */}
            <Grid item xs={4}>
              <Box sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                p: 1.5,
                borderRadius: 2,
                background: themeColors.nutrition.fats.bg
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  mb: 1 
                }}>
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: themeColors.nutrition.fats.chipBg,
                      mb: 0.5
                    }}
                  >
                    <IcecreamIcon fontSize="small" sx={{ color: isDarkMode ? themeColors.nutrition.fats.text : 'white' }} />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Fats
                </Typography>
                <Typography variant="h6" fontWeight="bold" color={themeColors.nutrition.fats.text}
                sx={{
                  fontSize: {
                    xs: '1rem',     
                    sm: '1.25rem'   
                  }
                }}>
                  {nutritionData.averages.fats}g
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {fatsPercentage}% of calories
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {/* Macro distribution bar */}
          <Box sx={{ mt: 2, px: 1, mb: 1}}> {/* Added mb: 1 to reduce space */}
            <Box sx={{ 
              display: 'flex',
              height: 8,
              borderRadius: 4,
              overflow: 'hidden',
              width: '100%',
            }}>
              <Box sx={{
                width: `${proteinPercentage}%`,
                bgcolor: themeColors.nutrition.protein.chipBg,
              }} />
              <Box sx={{
                width: `${carbsPercentage}%`,
                bgcolor: themeColors.nutrition.carbs.chipBg,
              }} />
              <Box sx={{
                width: `${fatsPercentage}%`,
                bgcolor: themeColors.nutrition.fats.chipBg,
              }} />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default NutritionSection;