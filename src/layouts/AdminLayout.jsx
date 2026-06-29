import React, { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Drawer,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import {
  Dashboard,
  DashboardOutlined,
  Assessment,
  AssessmentOutlined,
  TrendingUp,
  TrendingUpOutlined,
  Agriculture,
  People,
  PeopleOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
  Settings,
  SettingsOutlined,
  Menu,
  Close,
  Logout,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const drawerWidth = 260;
const globalFont = "system-ui, -apple-system, sans-serif";

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const menuItems = [
    { text: "Dashboard", path: "/admin/dashboard", icon: <DashboardOutlined />, activeIcon: <Dashboard /> },
    { text: "Posts", path: "/admin/posts", icon: <AssessmentOutlined />, activeIcon: <Assessment /> },
    { text: "Prices", path: "/admin/prices", icon: <TrendingUpOutlined />, activeIcon: <TrendingUp /> },
    { text: "Farmers", path: "/admin/farmers", icon: <Agriculture />, activeIcon: <Agriculture /> },
    { text: "Customers", path: "/admin/customers", icon: <PeopleOutlined />, activeIcon: <People /> },
    { text: "Orders", path: "/admin/orders", icon: <ShoppingCartOutlined />, activeIcon: <ShoppingCart /> },
    { text: "Analytics", path: "/admin/analytics", icon: <TrendingUpOutlined />, activeIcon: <TrendingUp /> },
    { text: "Reports", path: "/admin/reports", icon: <AssessmentOutlined />, activeIcon: <Assessment /> },
    { text: "Settings", path: "/admin/settings", icon: <SettingsOutlined />, activeIcon: <Settings /> }
  ];

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3, boxSizing: "border-box" }}>
      {/* Brand Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3.5 }}>
        <Typography
          variant="h5"
          fontWeight="900"
          onClick={() => {
            navigate("/admin/dashboard");
            setMobileOpen(false);
          }}
          sx={{
            color: "#166534",
            fontFamily: globalFont,
            letterSpacing: "-0.8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
            transition: "transform 0.2s",
            "&:hover": { transform: "scale(1.02)" },
          }}
        >
          🌾 Uzhavan
        </Typography>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{ display: { xs: "flex", md: "none" }, border: "1px solid #e2e8f0" }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Admin tag */}
      <Typography variant="caption" sx={{ fontWeight: "800", color: "#64748b", textTransform: "uppercase", fontSize: "0.62rem", letterSpacing: "1.2px", mb: 3, pl: 0.5 }}>
        Admin Portal 🔑
      </Typography>

      {/* Navigation menuItems list */}
      <List sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5, p: 0 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.text}
              component={motion.div}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                py: 1.2,
                px: 2.2,
                position: "relative",
                borderRadius: "12px",
                color: isActive ? "#166534" : "#64748b",
                bgcolor: "transparent",
                transition: "color 0.25s ease",
                overflow: "hidden",
                mb: 0.5,
                "&:hover": {
                  bgcolor: "rgba(22,197,94,0.03)",
                },
              }}
            >
              {/* Vercel-style slide active background indicator */}
              {isActive && (
                <Box
                  component={motion.div}
                  layoutId="activeAdminLinkBg"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(22,197,94,0.06)",
                    borderRadius: "12px",
                    zIndex: 0,
                    border: "1px solid rgba(22,197,94,0.1)",
                  }}
                />
              )}

              {/* Linear-style left active vertical indicator bar */}
              {isActive && (
                <Box
                  component={motion.div}
                  layoutId="activeAdminIndicatorBar"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  sx={{
                    position: "absolute",
                    top: "20%",
                    left: 0,
                    height: "60%",
                    width: 3.5,
                    bgcolor: "#166534",
                    borderRadius: "0 4px 4px 0",
                    zIndex: 2,
                  }}
                />
              )}

              <ListItemIcon
                sx={{
                  minWidth: 36,
                  color: isActive ? "#166534" : "#64748b",
                  zIndex: 1,
                  transition: "transform 0.2s",
                }}
              >
                {isActive ? item.activeIcon : item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "1.02rem",
                  fontWeight: isActive ? "800" : "600",
                  fontFamily: globalFont,
                  zIndex: 1,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Logout button */}
      <Box sx={{ pt: 2, borderTop: "1px solid #e2e8f0" }}>
        <ListItemButton
          onClick={logout}
          component={motion.div}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          sx={{
            borderRadius: "12px",
            color: "#ef4444",
            px: 2.2,
            py: 1.2,
            transition: "all 0.2s",
            "& .MuiListItemIcon-root": {
              color: "#ef4444",
              minWidth: 36,
            },
            "&:hover": {
              bgcolor: "rgba(239,68,68,0.06)",
            }
          }}
        >
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontWeight: "800",
              fontSize: "1.02rem",
              fontFamily: globalFont,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh", fontFamily: globalFont }}>
      {/* Mobile Top Header Navigation Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { xs: "block", md: "none" },
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          zIndex: 1090,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, color: "#166534", border: "1px solid #e2e8f0", borderRadius: "10px", p: 0.8 }}
            >
              <Menu />
            </IconButton>
            <Typography
              variant="h6"
              fontWeight="900"
              sx={{ color: "#166534", letterSpacing: "-0.5px", fontFamily: globalFont, cursor: "pointer" }}
              onClick={() => navigate("/admin/dashboard")}
            >
              🌾 Uzhavan
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              onClick={() => navigate("/admin/settings")}
              sx={{ width: 34, height: 34, bgcolor: "#166534", fontSize: "0.85rem", fontWeight: "bold", cursor: "pointer" }}
            >
              A
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar navigation drawers */}
      {/* 1. Temporary Collapsible Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile devices
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "1px solid #e2e8f0" },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 2. Permanent Desktop Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, borderRight: "1px solid #e2e8f0", bgcolor: "#ffffff" },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: "64px", md: 0 }, // Add top padding on mobile to clear the AppBar
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;