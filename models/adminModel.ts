import mongoose from 'mongoose';

// Define the Admin Schema
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    firstName: { type: String },
    lastName: { type: String },
    role: {
        type: String,
        enum: ['admin', 'super-admin'],
        default: 'admin',
    },

    // Permissions for Admin Actions
    permissions: {
        manageUsers: { type: Boolean, default: true }, 
        manageWorkouts: { type: Boolean, default: true },
        manageExercises: { type: Boolean, default: true },
        viewAnalytics: { type: Boolean, default: true },
        sendNotifications: { type: Boolean, default: true },
        configureSettings: { type: Boolean, default: true },
    },
});

// Define Schema Methods
adminSchema.methods.canManageUsers = function () {
    return this.permissions.manageUsers;
};

adminSchema.methods.canManageWorkouts = function () {
    return this.permissions.manageWorkouts;
};

adminSchema.methods.canViewAnalytics = function () {
    return this.permissions.viewAnalytics;
};

adminSchema.methods.canSendNotifications = function () {
    return this.permissions.sendNotifications;
};

adminSchema.methods.canConfigureSettings = function () {
    return this.permissions.configureSettings;
};

// Create the Admin model
const Admin = mongoose.model('Admin', adminSchema);

export default Admin;  // Use ES module syntax
