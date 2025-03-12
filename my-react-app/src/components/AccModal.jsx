import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  Divider,
  Link,
  Box,
} from "@mui/material";
import { Google, PersonAdd, Email, Lock } from "@mui/icons-material";
import { motion } from "framer-motion";
import logo from "../assets/react.svg";

export default function AccModal({ open, onClose }) {
  const [email, setEmail] = useState("");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3,
          border: "2px solid #D4AF37",
          padding: 2,
        },
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{ textAlign: "center", marginBottom: 2 }}>
          <img src={logo} alt="Logo" style={{ width: "50px" }} />
        </Box>
        <DialogTitle sx={{ fontWeight: "bold", textAlign: "center", color: "#D4AF37", fontSize: "1.8rem" }}>
          Welcome
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <DialogContentText sx={{ marginBottom: 3, fontSize: "1rem", color: "text.secondary" }}>
            Sign in or create an account to continue
          </DialogContentText>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{
              marginBottom: 2,
              borderColor: "#D4AF37",
              color: "#D4AF37",
              textTransform: "none",
              fontWeight: "bold",
              '&:hover': { backgroundColor: "#D4AF37", color: "#fff" },
            }}
          >
            Continue with Google
          </Button>

          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder="henry@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputProps={{
              startAdornment: <Email sx={{ marginRight: 1, color: "#D4AF37" }} />,
              sx: { borderRadius: 1 },
            }}
          />

          {email && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                type="password"
                placeholder="Enter your password"
                sx={{ marginBottom: 2 }}
                InputProps={{
                  startAdornment: <Lock sx={{ marginRight: 1, color: "#D4AF37" }} />,
                  sx: { borderRadius: 1 },
                }}
              />
            </motion.div>
          )}

          <Divider sx={{ marginY: 2 }}>or</Divider>

          <Button
            fullWidth
            variant="contained"
            startIcon={<PersonAdd />}
            sx={{
              marginBottom: 2,
              backgroundColor: "#D4AF37",
              color: "#000",
              fontWeight: "bold",
              textTransform: "none",
              '&:hover': { backgroundColor: "#e6b800" },
            }}
          >
            Create New Account
          </Button>

          <Link
            href="#"
            underline="hover"
            sx={{ display: "block", marginTop: 1, color: "#D4AF37", fontWeight: "bold" }}
          >
            Forgot Password?
          </Link>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}