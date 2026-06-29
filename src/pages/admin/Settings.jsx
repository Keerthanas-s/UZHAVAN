import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Settings as SettingsIcon, Shield, Public, Support } from "@mui/icons-material";
import { toast } from "react-toastify";

function Settings() {
  const [appSettings, setAppSettings] = useState({
    appName: localStorage.getItem("admin_appName") || "UZHAVAN",
    adminEmail: localStorage.getItem("admin_email") || "admin@uzhavan.gov.in",
    commission: localStorage.getItem("admin_commission") || "5",
    smsApi: localStorage.getItem("admin_smsApi") || "API_KEY_UZHAVAN_DEFAULT_2026",
    maintenanceMode: localStorage.getItem("admin_maintenanceMode") === "true",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSaveConfig = () => {
    localStorage.setItem("admin_appName", appSettings.appName);
    localStorage.setItem("admin_email", appSettings.adminEmail);
    localStorage.setItem("admin_commission", appSettings.commission);
    localStorage.setItem("admin_smsApi", appSettings.smsApi);
    localStorage.setItem("admin_maintenanceMode", String(appSettings.maintenanceMode));
    toast.success("System configurations updated successfully!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Security credentials updated successfully!");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <SettingsIcon fontSize="large" /> System Settings ⚙️
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Configure portal security, APMC commission metrics, and support emails.
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column: System Configurations */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px", mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#1b5e20", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Public /> Global Configurations
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Application Name"
                  value={appSettings.appName}
                  onChange={(e) => setAppSettings({ ...appSettings, appName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Admin Support Email"
                  value={appSettings.adminEmail}
                  onChange={(e) => setAppSettings({ ...appSettings, adminEmail: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Platform Commission Rate (%)"
                  type="number"
                  value={appSettings.commission}
                  onChange={(e) => setAppSettings({ ...appSettings, commission: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SMS Alert Gateway API Key"
                  value={appSettings.smsApi}
                  onChange={(e) => setAppSettings({ ...appSettings, smsApi: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={appSettings.maintenanceMode}
                      onChange={(e) => setAppSettings({ ...appSettings, maintenanceMode: e.target.checked })}
                      color="error"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">Maintenance Mode</Typography>
                      <Typography variant="caption" color="text.secondary">Temporarily lock portal access for non-admin accounts</Typography>
                    </Box>
                  }
                />
              </Grid>
            </Grid>

            <Button variant="contained" color="success" onClick={handleSaveConfig} sx={{ mt: 3, borderRadius: "10px", fontWeight: "bold" }}>
              Save System Config
            </Button>
          </Paper>
        </Grid>

        {/* Right Column: Admin Credentials & Help */}
        <Grid item xs={12} md={5}>
          {/* Security Credentials */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px", mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#1b5e20", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Shield /> Security Credentials
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleChangePassword}>
              <TextField
                fullWidth
                required
                type="password"
                label="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                type="password"
                label="New Password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                type="password"
                label="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                sx={{ mb: 3 }}
              />
              <Button type="submit" variant="contained" color="success" sx={{ borderRadius: "10px", fontWeight: "bold" }}>
                Update Credentials
              </Button>
            </form>
          </Paper>

          {/* Helpdesk Support contact details */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px" }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#1b5e20", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Support /> Development Support
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Dev Team email: <strong>tech-support@uzhavan.gov.in</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Version: <strong>v2.0.4-RELEASE</strong>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Settings;