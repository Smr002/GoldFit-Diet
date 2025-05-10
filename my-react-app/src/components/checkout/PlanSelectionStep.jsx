import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import StarIcon from '@mui/icons-material/Star';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SpeedIcon from '@mui/icons-material/Speed';
import DiamondIcon from '@mui/icons-material/Diamond';

const PlanSelectionStep = ({ 
  handleNext, 
  setSelectedPlan, 
  setSelectedPeriod, 
  selectedPlan, 
  selectedPeriod, 
  isDarkMode 
}) => {
  const [billingPeriod, setBillingPeriod] = useState(selectedPeriod || 'monthly');
  const [selectedPlanId, setSelectedPlanId] = useState(selectedPlan?.id || 'standard');

  // Define plans that match those in Prices.jsx
  const plans = {
    monthly: [
      {
        id: 'basic',
        title: 'Basic',
        price: 29.99,
        currency: '$',
        period: 'month',
        icon: <FitnessCenterIcon fontSize="large" />,
        description: 'Essential fitness tracking and basic meal plans',
        features: [
          { text: 'Access to gym facilities', included: true },
          { text: '2 group classes per week', included: true },
          { text: 'Basic fitness assessment', included: true },
          { text: 'Online workout library', included: true },
          { text: 'Personal training sessions', included: false },
          { text: 'Nutrition consultation', included: false },
          { text: 'Premium app features', included: false }
        ],
        popular: false,
        color: isDarkMode ? '#DAA520' : '#6C63FF'
      },
      {
        id: 'standard',
        title: 'Standard',
        price: 49.99,
        currency: '$',
        period: 'month',
        icon: <SpeedIcon fontSize="large" />,
        description: 'Advanced fitness tracking with personalized meal plans',
        features: [
          { text: 'Access to gym facilities', included: true },
          { text: 'Unlimited group classes', included: true },
          { text: 'Comprehensive fitness assessment', included: true },
          { text: 'Online workout library', included: true },
          { text: '2 personal training sessions', included: true },
          { text: 'Nutrition consultation', included: false },
          { text: 'Premium app features', included: true }
        ],
        popular: true,
        color: isDarkMode ? '#FFD700' : '#4834d4'
      },
      {
        id: 'premium',
        title: 'Premium',
        price: 79.99,
        currency: '$',
        period: 'month',
        icon: <DiamondIcon fontSize="large" />,
        description: 'Complete fitness coaching with personal trainers',
        features: [
          { text: '24/7 access to gym facilities', included: true },
          { text: 'Unlimited group classes', included: true },
          { text: 'Advanced fitness assessment', included: true },
          { text: 'Online workout library', included: true },
          { text: '4 personal training sessions', included: true },
          { text: 'Monthly nutrition consultation', included: true },
          { text: 'Premium app features', included: true }
        ],
        popular: false,
        color: isDarkMode ? '#E0E0E0' : '#1A237E'
      }
    ],
    annual: [
      {
        id: 'basic',
        title: 'Basic',
        price: 299.99,
        currency: '$',
        period: 'year',
        icon: <FitnessCenterIcon fontSize="large" />,
        description: 'Essential fitness tracking and basic meal plans',
        features: [
          { text: 'Access to gym facilities', included: true },
          { text: '2 group classes per week', included: true },
          { text: 'Basic fitness assessment', included: true },
          { text: 'Online workout library', included: true },
          { text: 'Personal training sessions', included: false },
          { text: 'Nutrition consultation', included: false },
          { text: 'Premium app features', included: false }
        ],
        popular: false,
        color: isDarkMode ? '#DAA520' : '#6C63FF',
        savings: 'Save $60'
      },
      {
        id: 'standard',
        title: 'Standard',
        price: 499.99,
        currency: '$',
        period: 'year',
        icon: <SpeedIcon fontSize="large" />,
        description: 'Advanced fitness tracking with personalized meal plans',
        features: [
          { text: 'Access to gym facilities', included: true },
          { text: 'Unlimited group classes', included: true },
          { text: 'Comprehensive fitness assessment', included: true },
          { text: 'Online workout library', included: true },
          { text: '2 personal training sessions', included: true },
          { text: 'Nutrition consultation', included: false },
          { text: 'Premium app features', included: true }
        ],
        popular: true,
        color: isDarkMode ? '#FFD700' : '#4834d4',
        savings: 'Save $100'
      },
      {
        id: 'premium',
        title: 'Premium',
        price: 799.99,
        currency: '$',
        period: 'year',
        icon: <DiamondIcon fontSize="large" />,
        description: 'Complete fitness coaching with personal trainers',
        features: [
          { text: '24/7 access to gym facilities', included: true },
          { text: 'Unlimited group classes', included: true },
          { text: 'Advanced fitness assessment', included: true },
          { text: 'Online workout library', included: true },
          { text: '4 personal training sessions', included: true },
          { text: 'Monthly nutrition consultation', included: true },
          { text: 'Premium app features', included: true }
        ],
        popular: false,
        color: isDarkMode ? '#E0E0E0' : '#1A237E',
        savings: 'Save $160'
      }
    ]
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlanId(planId);
    const plan = plans[billingPeriod].find(p => p.id === planId);
    setSelectedPlan({
      id: plan.id,
      title: plan.title,
      price: plan.price,
      period: billingPeriod,
      features: plan.features.filter(f => f.included).map(f => f.text)
    });
  };

  const handlePeriodChange = (event, newPeriod) => {
    setBillingPeriod(newPeriod);
    setSelectedPeriod(newPeriod);
    
    // Update plan price based on new period
    const plan = plans[newPeriod].find(p => p.id === selectedPlanId);
    if (plan) {
      setSelectedPlan({
        id: plan.id,
        title: plan.title,
        price: plan.price,
        period: newPeriod,
        features: plan.features.filter(f => f.included).map(f => f.text)
      });
    }
  };

  const handleContinue = () => {
    if (selectedPlanId) {
      const plan = plans[billingPeriod].find(p => p.id === selectedPlanId);
      setSelectedPlan({
        id: plan.id,
        title: plan.title,
        price: plan.price,
        period: billingPeriod,
        features: plan.features.filter(f => f.included).map(f => f.text)
      });
      handleNext();
    }
  };

  return (
    <Paper 
      elevation={isDarkMode ? 2 : 1} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        bgcolor: isDarkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        transition: 'all 0.3s ease'
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{ 
          color: isDarkMode ? '#FFD700' : '#6c63ff',
          fontWeight: 600,
          mb: 3,
          textAlign: 'center'
        }}
      >
        Choose Your Membership Plan
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
          textAlign: 'center',
          mb: 4,
          maxWidth: '800px',
          mx: 'auto'
        }}
      >
        Choose the perfect membership plan to achieve your fitness goals. 
        Sign up today and start your journey to a healthier lifestyle.
      </Typography>

      <Box sx={{ width: '100%', mb: 4 }}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            width: 'fit-content',
            mx: 'auto',
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${isDarkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(108, 99, 255, 0.3)'}`,
            backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.9)' : 'rgba(250, 250, 255, 0.9)'
          }}
        >
          <Button
            variant={billingPeriod === 'monthly' ? 'contained' : 'text'}
            onClick={() => handlePeriodChange(null, 'monthly')}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 0,
              fontWeight: 600,
              backgroundColor: billingPeriod === 'monthly' 
                ? (isDarkMode ? '#FFD700' : '#6c63ff') 
                : 'transparent',
              color: billingPeriod === 'monthly'
                ? (isDarkMode ? '#000' : '#fff')
                : (isDarkMode ? '#FFD700' : 'rgba(0, 0, 0, 0.7)'),
              '&:hover': {
                backgroundColor: billingPeriod === 'monthly'
                  ? (isDarkMode ? '#DAA520' : '#4834d4')
                  : (isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(108, 99, 255, 0.1)')
              }
            }}
          >
            Monthly
          </Button>
          <Button
            variant={billingPeriod === 'annual' ? 'contained' : 'text'}
            onClick={() => handlePeriodChange(null, 'annual')}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 0,
              fontWeight: 600,
              backgroundColor: billingPeriod === 'annual' 
                ? (isDarkMode ? '#FFD700' : '#6c63ff') 
                : 'transparent',
              color: billingPeriod === 'annual'
                ? (isDarkMode ? '#000' : '#fff')
                : (isDarkMode ? '#FFD700' : 'rgba(0, 0, 0, 0.7)'),
              '&:hover': {
                backgroundColor: billingPeriod === 'annual'
                  ? (isDarkMode ? '#DAA520' : '#4834d4')
                  : (isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(108, 99, 255, 0.1)')
              }
            }}
          >
            Annual
          </Button>
        </Paper>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {plans[billingPeriod].map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card 
              raised={selectedPlanId === plan.id}
              onClick={() => handlePlanSelect(plan.id)}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                borderRadius: 2,
                borderColor: selectedPlanId === plan.id ? plan.color : 'transparent',
                borderWidth: 2,
                borderStyle: 'solid',
                backgroundColor: isDarkMode 
                  ? selectedPlanId === plan.id ? 'rgba(60, 60, 60, 0.95)' : 'rgba(50, 50, 50, 0.95)'
                  : selectedPlanId === plan.id ? 'rgba(250, 250, 255, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              {plan.popular && (
                <Chip
                  icon={<StarIcon />}
                  label="Most Popular"
                  color="secondary"
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: isDarkMode ? '#FFD700' : '#6c63ff',
                    color: isDarkMode ? 'black' : 'white',
                    fontWeight: 'bold'
                  }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 2  
                }}>
                  <Box sx={{ 
                    color: plan.color,
                    mb: 1
                  }}>
                    {plan.icon}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="div" 
                    sx={{ 
                      fontWeight: 600,
                      color: isDarkMode ? plan.color : undefined
                    }}
                  >
                    {plan.title}
                  </Typography>
                </Box>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 3, 
                    textAlign: 'center',
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined
                  }}
                >
                  {plan.description}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'baseline',
                  mb: 1
                }}>
                  <Typography 
                    component="span" 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 700,
                      color: isDarkMode ? plan.color : undefined
                    }}
                  >
                    {plan.currency}{plan.price}
                  </Typography>
                  <Typography 
                    component="span" 
                    variant="h6" 
                    sx={{ 
                      ml: 1,
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                    }}
                  >
                    /{plan.period}
                  </Typography>
                </Box>
                
                {plan.savings && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      textAlign: 'center', 
                      mb: 2,
                      color: isDarkMode ? '#AAFF00' : 'success.main',
                      fontWeight: 'bold'
                    }}
                  >
                    {plan.savings}
                  </Typography>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <List dense disablePadding>
                  {plan.features.map((feature, index) => (
                    <ListItem 
                      key={index} 
                      disablePadding 
                      sx={{ 
                        mb: 0.5,
                        opacity: feature.included ? 1 : 0.5 
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {feature.included ? (
                          <CheckCircleIcon 
                            fontSize="small" 
                            sx={{ color: isDarkMode ? plan.color : '#6c63ff' }} 
                          />
                        ) : (
                          <ClearIcon 
                            fontSize="small" 
                            sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)' }} 
                          />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature.text} 
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          color: isDarkMode 
                            ? (feature.included ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)') 
                            : (feature.included ? undefined : 'text.disabled')
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="body2"
          sx={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            textAlign: 'center',
            mb: 1
          }}
        >
          All plans include a 7-day free trial. Cancel anytime during trial period.
        </Typography>
        
        <Typography
          variant="body2"
          sx={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            textAlign: 'center'
          }}
        >
          Need a custom plan? <Button 
            sx={{ 
              p: 0, 
              minWidth: 'auto', 
              textTransform: 'none',
              fontWeight: 'bold',
              color: isDarkMode ? '#FFD700' : '#6c63ff',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            Contact us
          </Button>
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!selectedPlanId}
          endIcon={<ArrowForwardIcon />}
          sx={{
            backgroundColor: isDarkMode ? '#FFD700' : '#6c63ff',
            color: isDarkMode ? '#000' : '#fff',
            px: 5,
            py: 1.8,
            borderRadius: 3,
            fontWeight: 600,
            fontSize: '1.1rem',
            boxShadow: 3,
            '&:hover': {
              backgroundColor: isDarkMode ? '#DAA520' : '#4834d4',
              transform: 'translateY(-2px)',
              boxShadow: 5,
            },
            '&:disabled': {
              backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(108, 99, 255, 0.3)',
              color: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.4)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Continue with {selectedPlan?.title || 'Selected'} Plan
        </Button>
      </Box>
    </Paper>
  );
};

export default PlanSelectionStep;