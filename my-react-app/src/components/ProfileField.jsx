// src/components/profile/ProfileField.jsx
import React from "react";
import PropTypes from "prop-types";
import { TextField, MenuItem, InputAdornment } from "@mui/material";

// Create a function that returns styles based on dark mode
const getFieldStyles = (darkMode) => ({
  "& .MuiInputLabel-root": { 
    // Improved label contrast for better readability
    color: darkMode ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.8)",
    "&.Mui-focused": {
      color: darkMode ? "#FFD700" : "#6200ea"
    }
  },
  "& .MuiOutlinedInput-root": {
    color: darkMode ? "#ffffff" : "#000000",
    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.07)" : "rgba(0, 0, 0, 0.04)",
    borderRadius: 2,
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
    },
    "&.Mui-focused": {
      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.23)",
      transition: "border-color 0.3s",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: darkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: darkMode ? "#FFD700" : "#6200ea",
      borderWidth: 2,
    },
  },
  // Input adornment (units)
  "& .MuiInputAdornment-root": {
    color: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
  },
  // Menu items in select
  "& .MuiMenuItem-root": {
    color: darkMode ? "#ffffff" : "#000000",
  }
});

export default function ProfileField({
  label,
  name,
  type = "text",
  value,
  onChange,
  select = false,
  options = [],
  required = false,
  placeholder,
  darkMode = false, // New prop for dark mode
  autoComplete, // Add this prop
}) {
  // Generate proper InputAdornment based on field name/type
  const getAdornment = () => {
    if (type === "number") {
      if (name === "height" || label?.includes("Height")) {
        return { endAdornment: <InputAdornment position="end">cm</InputAdornment> };
      }
      if (name === "weight" || label?.includes("Weight")) {
        return { endAdornment: <InputAdornment position="end">kg</InputAdornment> };
      }
    }
    return {};
  };

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      type={type}
      value={value || ""}
      onChange={onChange}
      margin="normal"
      variant="outlined"
      required={required}
      select={select}
      placeholder={placeholder}
      autoComplete={autoComplete} // Pass this to TextField
      InputProps={getAdornment()}
      sx={getFieldStyles(darkMode)}
      SelectProps={{
        MenuProps: {
          PaperProps: {
            sx: {
              bgcolor: darkMode ? "rgba(30, 30, 30, 0.9)" : "white",
              "& .MuiMenuItem-root": {
                color: darkMode ? "white" : "black",
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
                },
                "&.Mui-selected": {
                  backgroundColor: darkMode ? "rgba(255, 215, 0, 0.2)" : "rgba(98, 0, 234, 0.1)",
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(255, 215, 0, 0.3)" : "rgba(98, 0, 234, 0.2)",
                  }
                }
              }
            }
          }
        }
      }}
    >
      {select &&
        options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
    </TextField>
  );
}

ProfileField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  select: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  darkMode: PropTypes.bool,
  autoComplete: PropTypes.string,
};