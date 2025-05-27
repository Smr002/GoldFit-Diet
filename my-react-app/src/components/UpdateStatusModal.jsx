"use client";
import React from "react";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UpdateStatusModal = ({
  status = "success",
  message = "",
  title = "", // Add this new prop
  onClose,
  onConfirm,
  mode = "status",
}) => {
  const isSuccess = status === "success";
  const isConfirm = mode === "confirm";

  const modalStyle = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      zIndex: 1050,
    },
    modal: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "32px",
      maxWidth: "400px",
      width: "90%",
      textAlign: "center",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    },
    icon: {
      marginBottom: "16px",
    },
    title: {
      fontSize: "20px",
      fontWeight: 600,
      marginBottom: "12px",
    },
    message: {
      fontSize: "16px",
      color: "#4b5563",
      marginBottom: "20px",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    },
    confirmButton: {
      backgroundColor: "#ef4444",
      marginRight: "12px",
    },
    cancelButton: {
      backgroundColor: "#9ca3af",
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        style={modalStyle.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          style={modalStyle.modal}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 18, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={modalStyle.icon}>
            {isConfirm ? (
              <Trash2 size={48} color="#ef4444" />
            ) : isSuccess ? (
              <CheckCircle size={48} color="#4ade80" />
            ) : (
              <XCircle size={48} color="#ef4444" />
            )}
          </div>

          <div style={modalStyle.title}>
            {isConfirm
              ? "Are you sure?"
              : title || (isSuccess ? "Workout Updated!" : "Update Failed")}
          </div>

          <div style={modalStyle.message}>
            {isConfirm ? "This action cannot be undone." : message}
          </div>

          {isConfirm ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                style={{ ...modalStyle.button, ...modalStyle.confirmButton }}
                onClick={onConfirm}
              >
                Yes, Delete
              </button>
              <button
                style={{ ...modalStyle.button, ...modalStyle.cancelButton }}
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              style={{
                ...modalStyle.button,
                backgroundColor: isSuccess ? "#4ade80" : "#ef4444",
              }}
              onClick={onClose}
            >
              Close
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpdateStatusModal;
