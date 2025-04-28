/**
 * Get theme-specific colors
 */
export const getThemeColors = (isDarkMode) => ({
  colors: isDarkMode 
    ? ['#FFD700', '#DAA520', '#BB86FC', '#CF6679', '#03DAC6', '#82ca9d']
    : ['#2196F3', '#9c27b0', '#ff9800', '#f44336', '#4caf50', '#e91e63'],
  
  calorie: {
    primary: isDarkMode ? '#FFD700' : '#f44336',
    bg: isDarkMode ? 'rgba(255, 215, 0, 0.15)' : 'rgba(244, 67, 54, 0.1)',
    goal: {
      bg: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(33, 150, 243, 0.08)',
      text: isDarkMode ? '#FFD700' : '#2196F3'
    },
    average: {
      bg: isDarkMode ? 'rgba(218, 165, 32, 0.1)' : 'rgba(156, 39, 176, 0.08)',
      text: isDarkMode ? '#DAA520' : '#9c27b0'
    },
    total: {
      bg: isDarkMode ? 'rgba(207, 102, 121, 0.1)' : 'rgba(255, 152, 0, 0.08)',
      text: isDarkMode ? '#CF6679' : '#ff9800'
    },
  },
  
  workout: {
    primary: isDarkMode ? '#03DAC6' : '#4caf50',
    bg: isDarkMode ? 'rgba(3, 218, 198, 0.15)' : 'rgba(76, 175, 80, 0.1)',
    stat: {
      bg: isDarkMode ? 'rgba(3, 218, 198, 0.1)' : 'rgba(76, 175, 80, 0.08)'
    }
  },
  
  nutrition: {
    primary: isDarkMode ? '#DAA520' : '#ff9800',
    bg: isDarkMode ? 'rgba(218, 165, 32, 0.15)' : 'rgba(255, 152, 0, 0.1)',
    protein: {
      bg: isDarkMode ? 'rgba(187, 134, 252, 0.1)' : 'rgba(92, 107, 192, 0.08)',
      chipBg: isDarkMode ? 'rgba(187, 134, 252, 0.2)' : '#5c6bc0',
      text: isDarkMode ? '#BB86FC' : '#5c6bc0'
    },
    carbs: {
      bg: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 183, 77, 0.08)',
      chipBg: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : '#ffb74d',
      text: isDarkMode ? '#FFD700' : '#ffb74d'
    },
    fat: {
      bg: isDarkMode ? 'rgba(3, 218, 198, 0.1)' : 'rgba(77, 182, 172, 0.08)',
      chipBg: isDarkMode ? 'rgba(3, 218, 198, 0.2)' : '#4db6ac',
      text: isDarkMode ? '#03DAC6' : '#4db6ac'
    },
    water: {
      bg: isDarkMode ? 'rgba(3, 218, 198, 0.05)' : 'rgba(3, 169, 244, 0.05)',
      iconBg: isDarkMode ? 'rgba(3, 218, 198, 0.15)' : 'rgba(3, 169, 244, 0.15)',
      text: isDarkMode ? '#03DAC6' : '#03a9f4'
    }
  },
  
  weight: {
    primary: isDarkMode ? '#BB86FC' : '#9c27b0',
    bg: isDarkMode ? 'rgba(187, 134, 252, 0.15)' : 'rgba(156, 39, 176, 0.1)',
    statBg: isDarkMode ? 'rgba(187, 134, 252, 0.05)' : 'rgba(156, 39, 176, 0.05)',
    decrease: {
      bg: isDarkMode ? 'rgba(3, 218, 198, 0.05)' : 'rgba(76, 175, 80, 0.05)',
      text: isDarkMode ? '#03DAC6' : '#4caf50'
    },
    increase: {
      bg: isDarkMode ? 'rgba(207, 102, 121, 0.05)' : 'rgba(244, 67, 54, 0.05)',
      text: isDarkMode ? '#CF6679' : '#f44336'
    }
  },
  
  paperBg: isDarkMode
    ? 'linear-gradient(145deg, #1e1e1e, #282828)'
    : 'linear-gradient(145deg, #ffffff, #f5f7ff)',
  
  paperShadow: isDarkMode 
    ? '0px 4px 20px rgba(0, 0, 0, 0.3)' 
    : '0px 4px 20px rgba(0, 0, 0, 0.08)',
    
  modalHeader: isDarkMode 
    ? 'linear-gradient(45deg, #FFD700 30%, #DAA520 90%)' 
    : 'linear-gradient(45deg, #2196F3 30%, #9c27b0 90%)'
});

/**
 * Sample data structure for the summary when no data is provided
 */
export const defaultSummaryData = {
  calories: {
    daily: [2100, 1950, 2050, 1800, 2200, 1950, 2100],
    goal: 2000,
    average: 2021
  },
  workouts: {
    completed: 5,
    duration: 225,
    caloriesBurned: 1250,
    types: [
      { name: 'Strength', value: 3 },
      { name: 'Cardio', value: 2 },
      { name: 'Yoga', value: 1 }
    ]
  },
  nutrition: {
    averages: {
      protein: 120,
      carbs: 210,
      fat: 65
    },
    waterIntake: 1.8
  },
  progress: {
    startWeight: 78.5,
    currentWeight: 77.2,
    weightChange: -1.3
  }
};

/**
 * Days of the week for chart display
 */
export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];