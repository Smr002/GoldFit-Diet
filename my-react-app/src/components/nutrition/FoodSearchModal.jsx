import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

// USDA API key (in a real app, this would be stored securely in environment variables)
const API_KEY = "Q0OdBuGbK6sKKOj7YhXNN7ECmpVig2YL7za67Ge8"; // Replace with your actual API key

const FoodSearchModal = ({ open, onClose, onAddFood, mealId }) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingSize, setServingSize] = useState("100");
  const [servingUnit, setServingUnit] = useState("g");

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedFood(null);

    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&pageSize=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch food data");
      }

      const data = await response.json();
      setSearchResults(data.foods || []);

      if (data.foods?.length === 0) {
        setError("No foods found matching your search");
      }
    } catch (err) {
      console.error("Error searching for foods:", err);
      setError("Error searching for foods. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle pressing Enter in the search field
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedFood(null);
    setError(null);
  };

  // Select a food from search results
  const handleSelectFood = (food) => {
    setSelectedFood(food);

    // Reset serving size and unit when selecting a new food
    setServingSize("100");
    setServingUnit("g");
  };

  // Add the selected food to the meal
  const handleAddFood = () => {
    // Make sure we have a selected food
    if (!selectedFood) return;

    // Find nutrients
    const nutrients = selectedFood.foodNutrients || [];
    const calories =
      nutrients.find(
        (n) => n.nutrientName === "Energy" || n.nutrientNumber === "208"
      )?.value || 0;
    const protein =
      nutrients.find(
        (n) => n.nutrientName === "Protein" || n.nutrientNumber === "203"
      )?.value || 0;
    const carbs =
      nutrients.find(
        (n) =>
          n.nutrientName === "Carbohydrate, by difference" ||
          n.nutrientNumber === "205"
      )?.value || 0;
    const fat =
      nutrients.find(
        (n) =>
          n.nutrientName === "Total lipid (fat)" || n.nutrientNumber === "204"
      )?.value || 0;

    // Calculate values based on serving size
    const multiplier = parseFloat(servingSize) / 100; // Assuming default nutrition values are per 100g

    // Create a food object
    const newFood = {
      id: `food-${Date.now()}`, // Generate a temporary ID
      name: selectedFood.description,
      serving: `${servingSize} ${servingUnit}`,
      calories: Math.round(calories * multiplier),
      protein: Math.round(protein * multiplier * 10) / 10,
      carbs: Math.round(carbs * multiplier * 10) / 10,
      fat: Math.round(fat * multiplier * 10) / 10,
      foodId: selectedFood.fdcId,
    };

    // Add food to the meal
    onAddFood(mealId, newFood);

    // Close the modal
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" fontWeight="bold">
          Add Food to Meal
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* Search Field */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Search for a food"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery && (
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearSearch}
                      edge="end"
                    >
                      <ClearIcon />
                    </IconButton>
                  )}
                  <IconButton
                    aria-label="search"
                    onClick={handleSearch}
                    edge="end"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 0.5 }}
          >
            Search for foods like "apple", "chicken breast", or "greek yogurt"
          </Typography>
        </Box>

        {/* Error alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading indicator */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Search results and food details side by side */}
        <Grid container spacing={2}>
          {/* Search results */}
          <Grid item xs={12} md={6}>
            {searchResults.length > 0 && !loading && (
              <Paper
                variant="outlined"
                sx={{ maxHeight: "50vh", overflow: "auto", p: 1 }}
              >
                <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>
                  {searchResults.length} results found
                </Typography>
                <List dense>
                  {searchResults.map((food) => (
                    <React.Fragment key={food.fdcId}>
                      <ListItem
                        button
                        selected={selectedFood?.fdcId === food.fdcId}
                        onClick={() => handleSelectFood(food)}
                      >
                        <ListItemText
                          primary={food.description}
                          secondary={food.brandName || food.foodCategory}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </Grid>

          {/* Selected food details */}
          <Grid item xs={12} md={6}>
            {selectedFood && (
              <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
                <Typography variant="h6" fontWeight="bold">
                  {selectedFood.description}
                </Typography>

                {selectedFood.brandName && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {selectedFood.brandName}
                  </Typography>
                )}

                <Chip
                  label={selectedFood.foodCategory}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" gutterBottom>
                  Serving Size
                </Typography>

                <Box sx={{ display: "flex", mb: 3, gap: 1 }}>
                  <TextField
                    label="Amount"
                    type="number"
                    value={servingSize}
                    onChange={(e) => setServingSize(e.target.value)}
                    InputProps={{ inputProps: { min: 0 } }}
                    size="small"
                  />

                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <InputLabel id="serving-unit-label">Unit</InputLabel>
                    <Select
                      labelId="serving-unit-label"
                      value={servingUnit}
                      onChange={(e) => setServingUnit(e.target.value)}
                      label="Unit"
                    >
                      <MenuItem value="g">g</MenuItem>
                      <MenuItem value="ml">ml</MenuItem>
                      <MenuItem value="oz">oz</MenuItem>
                      <MenuItem value="cup">cup</MenuItem>
                      <MenuItem value="tbsp">tbsp</MenuItem>
                      <MenuItem value="tsp">tsp</MenuItem>
                      <MenuItem value="piece">piece</MenuItem>
                      <MenuItem value="slice">slice</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                  Nutrition (based on serving size)
                </Typography>

                <Box sx={{ mb: 2 }}>
                  {(() => {
                    const nutrients = selectedFood.foodNutrients || [];
                    const multiplier = parseFloat(servingSize) / 100;

                    const calories =
                      nutrients.find(
                        (n) =>
                          n.nutrientName === "Energy" ||
                          n.nutrientNumber === "208"
                      )?.value || 0;
                    const protein =
                      nutrients.find(
                        (n) =>
                          n.nutrientName === "Protein" ||
                          n.nutrientNumber === "203"
                      )?.value || 0;
                    const carbs =
                      nutrients.find(
                        (n) =>
                          n.nutrientName === "Carbohydrate, by difference" ||
                          n.nutrientNumber === "205"
                      )?.value || 0;
                    const fat =
                      nutrients.find(
                        (n) =>
                          n.nutrientName === "Total lipid (fat)" ||
                          n.nutrientNumber === "204"
                      )?.value || 0;

                    return (
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Calories:{" "}
                            <strong>{Math.round(calories * multiplier)}</strong>{" "}
                            kcal
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Protein:{" "}
                            <strong>{(protein * multiplier).toFixed(1)}</strong>{" "}
                            g
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Carbs:{" "}
                            <strong>{(carbs * multiplier).toFixed(1)}</strong> g
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Fat:{" "}
                            <strong>{(fat * multiplier).toFixed(1)}</strong> g
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  })()}
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <InfoIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                  Nutrition information from USDA FoodData Central
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleAddFood}
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!selectedFood}
        >
          Add to Meal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FoodSearchModal;
