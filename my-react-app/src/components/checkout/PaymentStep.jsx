/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Divider,
  CircularProgress,
  Alert,
  Collapse,
  IconButton,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LaunchIcon from "@mui/icons-material/Launch";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";

const PaymentStep = ({
  formData,
  formErrors,
  handleInputChange,
  handleNext,
  handleBack,
  paymentMethod,
  setPaymentMethod,
  orderSummary,
  isLoading,
  isDarkMode,
}) => {
  const [paypalEmail, setPaypalEmail] = useState(formData.email || "");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankReference, setBankReference] = useState("");
  const [showPaypalConfirmation, setShowPaypalConfirmation] = useState(false);
  const [bankInfoCopied, setBankInfoCopied] = useState(false);
  const [showBankConfirmation, setShowBankConfirmation] = useState(false);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);

    // Reset confirmation states when switching methods
    setShowPaypalConfirmation(false);
    setShowBankConfirmation(false);
    setBankInfoCopied(false);
  };

  const handlePaypalContinue = () => {
    // Validate email before showing confirmation
    if (
      !paypalEmail ||
      !paypalEmail.includes("@") ||
      !paypalEmail.includes(".")
    ) {
      return;
    }

    // Show confirmation and simulate PayPal connection
    setShowPaypalConfirmation(true);

    // In a real app, you would redirect to PayPal here
    // For demo purposes, we'll just show the confirmation
  };

  const handleCopyBankDetails = (text) => {
    navigator.clipboard.writeText(text);
    setBankInfoCopied(true);

    // Reset copy confirmation after 3 seconds
    setTimeout(() => {
      setBankInfoCopied(false);
    }, 3000);
  };

  const handleBankTransferConfirm = () => {
    if (!bankAccountName || !bankReference) {
      return;
    }

    setShowBankConfirmation(true);
  };

  // Update the validation function for the new format
  const isValidReference = (ref) => {
    // Check if reference matches XX-NNNNNN pattern
    // Where XX are uppercase letters and N are digits
    const refPattern = /^[A-Z]{2}-\d{6}$/;
    return refPattern.test(ref);
  };

  // Create a stable reference that doesn't change on re-renders
  const [generatedReference] = useState(`GF-${Math.floor(100000 + Math.random() * 900000)}`);
  
  // Fixed bank details with stable reference
  const bankDetails = {
    accountName: "GoldFit Fitness Co.",
    bankName: "First National Bank",
    accountNumber: "1234567890",
    routingNumber: "987654321",
    swift: "FNBAUS123",
    reference: generatedReference, // Use the stable reference
  };

  return (
    <Paper
      elevation={isDarkMode ? 2 : 1}
      sx={{
        p: 3,
        mb: 3,
        bgcolor: isDarkMode
          ? "rgba(40, 40, 40, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        borderRadius: 2,
        transition: "all 0.3s ease",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: isDarkMode ? "#FFD700" : "#6c63ff",
          fontWeight: 600,
        }}
      >
        Payment Method
      </Typography>

      <FormControl component="fieldset" sx={{ width: "100%", mt: 2 }}>
        <RadioGroup
          aria-label="payment-method"
          name="paymentMethod"
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
        >
          {/* Credit Card Option */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              borderColor:
                paymentMethod === "card"
                  ? isDarkMode
                    ? "#FFD700"
                    : "#6c63ff"
                  : isDarkMode
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.12)",
              borderWidth: paymentMethod === "card" ? 2 : 1,
              bgcolor: isDarkMode
                ? "rgba(30, 30, 30, 0.7)"
                : "rgba(246, 246, 246, 0.7)",
              transition: "all 0.3s ease",
            }}
          >
            <FormControlLabel
              value="card"
              control={
                <Radio
                  sx={{
                    color: isDarkMode ? "rgba(255, 215, 0, 0.7)" : undefined,
                    "&.Mui-checked": {
                      color: isDarkMode ? "#FFD700" : "#6c63ff",
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CreditCardIcon
                    sx={{
                      mr: 1,
                      color: isDarkMode ? "#FFD700" : "#6c63ff",
                    }}
                  />
                  <Typography
                    sx={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.9)"
                        : "inherit",
                      fontWeight: 500,
                    }}
                  >
                    Credit / Debit Card
                  </Typography>
                </Box>
              }
              sx={{ width: "100%" }}
            />

            {paymentMethod === "card" && (
              <Box sx={{ pl: 4, pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Name on Card"
                      name="cardName"
                      value={formData.cardName}
                      onChange={(e) => {
                        // Allow only letters, spaces, hyphens, and apostrophes in the name
                        const value = e.target.value;
                        const isValidNameChar = /^[a-zA-Z\s\-.']*$/.test(value);

                        if (!isValidNameChar) return; // Prevent input if invalid character

                        // Create a synthetic event with the validated value
                        const formattedEvent = {
                          ...e,
                          target: {
                            ...e.target,
                            value,
                            name: "cardName",
                          },
                        };

                        handleInputChange(formattedEvent);
                      }}
                      error={!!formErrors.cardName}
                      helperText={
                        formErrors.cardName ||
                        "Only letters, spaces and basic punctuation allowed"
                      }
                      FormHelperTextProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      variant="outlined"
                      InputLabelProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.5)"
                              : undefined,
                          },
                          "&:hover fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.7)"
                              : undefined,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: isDarkMode ? "#FFD700" : undefined,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      name="cardNumber"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        // Format card number with spaces after every 4 digits
                        const value = e.target.value.replace(/\s/g, ""); // Remove existing spaces
                        if (!/^\d*$/.test(value)) return; // Only allow digits

                        // Add spaces after every 4 digits and limit to 16 digits total
                        const formattedValue = value
                          .substring(0, 16)
                          .replace(/(\d{4})(?=\d)/g, "$1 ");

                        // Create a synthetic event with the formatted value
                        const formattedEvent = {
                          ...e,
                          target: {
                            ...e.target,
                            value: formattedValue,
                            name: "cardNumber",
                          },
                        };

                        handleInputChange(formattedEvent);
                      }}
                      error={!!formErrors.cardNumber}
                      helperText={formErrors.cardNumber}
                      FormHelperTextProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      variant="outlined"
                      inputProps={{ maxLength: 19 }} // 16 digits + 3 spaces
                      InputLabelProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.5)"
                              : undefined,
                          },
                          "&:hover fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.7)"
                              : undefined,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: isDarkMode ? "#FFD700" : undefined,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => {
                        // Format expiry date as MM/YY
                        const value = e.target.value.replace(/[^\d]/g, ""); // Remove non-digits
                        if (!/^\d*$/.test(value)) return; // Only allow digits

                        let formattedValue = "";
                        let errorText = "";

                        if (value.length <= 2) {
                          // Just show the month part as user types
                          formattedValue = value;
                        } else {
                          // Add slash after month and limit to 4 digits total (MMYY)
                          const month = value.substring(0, 2);
                          const year = value.substring(2, 4);

                          // Get current date for validation
                          const currentDate = new Date();
                          const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of current year
                          const currentMonth = currentDate.getMonth() + 1; // 1-12

                          // Validate month (01-12)
                          const monthNum = parseInt(month, 10);
                          if (monthNum < 1) {
                            formattedValue = "01/" + year;
                          } else if (monthNum > 12) {
                            formattedValue = "12/" + year;
                          } else {
                            formattedValue = month + "/" + year;
                          }

                          // Validate year is not in the past
                          const yearNum = parseInt(year, 10);
                          if (
                            yearNum < currentYear ||
                            (yearNum === currentYear && monthNum < currentMonth)
                          ) {
                            errorText = "Expiry date cannot be in the past";
                          }
                        }

                        // Create a synthetic event with the formatted value
                        const formattedEvent = {
                          ...e,
                          target: {
                            ...e.target,
                            value: formattedValue,
                            name: "expiryDate",
                          },
                        };

                        // Update the form value
                        handleInputChange(formattedEvent);

                        // If we detected an invalid date, set a custom error
                        if (
                          errorText &&
                          formData.expiryDate !== formattedValue
                        ) {
                          // Update form errors for expiry date
                          // Note: You'll need to add logic in your parent component to handle these custom errors
                          const customErrorEvent = {
                            target: {
                              name: "expiryDateError",
                              value: errorText,
                            },
                          };

                          // If handleErrorChange exists, call it with the custom error
                          if (typeof handleErrorChange === "function") {
                            handleErrorChange(customErrorEvent);
                          }
                        }
                      }}
                      error={!!formErrors.expiryDate}
                      helperText={formErrors.expiryDate}
                      FormHelperTextProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      variant="outlined"
                      inputProps={{ maxLength: 5 }} // MM/YY = 5 characters
                      InputLabelProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.5)"
                              : undefined,
                          },
                          "&:hover fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.7)"
                              : undefined,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: isDarkMode ? "#FFD700" : undefined,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      name="cvv"
                      placeholder="XXX"
                      value={formData.cvv}
                      onChange={(e) => {
                        // Only allow digits and limit to exactly 3 characters
                        const value = e.target.value.replace(/[^\d]/g, "");
                        if (!/^\d*$/.test(value)) return; // Only allow digits

                        // Limit to 3 digits
                        const formattedValue = value.substring(0, 3);

                        // Create a synthetic event with the formatted value
                        const formattedEvent = {
                          ...e,
                          target: {
                            ...e.target,
                            value: formattedValue,
                            name: "cvv",
                          },
                        };

                        handleInputChange(formattedEvent);
                      }}
                      error={
                        !!formErrors.cvv ||
                        (formData.cvv && formData.cvv.length < 3)
                      }
                      helperText={
                        formErrors.cvv ||
                        (formData.cvv &&
                        formData.cvv.length < 3 &&
                        formData.cvv.length > 0
                          ? "CVV must be 3 digits"
                          : "")
                      }
                      FormHelperTextProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      variant="outlined"
                      inputProps={{ maxLength: 3 }}
                      InputLabelProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.5)"
                              : undefined,
                          },
                          "&:hover fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.7)"
                              : undefined,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: isDarkMode ? "#FFD700" : undefined,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <FormControlLabel
                  control={
                    <Checkbox
                      name="savePaymentInfo"
                      checked={formData.savePaymentInfo}
                      onChange={handleInputChange}
                      sx={{
                        color: isDarkMode
                          ? "rgba(255, 215, 0, 0.7)"
                          : undefined,
                        "&.Mui-checked": {
                          color: isDarkMode ? "#FFD700" : "#6c63ff",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: isDarkMode
                          ? "rgba(255, 255, 255, 0.9)"
                          : "inherit",
                      }}
                    >
                      Save this card for future purchases
                    </Typography>
                  }
                  sx={{ mt: 2 }}
                />
              </Box>
            )}
          </Paper>

          {/* PayPal Option */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              borderColor:
                paymentMethod === "paypal"
                  ? isDarkMode
                    ? "#FFD700"
                    : "#6c63ff"
                  : isDarkMode
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.12)",
              borderWidth: paymentMethod === "paypal" ? 2 : 1,
              bgcolor: isDarkMode
                ? "rgba(30, 30, 30, 0.7)"
                : "rgba(246, 246, 246, 0.7)",
              transition: "all 0.3s ease",
            }}
          >
            <FormControlLabel
              value="paypal"
              control={
                <Radio
                  sx={{
                    color: isDarkMode ? "rgba(255, 215, 0, 0.7)" : undefined,
                    "&.Mui-checked": {
                      color: isDarkMode ? "#FFD700" : "#6c63ff",
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PaymentIcon
                    sx={{
                      mr: 1,
                      color: isDarkMode ? "#FFD700" : "#6c63ff",
                    }}
                  />
                  <Typography
                    sx={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.9)"
                        : "inherit",
                      fontWeight: 500,
                    }}
                  >
                    PayPal
                  </Typography>
                </Box>
              }
              sx={{ width: "100%" }}
            />

            {paymentMethod === "paypal" && (
              <Box sx={{ pl: 4, pt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.7)"
                      : "text.secondary",
                    mb: 2,
                  }}
                >
                  Enter your PayPal email address to continue with your payment
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="PayPal Email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      helperText={
                        showPaypalConfirmation &&
                        (!paypalEmail ||
                          !paypalEmail.includes("@") ||
                          !paypalEmail.includes("."))
                          ? "Please enter a valid email address (example@domain.com)"
                          : "Enter the email address associated with your PayPal account"
                      }
                      FormHelperTextProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      variant="outlined"
                      InputLabelProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="We'll connect you to PayPal to complete the payment">
                              <InfoIcon
                                sx={{
                                  color: isDarkMode
                                    ? "rgba(255, 215, 0, 0.7)"
                                    : "rgba(0, 0, 0, 0.5)",
                                  cursor: "pointer",
                                }}
                              />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.5)"
                              : undefined,
                          },
                          "&:hover fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.7)"
                              : undefined,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: isDarkMode ? "#FFD700" : undefined,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePaypalContinue}
                    endIcon={<LaunchIcon />}
                    sx={{
                      backgroundColor: "#0070ba", // PayPal blue
                      "&:hover": {
                        backgroundColor: "#003087", // PayPal dark blue
                      },
                    }}
                  >
                    Continue with PayPal
                  </Button>
                </Box>

                <Collapse in={showPaypalConfirmation}>
                  <Alert
                    severity="success"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setShowPaypalConfirmation(false)}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mt: 2 }}
                  >
                    PayPal account connected successfully. Click "Review Order"
                    to continue.
                  </Alert>
                </Collapse>
              </Box>
            )}
          </Paper>

          {/* Bank Transfer Option */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              borderColor:
                paymentMethod === "bank"
                  ? isDarkMode
                    ? "#FFD700"
                    : "#6c63ff"
                  : isDarkMode
                  ? "rgba(255, 255, 255, 0.2)"
                  : "rgba(0, 0, 0, 0.12)",
              borderWidth: paymentMethod === "bank" ? 2 : 1,
              bgcolor: isDarkMode
                ? "rgba(30, 30, 30, 0.7)"
                : "rgba(246, 246, 246, 0.7)",
              transition: "all 0.3s ease",
            }}
          >
            <FormControlLabel
              value="bank"
              control={
                <Radio
                  sx={{
                    color: isDarkMode ? "rgba(255, 215, 0, 0.7)" : undefined,
                    "&.Mui-checked": {
                      color: isDarkMode ? "#FFD700" : "#6c63ff",
                    },
                  }}
                />
              }
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <AccountBalanceIcon
                    sx={{
                      mr: 1,
                      color: isDarkMode ? "#FFD700" : "#6c63ff",
                    }}
                  />
                  <Typography
                    sx={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.9)"
                        : "inherit",
                      fontWeight: 500,
                    }}
                  >
                    Bank Transfer
                  </Typography>
                </Box>
              }
              sx={{ width: "100%" }}
            />

            {paymentMethod === "bank" && (
              <Box sx={{ pl: 4, pt: 2 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDarkMode
                      ? "rgba(255, 255, 255, 0.7)"
                      : "text.secondary",
                    mb: 2,
                  }}
                >
                  Please use the following bank details to make your transfer.
                  Your membership will be activated once we receive your payment
                  (typically 1-2 business days).
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: isDarkMode
                      ? "rgba(40, 40, 40, 0.8)"
                      : "rgba(250, 250, 250, 0.9)",
                    borderColor: isDarkMode
                      ? "rgba(255, 215, 0, 0.5)"
                      : "rgba(108, 99, 255, 0.3)",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.6)"
                            : undefined,
                          fontSize: "0.9rem",
                        }}
                      >
                        Account Name
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: isDarkMode ? "#FFD700" : "#6c63ff",
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        {bankDetails.accountName}
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopyBankDetails(bankDetails.accountName)
                          }
                          sx={{ ml: 1 }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.6)"
                            : undefined,
                          fontSize: "0.9rem",
                        }}
                      >
                        Bank Name
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: isDarkMode ? "white" : "inherit",
                          mb: 1,
                        }}
                      >
                        {bankDetails.bankName}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.6)"
                            : undefined,
                          fontSize: "0.9rem",
                        }}
                      >
                        Account Number
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: isDarkMode ? "white" : "inherit",
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        {bankDetails.accountNumber}
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopyBankDetails(bankDetails.accountNumber)
                          }
                          sx={{ ml: 1 }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.6)"
                            : undefined,
                          fontSize: "0.9rem",
                        }}
                      >
                        Routing/Sort Code
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: isDarkMode ? "white" : "inherit",
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        {bankDetails.routingNumber}
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopyBankDetails(bankDetails.routingNumber)
                          }
                          sx={{ ml: 1 }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.6)"
                            : undefined,
                          fontSize: "0.9rem",
                        }}
                      >
                        SWIFT/BIC Code
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: isDarkMode ? "white" : "inherit",
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        {bankDetails.swift}
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopyBankDetails(bankDetails.swift)
                          }
                          sx={{ ml: 1 }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.6)"
                            : undefined,
                          fontSize: "0.9rem",
                        }}
                      >
                        Reference (important)
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: isDarkMode ? "#FFD700" : "#6c63ff",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {bankDetails.reference}
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleCopyBankDetails(bankDetails.reference)
                          }
                          sx={{ ml: 1 }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : "text.secondary",
                          fontStyle: "italic",
                        }}
                      >
                        Please include this reference with your transfer
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                <Collapse in={bankInfoCopied}>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Information copied to clipboard!
                  </Alert>
                </Collapse>

                <Typography
                  variant="subtitle2"
                  sx={{
                    color: isDarkMode ? "#FFD700" : "#6c63ff",
                    mb: 1,
                  }}
                >
                  Confirm your bank transfer details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Account Name Used for Transfer"
                      value={bankAccountName}
                      onChange={(e) => setBankAccountName(e.target.value)}
                      error={showBankConfirmation && !bankAccountName}
                      helperText={
                        showBankConfirmation && !bankAccountName
                          ? "Please enter the account name"
                          : ""
                      }
                      FormHelperTextProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      variant="outlined"
                      placeholder="Enter the name on your bank account"
                      InputLabelProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.5)"
                              : undefined,
                          },
                          "&:hover fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.7)"
                              : undefined,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: isDarkMode ? "#FFD700" : undefined,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Reference Used for Transfer"
                      value={bankReference}
                      onChange={(e) => {
                        let value = e.target.value;

                        // Allow free typing but format as we go
                        if (value.length <= 2) {
                          // For the first two characters, convert to uppercase
                          value = value.toUpperCase().replace(/[^A-Z]/g, "");
                        } else if (value.length > 2) {
                          // Get the first two characters (should be uppercase letters)
                          const prefix = value.substring(0, 2).toUpperCase();

                          // After 2 characters, ensure there's a hyphen
                          if (value.length === 3 && value[2] !== "-") {
                            value =
                              prefix +
                              "-" +
                              (value[2] || "").replace(/[^0-9]/g, "");
                          } else {
                            // Get everything after the first two characters
                            const rest = value.substring(2);

                            // If no hyphen, add it
                            if (!rest.startsWith("-")) {
                              value =
                                prefix + "-" + rest.replace(/[^0-9]/g, "");
                            } else {
                              // After the hyphen, only allow digits and limit to 6
                              const afterHyphen = rest
                                .substring(1)
                                .replace(/[^0-9]/g, "");
                              value =
                                prefix + "-" + afterHyphen.substring(0, 6);
                            }
                          }
                        }

                        setBankReference(value);
                      }}
                      error={
                        showBankConfirmation &&
                        (!bankReference || !isValidReference(bankReference))
                      }
                      helperText={
                        showBankConfirmation && !bankReference
                          ? "Please enter the reference"
                          : showBankConfirmation &&
                            !isValidReference(bankReference)
                          ? `Reference must be in format: XX-NNNNNN (2 letters, hyphen, 6 digits)`
                          : `Enter reference in format: XX-NNNNNN`
                      }
                      variant="outlined"
                      placeholder="GF-123456"
                      InputLabelProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      FormHelperTextProps={{
                        style: {
                          color: isDarkMode
                            ? "rgba(255, 255, 255, 0.7)"
                            : undefined,
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.5)"
                              : undefined,
                          },
                          "&:hover fieldset": {
                            borderColor: isDarkMode
                              ? "rgba(255, 215, 0, 0.7)"
                              : undefined,
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: isDarkMode ? "#FFD700" : undefined,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleBankTransferConfirm}
                    sx={{
                      backgroundColor: isDarkMode ? "#FFD700" : "#6c63ff",
                      color: isDarkMode ? "#000" : "#fff",
                      "&:hover": {
                        backgroundColor: isDarkMode ? "#DAA520" : "#4834d4",
                      },
                    }}
                  >
                    Confirm Bank Transfer Details
                  </Button>
                </Box>

                <Collapse in={showBankConfirmation}>
                  <Alert
                    severity="success"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => setShowBankConfirmation(false)}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ mt: 2 }}
                  >
                    Bank transfer details confirmed. Click "Review Order" to
                    continue.
                  </Alert>
                </Collapse>

                <Alert severity="info" sx={{ mt: 2 }}>
                  Your membership will be activated once we confirm your
                  payment, which typically takes 1-2 business days.
                </Alert>
              </Box>
            )}
          </Paper>
        </RadioGroup>
      </FormControl>

      <Divider
        sx={{
          my: 3,
          borderColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : undefined,
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            borderColor: isDarkMode ? "#FFD700" : "#6c63ff",
            color: isDarkMode ? "#FFD700" : "#6c63ff",
            "&:hover": {
              borderColor: isDarkMode ? "#DAA520" : "#4834d4",
              backgroundColor: isDarkMode
                ? "rgba(255, 215, 0, 0.1)"
                : undefined,
            },
          }}
        >
          Back
        </Button>

        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            isLoading ||
            (paymentMethod === "paypal" && !showPaypalConfirmation) ||
            (paymentMethod === "bank" && !showBankConfirmation)
          }
          sx={{
            backgroundColor: isDarkMode ? "#FFD700" : "#6c63ff",
            color: isDarkMode ? "#000" : "#fff",
            "&:hover": {
              backgroundColor: isDarkMode ? "#DAA520" : "#4834d4",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress
              size={24}
              sx={{ color: isDarkMode ? "#000" : "#fff" }}
            />
          ) : (
            "Review Order"
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default PaymentStep;
