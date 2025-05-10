import React from "react";
import {
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  MenuItem,
  Box,
  Autocomplete,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const AddressStep = ({
  formData,
  formErrors,
  handleInputChange,
  handleNext,
  handleBack,
  isDarkMode,
}) => {
  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo (Congo-Brazzaville)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Democratic Republic of the Congo",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  const textFieldProps = {
    InputLabelProps: {
      style: { color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : undefined },
    },
    sx: {
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: isDarkMode ? "rgba(255, 215, 0, 0.5)" : undefined,
        },
        "&:hover fieldset": {
          borderColor: isDarkMode ? "rgba(255, 215, 0, 0.7)" : undefined,
        },
        "&.Mui-focused fieldset": {
          borderColor: isDarkMode ? "#FFD700" : undefined,
        },
      },
    },
  };

  // Handle country change from Autocomplete
  const handleCountryChange = (event, newValue) => {
    // Create a synthetic event to match the handleInputChange format
    const syntheticEvent = {
      target: {
        name: "country",
        value: newValue || ""
      }
    };
    handleInputChange(syntheticEvent);
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
        Shipping Address
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            error={!!formErrors.address}
            helperText={formErrors.address}
            variant="outlined"
            {...textFieldProps}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            error={!!formErrors.city}
            helperText={formErrors.city}
            variant="outlined"
            {...textFieldProps}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="State/Province"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            error={!!formErrors.state}
            helperText={formErrors.state}
            variant="outlined"
            {...textFieldProps}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Zip/Postal Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            error={!!formErrors.zipCode}
            helperText={formErrors.zipCode}
            variant="outlined"
            {...textFieldProps}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Autocomplete
            options={countries}
            value={formData.country}
            onChange={handleCountryChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Country"
                variant="outlined"
                error={!!formErrors.country}
                helperText={formErrors.country}
                {...textFieldProps}
              />
            )}
            sx={{
              "& .MuiAutocomplete-input": {
                color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
              }
            }}
            ListboxProps={{
              style: {
                maxHeight: '250px'
              }
            }}
            PaperProps={{
              sx: {
                backgroundColor: isDarkMode ? 'rgba(60, 60, 60, 0.98)' : '#ffffff',
                color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                boxShadow: isDarkMode ? '0px 4px 20px rgba(0, 0, 0, 0.5)' : '0px 4px 20px rgba(0, 0, 0, 0.15)',
                border: isDarkMode ? '1px solid rgba(255, 215, 0, 0.2)' : undefined,
                
                "& .MuiAutocomplete-option": {
                  color: isDarkMode ? "rgba(255, 255, 255, 0.9)" : undefined,
                  
                  "&[data-focus='true']": {
                    backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.15)' : 'rgba(108, 99, 255, 0.1)'
                  },
                  
                  "&[aria-selected='true']": {
                    backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.25)' : 'rgba(108, 99, 255, 0.15)'
                  },
                  
                  "&:hover": {
                    backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.15)' : 'rgba(108, 99, 255, 0.1)'
                  }
                }
              }
            }}
            disablePortal
            autoHighlight
            openOnFocus
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
          />
        </Grid>
      </Grid>

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
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          sx={{
            backgroundColor: isDarkMode ? "#FFD700" : "#6c63ff",
            color: isDarkMode ? "#000" : "#fff",
            "&:hover": {
              backgroundColor: isDarkMode ? "#DAA520" : "#4834d4",
            },
          }}
        >
          Continue to Payment
        </Button>
      </Box>
    </Paper>
  );
};

export default AddressStep;
