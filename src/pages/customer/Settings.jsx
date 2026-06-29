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
import customerApi from "../../api/customerApi";

function Settings() {
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    smsAlerts: true,
    emailAlerts: false,
    orderUpdates: true,
  });

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
    try {
      // Fetch current profile and update password
      const profileRes = await customerApi.getProfile();
      if (profileRes.data) {
        const updatedProfile = {
          ...profileRes.data,
          password: security.newPassword,
        };
        await customerApi.updateProfile(updatedProfile);
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

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <SettingsIcon fontSize="large" /> Settings Panel ⚙️
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Configure credentials, order alerts, and communication preferences.
      </Typography>

      <Grid container spacing={4}>
        {/* Left column: Notifications & Account */}
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
                    <Typography variant="subtitle2" fontWeight="bold">SMS Order Delivery Updates</Typography>
                    <Typography variant="caption" color="text.secondary">Get texted instantly when farmers ship your crops</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={<Switch checked={notifications.emailAlerts} onChange={() => handleToggleNotification("emailAlerts")} color="success" />}
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">Email Receipts</Typography>
                    <Typography variant="caption" color="text.secondary">Receive message transcripts in your email inbox</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={<Switch checked={notifications.orderUpdates} onChange={() => handleToggleNotification("orderUpdates")} color="success" />}
                label={
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">Weekly Recommendations</Typography>
                    <Typography variant="caption" color="text.secondary">Receive agricultural produce catalog updates</Typography>
                  </Box>
                }
              />
            </Box>
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
        </Grid>

        {/* Right column: Security Configuration & Logout */}
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

          {/* Dedicated Logout Card */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px", textAlign: "center" }}>
            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 2 }}>
              Are you finished shopping for fresh harvest?
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleLogout}
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
