import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import HomePage from "../src/pages/HomePage";
import AccModal from "../src/components/AccModal";
import CreateAccount from "./pages/CreateAccount";
import Exercises from "./components/Exercises";
import UserHomePage from "./pages/UserHomePage";
import NutritionPage from "./pages/NutritionPage"; // Add this import
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import WorkoutManagement from "./pages/admin/WorkoutManagement";
import NotificationManagement from "./pages/admin/NotificationManagement";
import FAQManagement from "./pages/admin/FAQManagement";
import AdminManagement from "./pages/admin/AdminManagement";
import Workout from "./components/UserWorkout";
import AdminProfile from "./pages/admin/AdminProfile";
import Profile from "./components/Profile";
import Checkout from "./components/Checkout";
import { AdminAuthProvider, useAdminAuth } from "./contexts/AdminAuthContext";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAdminAuth();
  const token = localStorage.getItem("token");

  console.log("Admin Route Check:", { isAdmin, loading, hasToken: !!token });

  if (!token) {
    console.log("No token, redirecting to login");
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    console.log("Not admin, redirecting to user home");
    return <Navigate to="/user-home" replace />;
  }

  return children;
};

const routes = {
  public: [
    { path: "/", element: (props) => <HomePage {...props} /> },
    { path: "/create-account/*", element: <CreateAccount /> },
  ],
  protected: [
    { path: "/exercises", element: <Exercises /> },
    { path: "/user-home", element: <UserHomePage /> },
    { path: "/workouts", element: <Workout /> },
    { path: "/nutrition", element: <NutritionPage /> },
    { path: "/user-profile", element: <Profile /> },
    { path: "/checkout", element: <Checkout /> },
  ],
  admin: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "users", element: <UserManagement /> },
    { path: "workouts", element: <WorkoutManagement /> },
    { path: "notifications", element: <NotificationManagement /> },
    { path: "faqs", element: <FAQManagement /> },
    { path: "profile", element: <AdminProfile /> },
  ],
};

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          {routes.public.map(
            ({ path, element: Element, protected: isProtected }) => (
              <Route
                key={path}
                path={path}
                element={
                  path === "/" ? (
                    <Element
                      isModalOpen={isModalOpen}
                      setModalOpen={setModalOpen}
                    />
                  ) : isProtected ? (
                    <ProtectedRoute>{Element}</ProtectedRoute>
                  ) : (
                    Element
                  )
                }
              />
            )
          )}

          {/* Protected Routes */}
          {routes.protected.map(({ path, element: Element }) => (
            <Route
              key={path}
              path={path}
              element={<ProtectedRoute>{Element}</ProtectedRoute>}
            />
          ))}

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            {routes.admin.map(({ path, element: Element }) => (
              <Route
                key={path}
                path={path}
                element={<AdminProtectedRoute>{Element}</AdminProtectedRoute>}
              />
            ))}
          </Route>

          {/* Super Admin Route */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout isSuperAdmin={true} />
              </AdminProtectedRoute>
            }
          >
            <Route
              path="admin-management"
              element={
                <AdminProtectedRoute>
                  <AdminManagement />
                </AdminProtectedRoute>
              }
            />
          </Route>
        </Routes>
        <AccModal open={isModalOpen} onClose={() => setModalOpen(false)} />
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
