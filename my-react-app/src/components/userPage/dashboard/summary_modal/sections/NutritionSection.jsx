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
import EggIcon from '@mui/icons-material/Egg';
import GrainIcon from '@mui/icons-material/Grain';
import OilBarrelIcon from '@mui/icons-material/OilBarrel';
import { getThemeColors } from '../utils/constants';

const NutritionSection = ({ nutritionData }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const themeColors = getThemeColors(isDarkMode);

  // Calculate total macros for percentage
  const totalMacros = nutritionData.averages.protein + nutritionData.averages.carbs + nutritionData.averages.fat;
  const proteinPercentage = Math.round((nutritionData.averages.protein * 4 / (totalMacros * 4)) * 100);
  const carbsPercentage = Math.round((nutritionData.averages.carbs * 4 / (totalMacros * 4)) * 100);
  const fatPercentage = Math.round((nutritionData.averages.fat * 9 / (totalMacros * 4)) * 100);

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
        <Box sx={{ mb: 3, flex: '1 0 auto' }}>
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
                    <EggIcon fontSize="small" sx={{ color: isDarkMode ? themeColors.nutrition.protein.text : 'white' }} />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Protein
                </Typography>
                <Typography variant="h6" fontWeight="bold" color={themeColors.nutrition.protein.text}>
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
                    <GrainIcon fontSize="small" sx={{ color: isDarkMode ? themeColors.nutrition.carbs.text : 'white' }} />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Carbs
                </Typography>
                <Typography variant="h6" fontWeight="bold" color={themeColors.nutrition.carbs.text}>
                  {nutritionData.averages.carbs}g
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {carbsPercentage}% of calories
                </Typography>
              </Box>
            </Grid>
            
            {/* Fat Card */}
            <Grid item xs={4}>
              <Box sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                p: 1.5,
                borderRadius: 2,
                background: themeColors.nutrition.fat.bg
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
                      bgcolor: themeColors.nutrition.fat.chipBg,
                      mb: 0.5
                    }}
                  >
                    <OilBarrelIcon fontSize="small" sx={{ color: isDarkMode ? themeColors.nutrition.fat.text : 'white' }} />
                  </Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Fat
                </Typography>
                <Typography variant="h6" fontWeight="bold" color={themeColors.nutrition.fat.text}>
                  {nutritionData.averages.fat}g
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                  {fatPercentage}% of calories
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {/* Macro distribution bar */}
          <Box sx={{ mt: 2, px: 1 }}>
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
                width: `${fatPercentage}%`,
                bgcolor: themeColors.nutrition.fat.chipBg,
              }} />
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 3, opacity: 0.6 }} />
        
        {/* Water Intake - Using remaining space */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center', 
          p: 2, 
          borderRadius: 3, 
          bgcolor: themeColors.nutrition.water.bg,
          minHeight: 120
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3
          }}>
            <Avatar sx={{ 
              bgcolor: themeColors.nutrition.water.iconBg,
              width: 48, 
              height: 48
            }}>
              <WaterDropIcon sx={{ color: themeColors.nutrition.water.text }} />
            </Avatar>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                Average Daily Water Intake
              </Typography>
              <Typography variant="h5" fontWeight="bold" color={themeColors.nutrition.water.text}>
                {nutritionData.waterIntake} L
              </Typography>
            </Box>
          </Box>
          
          {/* Water progress visualization */}
          <Box sx={{ mt: 2, mx: 'auto', width: '80%', maxWidth: 300 }}>
            <Box sx={{ 
              position: 'relative',
              height: 16,
              borderRadius: 8,
              bgcolor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              overflow: 'hidden'
            }}>
              <Box sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${Math.min((nutritionData.waterIntake / 2.5) * 100, 100)}%`,
                bgcolor: themeColors.nutrition.water.text,
                borderRadius: 8,
                transition: 'width 1s ease-in-out'
              }} />
            </Box>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 0.5,
            }}>
              <Typography variant="caption" color="text.secondary">0 L</Typography>
              <Typography variant="caption" color="text.secondary">Goal: 2.5 L</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default NutritionSection;