// src/components/profile/ProfileField.jsx
import React from "react";
import PropTypes from "prop-types";
import { TextField, MenuItem, InputAdornment } from "@mui/material";

const fieldStyles = {
  "& .MuiInputLabel-root": { 
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: "#D4AF37"
    }
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 2,
    transition: "background-color 0.3s",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(0, 0, 0, 0.35)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(212, 175, 55, 0.5)",
      transition: "border-color 0.3s",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(212, 175, 55, 0.8)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#D4AF37",
      borderWidth: 2,
    },
  },
};

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
      InputProps={getAdornment()}
      sx={fieldStyles}
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
};