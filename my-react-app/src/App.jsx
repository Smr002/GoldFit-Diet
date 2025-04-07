import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import HomePage from "../src/pages/HomePage";
import AccModal from "../src/components/AccModal";
import CreateAccount from "./pages/CreateAccount";
import Exercises from "./components/Exercises";
import UserHomePage from "./pages/UserHomePage";

// Admin imports
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import WorkoutManagement from "./pages/admin/WorkoutManagement";
import NotificationManagement from "./pages/admin/NotificationManagement";
import FAQManagement from "./pages/admin/FAQManagement";
import AdminManagement from "./pages/admin/AdminManagement";
import Workout from "./components/UserWorkout";
import AdminProfile from './pages/admin/AdminProfile';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const routes = {
  public: [
    { path: "/", element: (props) => <HomePage {...props} /> },
    { path: "/create-account/*", element: <CreateAccount />, protected: true },
    { path: "/exercises", element: <Exercises />, protected: true },
  ],
  protected: [
    { path: "/user-home", element: <UserHomePage /> },
    { path: "/workouts", element: <Workout /> },
  ],
  admin: [
    { path: "dashboard", element: <Dashboard /> },
    { path: "users", element: <UserManagement /> },
    { path: "workouts", element: <WorkoutManagement /> },
    { path: "notifications", element: <NotificationManagement /> },
    { path: "faqs", element: <FAQManagement /> },
    { path: "profile", element: <AdminProfile />}
  ],
};

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
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
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          {routes.admin.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={Element} />
          ))}
        </Route>

        {/* Super Admin Route */}
        <Route path="/admin" element={<AdminLayout isSuperAdmin={true} />}>
          <Route path="admin-management" element={<AdminManagement />} />
        </Route>
      </Routes>
      <AccModal open={isModalOpen} onClose={() => setModalOpen(false)} />
    </BrowserRouter>
  );
}
