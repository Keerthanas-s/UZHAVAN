import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";

function ResetPassword() {

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {

      setLoading(true);

      await axiosConfig.post("/auth/reset-password", {
        token,
        password: form.password
      });

      toast.success("Password reset successfully");

      navigate("/login");

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Password reset failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: "#eef7ee" }}
    >

      <Paper
        elevation={8}
        sx={{
          width: 420,
          padding: 4,
          borderRadius: 3
        }}
      >

        <Typography
          variant="h4"
          align="center"
          color="success.main"
          gutterBottom
        >
          🌾 UZHAVAN
        </Typography>

        <Typography
          align="center"
          sx={{ mb: 3 }}
        >
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit}>

          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="New Password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
          >

            {
              loading
                ?
                <CircularProgress size={24} color="inherit" />
                :
                "RESET PASSWORD"
            }

          </Button>

        </form>

      </Paper>

    </Box>

  );

}

export default ResetPassword;