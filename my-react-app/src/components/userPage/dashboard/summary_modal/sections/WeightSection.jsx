import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { getThemeColors } from '../utils/constants';

const WeightSection = ({ progressData }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const themeColors = getThemeColors(isDarkMode);

  return (
    <Grid item xs={12}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2.5, 
          borderRadius: 3,
          background: themeColors.paperBg,
          boxShadow: themeColors.paperShadow,
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
            bgcolor: themeColors.weight.bg,
            width: 36, 
            height: 36
          }}>
            <MonitorHeartIcon sx={{ color: themeColors.weight.primary }} />
          </Avatar>
          Weight Progress
        </Typography>
        <Divider sx={{ mb: 2, opacity: 0.6 }} />
        
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 2,
              borderRadius: 3,
              bgcolor: themeColors.weight.statBg
            }}>
              <Typography variant="body2" color="text.secondary" mb={0.5}>Starting Weight</Typography>
              <Typography variant="h5" fontWeight="bold" color={themeColors.weight.primary}>
                {progressData.startWeight} kg
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 2,
              borderRadius: 3,
              bgcolor: themeColors.weight.statBg
            }}>
              <Typography variant="body2" color="text.secondary" mb={0.5}>Current Weight</Typography>
              <Typography variant="h5" fontWeight="bold" color={themeColors.weight.primary}>
                {progressData.currentWeight} kg
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ 
              textAlign: 'center',
              p: 2,
              borderRadius: 3,
              bgcolor: progressData.weightChange < 0 
                ? themeColors.weight.decrease.bg
                : themeColors.weight.increase.bg
            }}>
              <Typography variant="body2" color="text.secondary" mb={0.5}>Weekly Change</Typography>
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                color={progressData.weightChange < 0 
                  ? themeColors.weight.decrease.text
                  : themeColors.weight.increase.text
                }
              >
                {progressData.weightChange > 0 ? '+' : ''}
                {progressData.weightChange} kg
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default WeightSection;