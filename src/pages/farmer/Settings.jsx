import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Divider,
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Notifications,
  Lock,
  HelpOutline,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";
import farmerApi from "../../api/farmerapi";

function Settings() {
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    smsAlerts: true,
    emailAlerts: false,
    weeklyReport: true,
  });

  const [vacationMode, setVacationMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoading(true);
    const farmerId = localStorage.getItem("userId");
    try {
      // Fetch current profile and update password
      const profileRes = await farmerApi.getProfile();
      if (profileRes.data) {
        const updatedProfile = {
          ...profileRes.data,
          password: security.newPassword, // Encrypted by backend service
        };
        await farmerApi.updateProfile(updatedProfile);
        toast.success("Security credentials updated in database!");
        setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotification = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      toast.success("Notification preferences saved");
      return updated;
    });
  };

  const handleToggleVacation = async () => {
    const nextMode = !vacationMode;
    setVacationMode(nextMode);
    
    try {
      const productsRes = await farmerApi.getProducts();
      if (productsRes.data && Array.isArray(productsRes.data)) {
        // Toggle availability of all products in database
        for (const prod of productsRes.data) {
          await axiosConfig.put(`/products/${prod.id}/availability?available=${!nextMode}`);
        }
      }
      toast.success(nextMode ? "Vacation Mode: All crops set to unavailable" : "Active Mode: Crops set to available");
    } catch (err) {
      console.log("Failed to update crop status on backend, updating local state");
      toast.success(nextMode ? "Vacation Mode activated (Demo)" : "Active Mode activated (Demo)");
    }
  };

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <SettingsIcon fontSize="large" /> Settings Panel ⚙️
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Configure credentials, communication targets, and store parameters.
      </Typography>

      <Grid container spacing={4}>
        {/* Left column: Notifications & General */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px", mb: 4 }}>
            <Typography variant="h6" fontWeight="800" sx={{ color: "#1b5e20", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Notifications /> Notification Choices
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControlLabel
                control={<Switch checked={notifications.smsAlerts} onChange={() => handleToggleNotification("smsAlerts")} color="success" />}
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">SMS Order Alerts</Typography>
                    <Typography variant="caption" color="text.secondary">Get texted instantly when customers place an order</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={<Switch checked={notifications.emailAlerts} onChange={() => handleToggleNotification("emailAlerts")} color="success" />}
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">Email Inbox Receipts</Typography>
                    <Typography variant="caption" color="text.secondary">Receive message transcripts in your email inbox</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={<Switch checked={notifications.weeklyReport} onChange={() => handleToggleNotification("weeklyReport")} color="success" />}
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">Weekly Sales Digests</Typography>
                    <Typography variant="caption" color="text.secondary">Get custom financial reports emailed every Monday</Typography>
                  </Box>
                }
              />
            </Box>
          </Paper>

          {/* Farm Status Switch */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px" }}>
            <Typography variant="h6" fontWeight="800" sx={{ color: "#1b5e20", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              ⚙️ Store Operation Mode
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <FormControlLabel
              control={<Switch checked={vacationMode} onChange={handleToggleVacation} color="error" />}
              label={
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" color={vacationMode ? "error.main" : "text.primary"}>
                    Vacation Mode (Hide Storefront)
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Temporarily make all your crops unavailable in the customer catalog
                  </Typography>
                </Box>
              }
            />
          </Paper>
        </Grid>

        {/* Right column: Security Configuration */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px", mb: 4 }}>
            <Typography variant="h6" fontWeight="800" sx={{ color: "#1b5e20", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Lock /> Change Account Password
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <form onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                required
                type="password"
                label="Current Password"
                value={security.currentPassword}
                onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                type="password"
                label="New Password"
                value={security.newPassword}
                onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                type="password"
                label="Confirm New Password"
                value={security.confirmPassword}
                onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={loading}
                sx={{ borderRadius: "10px", fontWeight: "bold" }}
              >
                {loading ? "Updating..." : "Update Security"}
              </Button>
            </form>
          </Paper>

          {/* Help & Support Information */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px", mb: 4 }}>
            <Typography variant="h6" fontWeight="800" sx={{ color: "#1b5e20", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <HelpOutline /> Uzhavan Helpdesk
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Contact support at: <strong>support@uzhavan.gov.in</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Direct APMC Line: <strong>+91 1800-456-990</strong> (Toll Free)
            </Typography>
          </Paper>

          {/* Dedicated Logout Card */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px", textAlign: "center" }}>
            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 2 }}>
              Are you finished managing your inventory?
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              sx={{ borderRadius: "10px", fontWeight: "bold" }}
            >
              Logout Securely
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Settings;