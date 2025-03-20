import mongoose from 'mongoose';

// Define the Badge Schema
const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Name of the badge
    description: { type: String, required: true }, // Short description of the badge
    criteria: { type: String, required: true }, // How the badge is earned
    iconUrl: { type: String }, // URL for the badge icon
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

// Create and export the Badge model
const Badge = mongoose.model('Badge', badgeSchema);

export default Badge; // Use ES module syntax
