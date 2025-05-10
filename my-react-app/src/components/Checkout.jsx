/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
} from "@mui/material";
import PlanSelectionStep from "../components/checkout/PlanSelectionStep";
import PersonalInfoStep from "../components/checkout/PersonalInfoStep";
import AddressStep from "../components/checkout/AddressStep";
import PaymentStep from "../components/checkout/PaymentStep";
import ConfirmationStep from "../components/checkout/ConfirmationStep";
import OrderCompleteStep from "../components/checkout/OrderCompleteStep";
import OrderSummary from "../components/checkout/OrderSummary";
import TrustBadges from "../components/checkout/TrustBadges";
import ThemeToggle from "./ThemeToggle";

const Checkout = ({ onClose }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  // State for plan selection
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  // State for order summary
  const [orderSummaryState, setOrderSummaryState] = useState({
    subtotal: "0.00",
    processingFee: "0.00",
    discount: "0.00",
    total: "0.00",
  });

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      setIsDarkMode(event.detail.theme === "dark");
    };

    // Check initial theme
    setIsDarkMode(document.body.classList.contains("dark-mode"));

    // Add event listener
    document.addEventListener("themeChanged", handleThemeChange);

    // Cleanup
    return () => {
      document.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    createAccount: false,
    password: "",
    savePaymentInfo: false,
    termsAccepted: false,
  });

  // Calculate order summary
  const calculateSummary = () => {
    if (!selectedPlan) {
      return {
        subtotal: "0.00",
        processingFee: "0.00",
        discount: "0.00",
        total: "0.00",
      };
    }

    const subtotal = selectedPlan.price;
    const processingFee = subtotal * 0.03; // 3% processing fee
    const discount = promoApplied ? subtotal * promoDiscount : 0;
    const total = subtotal + processingFee - discount;

    return {
      subtotal: subtotal.toFixed(2),
      processingFee: processingFee.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const orderSummary =
    orderSummaryState.subtotal !== "0.00"
      ? orderSummaryState
      : calculateSummary();

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Clear error when user types in field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };

  // Define valid promo codes and their discount percentages
  const validPromoCodes = {
    WELCOME10: 0.1, // 10% off
    SUMMER20: 0.2, // 20% off
    GOLDFIT: 0.25, // 25% off - special code
  };

  // Handle applying promo codes
  const applyPromoCode = () => {
    setIsLoading(true);

    // Simulate API validation delay
    setTimeout(() => {
      const normalizedCode = promoCode.trim().toUpperCase();

      // eslint-disable-next-line no-prototype-builtins
      if (validPromoCodes.hasOwnProperty(normalizedCode)) {
        // Valid promo code
        setPromoApplied(true);
        setPromoDiscount(validPromoCodes[normalizedCode]);
        setFormErrors((prev) => ({ ...prev, promoCode: "" }));

        // Calculate the new order summary
        const subtotal = selectedPlan.price;
        const processingFee = subtotal * 0.03;
        const discountAmount = subtotal * validPromoCodes[normalizedCode];
        const newTotal = subtotal + processingFee - discountAmount;

        // Update the order summary state
        setOrderSummaryState({
          subtotal: subtotal.toFixed(2),
          processingFee: processingFee.toFixed(2),
          discount: discountAmount.toFixed(2),
          total: newTotal.toFixed(2),
        });
      } else {
        // Invalid promo code
        setFormErrors((prev) => ({
          ...prev,
          promoCode: "Invalid promo code. Please try again.",
        }));
        setPromoApplied(false);
        setPromoDiscount(0);

        // Reset to calculated summary without discount
        setOrderSummaryState(calculateSummary());
      }

      setIsLoading(false);
    }, 800); // Simulate network delay
  };

  const validateStep = (stepNumber) => {
    const errors = {};

    if (stepNumber === 0) {
      // Plan selection
      if (!selectedPlan) errors.plan = "Please select a plan";
    }

    if (stepNumber === 1) {
      // Personal info
      if (!formData.firstName.trim())
        errors.firstName = "First name is required";
      if (!formData.lastName.trim()) errors.lastName = "Last name is required";
      if (!formData.email.trim()) errors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        errors.email = "Email is invalid";
      if (!formData.phone.trim()) errors.phone = "Phone number is required";
    }

    if (stepNumber === 2) {
      // Address
      if (!formData.address.trim()) errors.address = "Address is required";
      if (!formData.city.trim()) errors.city = "City is required";
      if (!formData.state.trim()) errors.state = "State is required";
      if (!formData.zipCode.trim()) errors.zipCode = "ZIP code is required";
    }

    if (stepNumber === 3) {
      // Payment
      if (paymentMethod === "card") {
        if (!formData.cardName.trim())
          errors.cardName = "Name on card is required";
        if (!formData.cardNumber.trim())
          errors.cardNumber = "Card number is required";
        else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, "")))
          errors.cardNumber = "Invalid card number";

        if (!formData.expiryDate.trim())
          errors.expiryDate = "Expiry date is required";
        else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate))
          errors.expiryDate = "Invalid format (MM/YY)";

        if (!formData.cvv.trim()) errors.cvv = "CVV is required";
        else if (!/^\d{3,4}$/.test(formData.cvv)) errors.cvv = "Invalid CVV";
      }
    }

    if (stepNumber === 4) {
      // Review/confirm
      if (!formData.termsAccepted)
        errors.termsAccepted = "You must accept the terms and conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    window.scrollTo(0, 0);
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    if (!validateStep(activeStep)) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to create order
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate a random order ID
      const newOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(newOrderId);
      setOrderComplete(true);

      // You could send the data to your backend here
      const orderData = {
        plan: selectedPlan,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          createAccount: formData.createAccount,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentInfo: {
          method: paymentMethod,
          saveInfo: formData.savePaymentInfo,
          // Don't include full card details in real applications
          // Only include what you need for your backend
          lastFour: formData.cardNumber ? formData.cardNumber.slice(-4) : null,
        },
        orderSummary: {
          ...orderSummary,
          promoApplied: promoApplied,
          promoCode: promoApplied ? promoCode : null,
        },
      };

      console.log("Order submitted:", orderData);
    } catch (error) {
      console.error("Error creating order:", error);
      setFormErrors({
        ...formErrors,
        submit: "Failed to process your order. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Common props for step components
  const stepProps = {
    formData,
    formErrors,
    handleInputChange,
    handleNext,
    handleBack,
    onClose,
    isLoading,
    isDarkMode,
  };

  // Steps array
  const steps = [
    "Choose Plan",
    "Personal Information",
    "Address",
    "Payment",
    "Review Order",
  ];

  return (
    <div className={isDarkMode ? "dark-mode" : ""}>
      <Container
        maxWidth="lg"
        sx={{
          my: 4,
          py: 4,
          px: { xs: 2, md: 4 },
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: isDarkMode
            ? "rgba(33, 33, 33, 0.9)"
            : "rgba(255, 255, 255, 0.9)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // Center content vertically
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 4,
            fontWeight: 600,
            color: isDarkMode ? "#FFD700" : "#6c63ff",
            textShadow: isDarkMode ? "1px 1px 3px rgba(0,0,0,0.3)" : "none",
          }}
        >
          {activeStep === 0
            ? "Choose Your Membership Plan"
            : "Complete Your Membership"}
        </Typography>

        {!orderComplete && (
          <Box sx={{ width: "100%", maxWidth: 800, mx: "auto" }}>
            <Stepper
              activeStep={activeStep}
              sx={{
                mb: 4,
                "& .MuiStepLabel-label": {
                  color: isDarkMode ? "rgba(255,255,255,0.7)" : "inherit",
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: isDarkMode ? "#FFD700" : "#6c63ff",
                },
                "& .MuiStepIcon-root.Mui-active": {
                  color: isDarkMode ? "#FFD700" : "#6c63ff",
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  color: isDarkMode ? "#DAA520" : "#4834d4",
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
        )}

        <Grid
          container
          spacing={3}
          sx={{
            justifyContent: "center", // Center the grid items horizontally
            maxWidth: 1200, // Limit the width for better control
            mx: "auto", // Center the grid container
          }}
        >
          <Grid
            item
            xs={12}
            md={activeStep === 0 ? 12 : 8}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {!orderComplete ? (
              <>
                {activeStep === 0 && (
                  <PlanSelectionStep
                    handleNext={handleNext}
                    setSelectedPlan={setSelectedPlan}
                    setSelectedPeriod={setSelectedPeriod}
                    selectedPlan={selectedPlan}
                    selectedPeriod={selectedPeriod}
                    isDarkMode={isDarkMode}
                  />
                )}
                {activeStep === 1 && (
                  <PersonalInfoStep
                    {...stepProps}
                    guestCheckout={guestCheckout}
                    setGuestCheckout={setGuestCheckout}
                  />
                )}
                {activeStep === 2 && <AddressStep {...stepProps} />}
                {activeStep === 3 && (
                  <PaymentStep
                    {...stepProps}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    orderSummary={orderSummary}
                  />
                )}
                {activeStep === 4 && (
                  <ConfirmationStep
                    {...stepProps}
                    plan={selectedPlan}
                    orderSummary={orderSummary}
                    paymentMethod={paymentMethod}
                    handleSubmitOrder={handleSubmitOrder}
                  />
                )}
              </>
            ) : (
              <OrderCompleteStep
                orderId={orderId}
                formData={formData}
                plan={selectedPlan}
                onClose={onClose}
                isDarkMode={isDarkMode}
              />
            )}
          </Grid>

          {!orderComplete && activeStep > 0 && (
            <Grid item xs={12} md={4}>
              <Paper
                elevation={isDarkMode ? 2 : 1}
                sx={{
                  p: { xs: 2, md: 3 },
                  bgcolor: isDarkMode
                    ? "rgba(40, 40, 40, 0.95)"
                    : "rgba(255, 255, 255, 0.95)",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                }}
              >
                <OrderSummary
                  plan={selectedPlan}
                  orderSummary={orderSummary}
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  promoApplied={promoApplied}
                  promoDiscount={promoDiscount}
                  formErrors={formErrors}
                  isLoading={isLoading}
                  applyPromoCode={applyPromoCode}
                  setPromoApplied={setPromoApplied}
                  setPromoDiscount={setPromoDiscount}
                  isDarkMode={isDarkMode}
                />
              </Paper>
              <Box sx={{ mt: 2 }}>
                <TrustBadges isDarkMode={isDarkMode} />
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>

      {/* Add ThemeToggle component */}
      <ThemeToggle />

      <style jsx global>{`
        /* Additional checkout-specific styles */
        .dark-mode .MuiTypography-root {
          color: rgba(255, 255, 255, 0.9);
        }

        .dark-mode .MuiInputBase-input {
          color: rgba(255, 255, 255, 0.9);
        }

        .dark-mode .MuiOutlinedInput-root {
          & .MuiOutlinedInput-notchedOutline {
            border-color: rgba(255, 215, 0, 0.5);
          }
          &:hover .MuiOutlinedInput-notchedOutline {
            border-color: rgba(255, 215, 0, 0.7);
          }
          &.Mui-focused .MuiOutlinedInput-notchedOutline {
            border-color: #ffd700;
          }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
