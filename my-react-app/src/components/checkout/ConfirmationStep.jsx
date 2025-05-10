import React from "react";
import {
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { notifyPayment } from "@/api";

const ConfirmationStep = ({
  formData,
  formErrors,
  handleInputChange,
  handleBack,
  plan,
  orderSummary,
  paymentMethod,
  handleSubmitOrder,
  isLoading,
  isDarkMode,
}) => {
  const maskCardNumber = (number) => {
    if (!number) return "";
    const visibleDigits = number.slice(-4);
    return `**** **** **** ${visibleDigits}`;
  };
  const handlePlaceOrder = async () => {
    try {
      await handleSubmitOrder();

      const token = localStorage.getItem("token");
      let userId;

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.id || payload.userId || null;
        } catch (err) {
          console.error("Invalid token format:", err);
        }
      }

      if (token && userId) {
        await notifyPayment(token, userId, formData.phone, orderSummary.total);
        console.log("SMS sent");
      } else {
        console.warn("Missing token or user ID");
      }
    } catch (err) {
      console.error("Failed to place order or notify:", err);
    }
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
        Review Your Order
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              bgcolor: isDarkMode
                ? "rgba(30, 30, 30, 0.7)"
                : "rgba(246, 246, 246, 0.7)",
              borderColor: isDarkMode ? "rgba(255, 215, 0, 0.3)" : undefined,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: isDarkMode ? "#FFD700" : "#6c63ff",
                fontWeight: 600,
              }}
            >
              Personal Information
            </Typography>

            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText
                  primary="Name"
                  secondary={`${formData.firstName} ${formData.lastName}`}
                  primaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : undefined,
                    variant: "body2",
                  }}
                  secondaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                    fontWeight: 500,
                  }}
                />
              </ListItem>

              <ListItem disableGutters>
                <ListItemText
                  primary="Email"
                  secondary={formData.email}
                  primaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : undefined,
                    variant: "body2",
                  }}
                  secondaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                    fontWeight: 500,
                  }}
                />
              </ListItem>

              <ListItem disableGutters>
                <ListItemText
                  primary="Phone"
                  secondary={formData.phone}
                  primaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : undefined,
                    variant: "body2",
                  }}
                  secondaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              bgcolor: isDarkMode
                ? "rgba(30, 30, 30, 0.7)"
                : "rgba(246, 246, 246, 0.7)",
              borderColor: isDarkMode ? "rgba(255, 215, 0, 0.3)" : undefined,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: isDarkMode ? "#FFD700" : "#6c63ff",
                fontWeight: 600,
              }}
            >
              Billing Address
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                whiteSpace: "pre-line",
              }}
            >
              {`${formData.address}\n${formData.city}, ${formData.state} ${formData.zipCode}\n${formData.country}`}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              bgcolor: isDarkMode
                ? "rgba(30, 30, 30, 0.7)"
                : "rgba(246, 246, 246, 0.7)",
              borderColor: isDarkMode ? "rgba(255, 215, 0, 0.3)" : undefined,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: isDarkMode ? "#FFD700" : "#6c63ff",
                fontWeight: 600,
              }}
            >
              Payment Method
            </Typography>

            {paymentMethod === "card" && (
              <List dense disablePadding>
                <ListItem disableGutters>
                  <ListItemText
                    primary="Card Type"
                    secondary="Credit Card"
                    primaryTypographyProps={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : undefined,
                      variant: "body2",
                    }}
                    secondaryTypographyProps={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.9)"
                        : undefined,
                      fontWeight: 500,
                    }}
                  />
                </ListItem>

                <ListItem disableGutters>
                  <ListItemText
                    primary="Card Holder"
                    secondary={formData.cardName}
                    primaryTypographyProps={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : undefined,
                      variant: "body2",
                    }}
                    secondaryTypographyProps={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.9)"
                        : undefined,
                      fontWeight: 500,
                    }}
                  />
                </ListItem>

                <ListItem disableGutters>
                  <ListItemText
                    primary="Card Number"
                    secondary={maskCardNumber(formData.cardNumber)}
                    primaryTypographyProps={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : undefined,
                      variant: "body2",
                    }}
                    secondaryTypographyProps={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.9)"
                        : undefined,
                      fontWeight: 500,
                    }}
                  />
                </ListItem>

                <ListItem disableGutters>
                  <ListItemText
                    primary="Expiry Date"
                    secondary={formData.expiryDate}
                    primaryTypographyProps={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : undefined,
                      variant: "body2",
                    }}
                    secondaryTypographyProps={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.9)"
                        : undefined,
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              </List>
            )}

            {paymentMethod === "paypal" && (
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                }}
              >
                PayPal
              </Typography>
            )}

            {paymentMethod === "bank" && (
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                }}
              >
                Bank Transfer
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              bgcolor: isDarkMode
                ? "rgba(30, 30, 30, 0.7)"
                : "rgba(246, 246, 246, 0.7)",
              borderColor: isDarkMode ? "rgba(255, 215, 0, 0.3)" : undefined,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: isDarkMode ? "#FFD700" : "#6c63ff",
                fontWeight: 600,
              }}
            >
              Membership Summary
            </Typography>

            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText
                  primary="Plan"
                  secondary={plan.title}
                  primaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : undefined,
                    variant: "body2",
                  }}
                  secondaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                    fontWeight: 500,
                  }}
                />
              </ListItem>

              <ListItem disableGutters>
                <ListItemText
                  primary="Billing Period"
                  secondary={plan.period === "month" ? "Monthly" : "Annual"}
                  primaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : undefined,
                    variant: "body2",
                  }}
                  secondaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                    fontWeight: 500,
                  }}
                />
              </ListItem>

              <ListItem disableGutters>
                <ListItemText
                  primary="Price"
                  secondary={`$${orderSummary.subtotal}`}
                  primaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : undefined,
                    variant: "body2",
                  }}
                  secondaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                    fontWeight: 500,
                  }}
                />
              </ListItem>

              {orderSummary.discount > 0 && (
                <ListItem disableGutters>
                  <ListItemText
                    primary="Discount"
                    secondary={`-$${orderSummary.discount}`}
                    primaryTypographyProps={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.7)"
                        : undefined,
                      variant: "body2",
                    }}
                    secondaryTypographyProps={{
                      color: isDarkMode
                        ? "rgba(255, 255, 255, 0.9)"
                        : undefined,
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              )}

              <ListItem disableGutters>
                <ListItemText
                  primary="Processing Fee"
                  secondary={`$${orderSummary.processingFee}`}
                  primaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : undefined,
                    variant: "body2",
                  }}
                  secondaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                    fontWeight: 500,
                  }}
                />
              </ListItem>

              <Divider
                sx={{
                  my: 1,
                  borderColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : undefined,
                }}
              />

              <ListItem disableGutters>
                <ListItemText
                  primary="Total"
                  secondary={`$${orderSummary.total}`}
                  primaryTypographyProps={{
                    color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : undefined,
                    variant: "body2",
                  }}
                  secondaryTypographyProps={{
                    color: isDarkMode ? "#FFD700" : "#6c63ff",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, mb: 2 }}>
        <FormControlLabel
          required
          control={
            <Checkbox
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              name="termsAccepted"
              color="primary"
              sx={{
                color: isDarkMode ? "rgba(255, 215, 0, 0.7)" : undefined,
                "&.Mui-checked": {
                  color: isDarkMode ? "#FFD700" : "#6c63ff",
                },
              }}
            />
          }
          label={
            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "inherit",
              }}
            >
              I agree to the{" "}
              <Box
                component="span"
                sx={{
                  color: isDarkMode ? "#FFD700" : "#6c63ff",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                terms and conditions
              </Box>{" "}
              and{" "}
              <Box
                component="span"
                sx={{
                  color: isDarkMode ? "#FFD700" : "#6c63ff",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                privacy policy
              </Box>
            </Typography>
          }
        />

        {formErrors.termsAccepted && (
          <Typography
            variant="caption"
            color="error"
            sx={{ display: "block", mt: 1 }}
          >
            {formErrors.termsAccepted}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
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
          color="primary"
          onClick={handlePlaceOrder}
          disabled={isLoading}
          endIcon={<CheckCircleIcon />}
          sx={{
            backgroundColor: isDarkMode ? "#FFD700" : "#6c63ff",
            color: isDarkMode ? "#000" : "#fff",
            "&:hover": {
              backgroundColor: isDarkMode ? "#DAA520" : "#4834d4",
            },
            fontSize: "1rem",
            px: 3,
            py: 1,
          }}
        >
          {isLoading ? (
            <CircularProgress
              size={24}
              sx={{ color: isDarkMode ? "#000" : "#fff" }}
            />
          ) : (
            "Place Order"
          )}
        </Button>
      </Box>
    </Paper>
  );
};

export default ConfirmationStep;
