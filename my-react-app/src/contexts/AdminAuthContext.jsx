import React, { createContext, useState, useContext, useEffect } from "react";
import { getAdminById } from "../api";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("Verifying admin status...");
        const payload = JSON.parse(atob(token.split(".")[1]));
        const adminData = await getAdminById(payload.id, token);
        console.log("Admin verification result:", adminData);
        setIsAdmin(adminData && adminData.role === "admin");
      } catch (error) {
        console.error("Admin verification failed:", error);
        setIsAdmin(false);
      }
      setLoading(false);
    };

    verifyAdmin();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAdmin, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
