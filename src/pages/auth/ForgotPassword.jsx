import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);
      await axiosConfig.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your email");
      setEmail("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
      <Paper elevation={4} sx={{ p: 4, width: 380 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Forgot Password
        </Typography>

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;