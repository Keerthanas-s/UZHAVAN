import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  Divider,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { toast } from "react-toastify";
import customerApi from "../../api/customerApi";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    district: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = () => {
    setLoading(true);
    customerApi
      .getProfile()
      .then((res) => {
        if (res.data) {
          setProfile({
            name: res.data.name || "",
            email: res.data.email || "",
            phoneNumber: res.data.phoneNumber || "",
            district: res.data.district || "",
            address: res.data.address || "",
          });
        }
      })
      .catch((err) => {
        console.error("Failed to load customer profile:", err);
        toast.error("Failed to load profile from database");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await customerApi.updateProfile(profile);
      toast.success("Profile saved successfully in database!");
      setIsEditing(false);
      loadProfile();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile changes");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 4 }}>
        Customer Profile 👤
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0", borderRadius: "16px", textAlign: "center" }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: "#2e7d32",
                mx: "auto",
                mb: 2,
                fontSize: "2rem",
                boxShadow: "0 4px 12px rgba(46,125,50,0.3)",
                fontWeight: "bold",
              }}
            >
              {profile.name ? profile.name.substring(0, 2).toUpperCase() : "CS"}
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              {profile.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Customer Account
            </Typography>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 2, py: 0.5, bgcolor: "#e8f5e9", color: "#2e7d32", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "bold", mb: 2 }}>
              <CheckCircle fontSize="small" /> Buyer Verified
            </Box>
            <Divider sx={{ my: 2 }} />
            <Button
              fullWidth
              variant="outlined"
              color="error"
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              sx={{ borderRadius: "10px", fontWeight: "bold" }}
            >
              Logout Account
            </Button>
          </Paper>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4, border: "1px solid #e0e0e0", borderRadius: "16px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#1b5e20" }}>
                Account Information
              </Typography>
              <Button
                variant={isEditing ? "contained" : "outlined"}
                color="success"
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                sx={{ borderRadius: "10px" }}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled={!isEditing}
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled
                  label="Email Address"
                  value={profile.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled={!isEditing}
                  label="Phone Number"
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  disabled={!isEditing}
                  label="District/City"
                  value={profile.district}
                  onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  disabled={!isEditing}
                  multiline
                  rows={2}
                  label="Delivery Address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Profile;