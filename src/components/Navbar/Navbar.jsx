import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Box
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search,
  Notifications,
  Mail,
  AccountCircle,
  Logout,
  Settings
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";
import "./Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarLetter, setAvatarLetter] = useState("U");
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [searchVal, setSearchVal] = useState("");

  const role = localStorage.getItem("role") || "CUSTOMER";
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    // 1. Fetch user profile for avatar letter
    if (role === "FARMER") {
      axiosConfig.get(`/farmers/${userId}`)
        .then(res => {
          if (res.data && res.data.name) {
            setAvatarLetter(res.data.name.substring(0, 1).toUpperCase());
          }
        })
        .catch(err => console.error(err));
    } else if (role === "CUSTOMER") {
      axiosConfig.get(`/customers/${userId}`)
        .then(res => {
          if (res.data && res.data.name) {
            setAvatarLetter(res.data.name.substring(0, 1).toUpperCase());
          }
        })
        .catch(err => console.error(err));
    } else {
      setAvatarLetter("A");
    }

    // 2. Fetch unread messages count from DMs
    const fetchUnreadCount = () => {
      if (role === "ADMIN") return; // Admin has no inbox
      axiosConfig.get(`/messages/inbox?receiverType=${role}&receiverId=${userId}`)
        .then(res => {
          if (res.data && Array.isArray(res.data)) {
            const count = res.data.filter(m => !m.read).length;
            setUnreadMsgCount(count);
          }
        })
        .catch(err => console.error(err));
    };

    // 3. Fetch notifications / active pending orders count
    const fetchOrdersCount = () => {
      if (role === "FARMER") {
        axiosConfig.get(`/orders/farmer/${userId}`)
          .then(res => {
            if (res.data && Array.isArray(res.data)) {
              const pending = res.data.filter(o => o.status === "PENDING").length;
              setNotificationCount(pending);
            }
          })
          .catch(err => console.error(err));
      } else if (role === "CUSTOMER") {
        axiosConfig.get(`/orders/customer/${userId}`)
          .then(res => {
            if (res.data && Array.isArray(res.data)) {
              const active = res.data.filter(o => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "SHIPPED").length;
              setNotificationCount(active);
            }
          })
          .catch(err => console.error(err));
      } else {
        // Admin
        axiosConfig.get("/orders")
          .then(res => {
            if (res.data && Array.isArray(res.data)) {
              const pending = res.data.filter(o => o.status === "PENDING").length;
              setNotificationCount(pending);
            }
          })
          .catch(err => console.error(err));
      }
    };

    fetchUnreadCount();
    fetchOrdersCount();

    // Set polling interval for live counts sync
    const timer = setInterval(() => {
      fetchUnreadCount();
      fetchOrdersCount();
    }, 4000);

    return () => clearInterval(timer);
  }, [role, userId]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (role === "FARMER") {
        navigate(`/farmer/products?search=${encodeURIComponent(searchVal)}`);
      } else if (role === "CUSTOMER") {
        navigate(`/customer/products?search=${encodeURIComponent(searchVal)}`);
      } else {
        // Admins search farmers or customers directory based on active location
        if (location.pathname.includes("customers")) {
          navigate(`/admin/customers?search=${encodeURIComponent(searchVal)}`);
        } else {
          navigate(`/admin/farmers?search=${encodeURIComponent(searchVal)}`);
        }
      }
    }
  };

  const handleMessagesClick = () => {
    if (role === "ADMIN") {
      toast.info("Admin messaging is managed through dynamic crop posts moderation.");
      navigate("/admin/dashboard");
    } else {
      navigate(`/${role.toLowerCase()}/messages`);
    }
  };

  const handleProfileClick = () => {
    if (role === "ADMIN") {
      navigate("/admin/settings");
    } else {
      navigate(`/${role.toLowerCase()}/profile`);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <AppBar position="fixed" className="navbar" elevation={2}>
      <Toolbar className="toolbar">

        {/* Left Section */}
        <Box className="leftSection">
          <IconButton color="inherit" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" className="logo" onClick={() => navigate(`/${role.toLowerCase()}/dashboard`)} sx={{ cursor: "pointer" }}>
            🌾 UZHAVAN
          </Typography>
        </Box>

        {/* Dynamic Search Box */}
        <Box className="searchBox">
          <IconButton onClick={handleSearchSubmit} sx={{ p: 0.5, color: "inherit" }}>
            <Search className="searchIcon" />
          </IconButton>
          <InputBase
            placeholder="Search products, farmers..."
            className="searchInput"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
        </Box>

        {/* Right Section */}
        <Box className="rightSection">
          {/* Bell Notifications Badge */}
          <IconButton
            color="inherit"
            onClick={() => navigate(role === "CUSTOMER" ? "/customer/notifications" : `/${role.toLowerCase()}/orders`)}
          >
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

           {/* Mail Messages Badge */}
          <IconButton
            color="inherit"
            onClick={handleMessagesClick}
          >
            <Badge badgeContent={unreadMsgCount} color="error">
              <Mail />
            </Badge>
          </IconButton>

          {/* User Profile Avatar */}
          <IconButton color="inherit" onClick={handleOpen}>
            <Avatar sx={{ bgcolor: "#2E7D32" }}>
              {avatarLetter}
            </Avatar>
          </IconButton>

          <IconButton color="error" onClick={logout} title="Logout" sx={{ ml: 1 }}>
            <Logout />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { handleClose(); handleProfileClick(); }}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); navigate(`/${role.toLowerCase()}/settings`); }}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <MenuItem onClick={logout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;