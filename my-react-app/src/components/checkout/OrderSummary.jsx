import React from "react";
import {
  Paper,
  Typography,
  Box,
  Divider,
  TextField,
  Button,
  InputAdornment,
  Alert,
  CircularProgress
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const OrderSummary = ({
  plan,
  orderSummary,
  promoCode,
  setPromoCode,
  promoApplied,
  promoDiscount,
  formErrors,
  isLoading,
  applyPromoCode,
  setPromoApplied,
  setPromoDiscount,
  isDarkMode
}) => {
  return (
    <Paper 
      elevation={isDarkMode ? 2 : 1}  
      sx={{ 
        p: 3, 
        mb: 3,
        bgcolor: isDarkMode ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderRadius: 2,
        transition: 'all 0.3s ease'
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: isDarkMode ? '#FFD700' : '#6c63ff',
          fontWeight: 600
        }}
      >
        Order Summary
      </Typography>
      
      <Box sx={{ my: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography 
            variant="body2" 
            sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}
          >
            {plan.title} Membership ({plan.period})
          </Typography>
          <Typography 
            variant="body2"
            sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit' }}
          >
            ${orderSummary.subtotal}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography 
            variant="body2" 
            sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary' }}
          >
            Processing Fee
          </Typography>
          <Typography 
            variant="body2"
            sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit' }}
          >
            ${orderSummary.processingFee}
          </Typography>
        </Box>
        
        {promoApplied && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mb: 1.5, 
            color: isDarkMode ? '#AAFF00' : 'success.main' 
          }}>
            <Typography variant="body2">
              Discount ({promoDiscount * 100}%)
            </Typography>
            <Typography variant="body2">-${orderSummary.discount}</Typography>
          </Box>
        )}
      </Box>
      
      <Divider sx={{ 
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'inherit' 
      }} />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="bold"
          sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit' }}
        >
          Total
        </Typography>
        <Typography 
          variant="subtitle1" 
          fontWeight="bold" 
          sx={{ color: isDarkMode ? '#FFD700' : 'primary.main' }}
        >
          ${orderSummary.total}
        </Typography>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        {!promoApplied ? (
          <>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                size="small"
                error={!!formErrors.promoCode}
                helperText={formErrors.promoCode}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOfferIcon 
                        fontSize="small" 
                        sx={{ color: isDarkMode ? 'rgba(255, 215, 0, 0.7)' : undefined }}
                      />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  style: { color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? 'rgba(255, 215, 0, 0.5)' : undefined,
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? 'rgba(255, 215, 0, 0.7)' : undefined,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? '#FFD700' : undefined,
                    },
                    '& input': {
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : undefined
                    }
                  },
                  '& .MuiFormHelperText-root': {
                    color: isDarkMode ? '#F44336' : undefined
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={applyPromoCode}
                disabled={isLoading || !promoCode.trim()}
                sx={{ 
                  minWidth: 80,
                  bgcolor: isDarkMode ? '#FFD700' : 'secondary.main',
                  color: isDarkMode ? '#000' : '#fff',
                  '&:hover': {
                    bgcolor: isDarkMode ? '#DAA520' : undefined,
                  },
                  '&.Mui-disabled': {
                    bgcolor: isDarkMode ? 'rgba(255, 215, 0, 0.3)' : undefined,
                    color: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : undefined
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress 
                    size={24} 
                    sx={{ 
                      color: isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'inherit' 
                    }} 
                  />
                ) : (
                  "Apply"
                )}
              </Button>
            </Box>
          </>
        ) : (
          <Alert 
            icon={
              <CheckCircleOutlineIcon 
                fontSize="inherit" 
                sx={{ color: isDarkMode ? '#000' : undefined }}
              />
            }
            severity="success"
            sx={{
              bgcolor: isDarkMode ? 'rgba(183, 223, 185, 0.9)' : undefined,
              color: isDarkMode ? '#000' : undefined,
              '& .MuiAlert-message': {
                color: isDarkMode ? '#000' : undefined
              }
            }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => {
                  setPromoApplied(false);
                  setPromoDiscount(0);
                  setPromoCode("");
                }}
                sx={{
                  fontWeight: 600,
                  color: isDarkMode ? '#000' : undefined,
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.1)' : undefined
                  }
                }}
              >
                Remove
              </Button>
            }
          >
            Promo code applied: {promoCode.toUpperCase()}
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

export default OrderSummary;