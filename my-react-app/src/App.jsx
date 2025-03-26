import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import React, { useState } from "react";
import HomePage from "../src/pages/HomePage";
import AccModal from "../src/components/AccModal";
import CreateAccount from "./pages/CreateAccount";
import Exercises from "./components/Exercises";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import WorkoutManagement from "./pages/admin/WorkoutManagement";
import NotificationManagement from "./pages/admin/NotificationManagement";
import FAQManagement from "./pages/admin/FAQManagement";
import AdminManagement from "./pages/admin/AdminManagement";

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage isModalOpen={isModalOpen} setModalOpen={setModalOpen} />
          }
        />
        <Route path="/create-account/*" element={<CreateAccount />} />
        <Route path="/exercises" element={<Exercises />} />

        {/* Admin Routes */}
                <Route path="/admin/*" element={<AdminLayout />}>
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<UserManagement />} />
                  <Route path="workouts" element={<WorkoutManagement />} />
                  <Route path="notifications" element={<NotificationManagement />} />
                  <Route path="faqs" element={<FAQManagement />} />
                </Route>
                
                {/* Super Admin Routes */}
                <Route path="/admin" element={<AdminLayout isSuperAdmin={true} />}>
                  <Route path="admin-management" element={<AdminManagement />} />
                </Route>
      </Routes>
      <AccModal open={isModalOpen} onClose={() => setModalOpen(false)} />
    </BrowserRouter>
  );
}
