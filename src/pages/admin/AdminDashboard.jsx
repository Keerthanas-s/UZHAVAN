import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  People,
  Agriculture,
  ShoppingCart,
  MonetizationOn,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";
import adminApi from "../../api/adminApi";

const globalFont = "system-ui, -apple-system, sans-serif";

function AdminDashboard() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    totalFarmers: 0,
    totalCustomers: 0,
    pendingFarmers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [topProductsData, setTopProductsData] = useState([
    { name: "Vegetables", sales: 0 },
    { name: "Fruits", sales: 0 },
    { name: "Grains", sales: 0 },
    { name: "Pulses", sales: 0 },
  ]);
  const [orderOverviewData, setOrderOverviewData] = useState([]);

  const messagesData = [
    { name: "Farmers", value: metrics.totalFarmers, color: "#166534" },
    { name: "Customers", value: metrics.totalCustomers, color: "#3b82f6" },
  ];

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await adminApi.getDashboard();
      const ordersRes = await axiosConfig.get("/orders");
      const pendingRes = await adminApi.getPendingFarmers();

      const totalFarmers = statsRes.data?.totalFarmers || 0;
      const totalCustomers = statsRes.data?.totalCustomers || 0;
      const pendingFarmers = statsRes.data?.pendingFarmers || 0;

      const ordersList = ordersRes.data || [];
      const totalOrders = ordersList.length;
      const totalRevenue = ordersList
        .filter((o) => o.status === "DELIVERED" || o.status === "COMPLETED")
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      const last7Days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        last7Days.push({ name: label, orders: 0 });
      }

      ordersList.forEach((o) => {
        if (o.orderDate) {
          const orderLabel = new Date(o.orderDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const match = last7Days.find((day) => day.name === orderLabel);
          if (match) {
            match.orders += 1;
          }
        }
      });
      setOrderOverviewData(last7Days);

      const categoryMap = { Vegetables: 0, Fruits: 0, Grains: 0, Pulses: 0 };
      ordersList.forEach((o) => {
        if (o.product && o.product.category) {
          const rawCat = o.product.category;
          const cat = rawCat.charAt(0).toUpperCase() + rawCat.slice(1).toLowerCase();
          categoryMap[cat] = (categoryMap[cat] || 0) + (o.orderedQuantity || 0);
        }
      });
      const topData = Object.keys(categoryMap).map((cat) => ({
        name: cat,
        sales: categoryMap[cat],
      }));
      setTopProductsData(topData);

      setMetrics({
        totalFarmers,
        totalCustomers,
        pendingFarmers,
        totalOrders,
        totalRevenue,
      });

      if (pendingRes.data && Array.isArray(pendingRes.data)) {
        setFarmers(pendingRes.data);
      }
    } catch (error) {
      console.error("Failed to load admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const approveFarmer = async (id) => {
    try {
      await adminApi.approveFarmer(id);
      toast.success("Farmer Verified & Approved Successfully");
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve farmer");
    }
  };

  const rejectFarmer = async (id) => {
    if (!window.confirm("Are you sure you want to reject this registration request?")) return;
    try {
      await adminApi.rejectFarmer(id);
      toast.success("Registration request rejected & removed");
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject farmer request");
    }
  };

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)", minHeight: "100vh", fontFamily: globalFont }}>
      <Box sx={{ maxWidth: "1280px", mx: "auto", width: "100%" }}>
        
        {/* Page Header */}
        <Box sx={{ mb: 4.5 }}>
          <Typography variant="h4" fontWeight="900" sx={{ color: "#166534", display: "flex", alignItems: "center", fontFamily: globalFont, letterSpacing: "-0.8px" }}>
            Admin Dashboard (Full Control) <span style={{ fontSize: "1.8rem", marginLeft: "12px", display: "inline-block" }}>🔑</span>
          </Typography>
        </Box>

        {/* 5 Summary Cards Grid (xs=12, sm=6, md=2.4) */}
        <Grid container spacing={3} sx={{ mb: 4.5 }}>
          {[
            { title: "Total Users", value: metrics.totalFarmers + metrics.totalCustomers, label: "Registered accounts", icon: <People sx={{ color: "#166534", fontSize: 20 }} />, bg: "#f0fdf4" },
            { title: "Farmers", value: metrics.totalFarmers, label: "Sellers database", icon: <Agriculture sx={{ color: "#3b82f6", fontSize: 20 }} />, bg: "#f0f9ff" },
            { title: "Customers", value: metrics.totalCustomers, label: "Buyers database", icon: <People sx={{ color: "#8b5cf6", fontSize: 20 }} />, bg: "#faf5ff" },
            { title: "Orders (Total)", value: metrics.totalOrders, label: "Completed sales logs", icon: <ShoppingCart sx={{ color: "#f59e0b", fontSize: 20 }} />, bg: "#fffbeb" },
            { title: "Revenue (All time)", value: `₹${metrics.totalRevenue.toLocaleString()}`, label: "Net APMC turnover", icon: <MonetizationOn sx={{ color: "#ef4444", fontSize: 20 }} />, bg: "#fef2f2" },
          ].map((card, idx) => (
            <Grid item xs={12} sm={6} md={2.4} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid #e2e8f0",
                  borderRadius: "16px",
                  background: "#ffffff",
                  boxShadow: "0 1px 3px 0 rgba(0,0,0,0.02)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxSizing: "border-box",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 25px rgba(22,101,52,0.05)",
                    borderColor: "#81c784"
                  }
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.2, gap: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight="800" sx={{ fontFamily: globalFont, fontSize: "0.7rem", letterSpacing: "0.6px" }}>
                    {card.title.toUpperCase()}
                  </Typography>
                  <Box sx={{ 
                    width: 36, 
                    height: 36, 
                    borderRadius: "50%", 
                    bgcolor: card.bg, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    flexShrink: 0
                  }}>
                    {card.icon}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="900" sx={{ mb: 0.5, color: "#0f172a", fontFamily: globalFont, letterSpacing: "-1px" }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: globalFont, fontWeight: "600", fontSize: "0.72rem" }}>
                    {card.label}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* 3 Charts Grid occupying the full 12-column width (xs=12, sm=6, md=4) */}
        <Grid container spacing={4} sx={{ mb: 4.5 }}>
          {/* Orders Area Chart */}
          <Grid item xs={12} sm={6} md={4} sx={{ minWidth: 0 }}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #e2e8f0", borderRadius: "16px", height: 380, bgcolor: "#ffffff", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight="900" sx={{ color: "#166534", mb: 0.5, fontFamily: globalFont, textAlign: "center", fontSize: "1.22rem" }}>
                  Orders Trend Chart
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                  <Typography variant="h4" fontWeight="900" sx={{ color: "#166534", fontFamily: globalFont, letterSpacing: "-1px" }}>
                    {metrics.totalOrders}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ fontFamily: globalFont, textTransform: "uppercase", fontSize: "0.68rem" }}>
                    Total Orders
                  </Typography>
                  <Typography variant="caption" color="success.main" fontWeight="800" sx={{ fontFamily: globalFont, fontSize: "0.68rem", ml: "auto" }}>
                    Peak: Mon (▲ 12.5% Up)
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ width: "100%", height: 250, mt: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={orderOverviewData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#166534" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#166534" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b", fontFamily: globalFont, fontWeight: "700" }} height={30} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b", fontFamily: globalFont, fontWeight: "700" }} />
                    <Tooltip contentStyle={{ fontFamily: globalFont, borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                    <Area type="monotone" dataKey="orders" stroke="#166534" strokeWidth={2.5} fillOpacity={1} fill="url(#colorOrders)" dot={{ r: 4, strokeWidth: 1 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Top Category Products */}
          <Grid item xs={12} sm={6} md={4} sx={{ minWidth: 0 }}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #e2e8f0", borderRadius: "16px", height: 380, bgcolor: "#ffffff", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight="900" sx={{ color: "#166534", mb: 0.5, fontFamily: globalFont, textAlign: "center", fontSize: "1.22rem" }}>
                  Sales by Categories
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                  <Typography variant="h4" fontWeight="900" sx={{ color: "#166534", fontFamily: globalFont, letterSpacing: "-1px" }}>
                    {topProductsData.reduce((sum, item) => sum + item.sales, 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ fontFamily: globalFont, textTransform: "uppercase", fontSize: "0.68rem" }}>
                    Units Sold
                  </Typography>
                  <Typography variant="caption" color="#166534" fontWeight="800" sx={{ fontFamily: globalFont, fontSize: "0.68rem", ml: "auto" }}>
                    Top Cat: Vegetables
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ width: "100%", height: 250, mt: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b", fontFamily: globalFont, fontWeight: "700" }} interval={0} height={30} />
                    <YAxis tick={{ fontSize: 10, fill: "#64748b", fontFamily: globalFont, fontWeight: "700" }} />
                    <Tooltip contentStyle={{ fontFamily: globalFont, borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="sales" fill="#22c55e" radius={[6, 6, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Users Ratio pie chart */}
          <Grid item xs={12} sm={6} md={4} sx={{ minWidth: 0 }}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #e2e8f0", borderRadius: "16px", height: 380, bgcolor: "#ffffff", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight="900" sx={{ color: "#166534", mb: 0.5, fontFamily: globalFont, textAlign: "center", fontSize: "1.22rem" }}>
                  Users Ratio
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                  <Typography variant="h4" fontWeight="900" sx={{ color: "#166534", fontFamily: globalFont, letterSpacing: "-1px" }}>
                    {metrics.totalFarmers + metrics.totalCustomers}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ fontFamily: globalFont, textTransform: "uppercase", fontSize: "0.68rem" }}>
                    Total Accounts
                  </Typography>
                  <Typography variant="caption" color="primary.main" fontWeight="800" sx={{ fontFamily: globalFont, fontSize: "0.68rem", ml: "auto", color: "#166534" }}>
                    Ratio: 4:1 (Active)
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 250, mt: 1, px: 1 }}>
                {/* Left side: Doughnut Chart with centered text */}
                <Box sx={{ width: 130, height: 130, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={messagesData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={42}
                        outerRadius={56}
                        paddingAngle={3}
                      >
                        {messagesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Centered label inside doughnut showing dominant ratio */}
                  <Box sx={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <Typography variant="h5" fontWeight="900" sx={{ color: "#166534", fontFamily: globalFont, lineHeight: 1.1 }}>
                      {((metrics.totalFarmers / (metrics.totalFarmers + metrics.totalCustomers || 1)) * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight="800" sx={{ fontSize: "0.55rem", textTransform: "uppercase" }}>
                      Farmers
                    </Typography>
                  </Box>
                </Box>

                {/* Right side: Vertical Legend List with spacing */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {messagesData.map((d, i) => {
                    const total = metrics.totalFarmers + metrics.totalCustomers || 1;
                    const percent = ((d.value / total) * 100).toFixed(0);
                    return (
                      <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: d.color, mr: 1.5, flexShrink: 0 }} />
                        <Typography variant="body2" fontWeight="700" sx={{ color: "#475569", fontFamily: globalFont, fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                          {d.name}: <span style={{ color: "#0f172a", fontWeight: "950" }}>{d.value} ({percent}%)</span>
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Full-Width Pending Farmers Verification Table */}
        <Paper elevation={0} sx={{ p: 3.5, border: "1px solid #e2e8f0", borderRadius: "16px", bgcolor: "#ffffff", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.02)" }}>
          <Typography variant="h6" fontWeight="900" sx={{ mb: 3, color: "#166534", fontFamily: globalFont }}>
            Pending Farmer Verification Requests ({farmers.length})
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress color="success" />
            </Box>
          ) : farmers.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  <TableCell sx={{ fontWeight: "800", fontFamily: globalFont, color: "#475569" }}>Request ID</TableCell>
                  <TableCell sx={{ fontWeight: "800", fontFamily: globalFont, color: "#475569" }}>Farmer Name</TableCell>
                  <TableCell sx={{ fontWeight: "800", fontFamily: globalFont, color: "#475569" }}>Email Address</TableCell>
                  <TableCell sx={{ fontWeight: "800", fontFamily: globalFont, color: "#475569" }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: "800", fontFamily: globalFont, color: "#475569" }}>District</TableCell>
                  <TableCell sx={{ fontWeight: "800", fontFamily: globalFont, color: "#475569" }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {farmers.map((farmer) => (
                  <TableRow key={farmer.id} sx={{ "&:hover": { bgcolor: "#f8fafc" }, transition: "background 0.2s" }}>
                    <TableCell sx={{ fontFamily: globalFont, fontWeight: "600" }}>#{farmer.id}</TableCell>
                    <TableCell sx={{ fontWeight: "800", fontFamily: globalFont, color: "#0f172a" }}>{farmer.name}</TableCell>
                    <TableCell sx={{ fontFamily: globalFont, fontWeight: "600", color: "#475569" }}>{farmer.email}</TableCell>
                    <TableCell sx={{ fontFamily: globalFont, fontWeight: "600", color: "#475569" }}>{farmer.phoneNumber}</TableCell>
                    <TableCell sx={{ fontFamily: globalFont, fontWeight: "600", color: "#475569" }}>{farmer.district}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<CheckCircle sx={{ fontSize: 16 }} />}
                        onClick={() => approveFarmer(farmer.id)}
                        sx={{ 
                          mr: 1.5, 
                          borderRadius: "8px", 
                          fontWeight: "800", 
                          fontFamily: globalFont, 
                          textTransform: "none", 
                          bgcolor: "#f0fdf4",
                          color: "#166534",
                          border: "1px solid #bbf7d0",
                          px: 2,
                          py: 0.6,
                          "&:hover": { bgcolor: "#dcfce7", borderColor: "#166534" } 
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<Cancel sx={{ fontSize: 16 }} />}
                        onClick={() => rejectFarmer(farmer.id)}
                        sx={{ 
                          borderRadius: "8px", 
                          fontWeight: "800", 
                          fontFamily: globalFont, 
                          textTransform: "none", 
                          bgcolor: "#fef2f2",
                          color: "#ef4444",
                          border: "1px solid #fecaca",
                          px: 2,
                          py: 0.6,
                          "&:hover": { bgcolor: "#fee2e2", borderColor: "#ef4444" } 
                        }}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            /* Premium verification empty-state card */
            <Box sx={{ 
              p: 5, 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              bgcolor: "#f8fafc", 
              borderRadius: "16px", 
              border: "1px dashed #cbd5e1", 
              gap: 2, 
              my: 1 
            }}>
              <Box sx={{ 
                width: 58, 
                height: 58, 
                borderRadius: "50%", 
                bgcolor: "#e8f5e9", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                color: "#166534",
                boxShadow: "0 4px 10px rgba(22,101,52,0.06)"
              }}>
                <CheckCircle sx={{ fontSize: 30 }} />
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight="800" color="#0f172a" sx={{ fontFamily: globalFont, mb: 0.5 }}>
                  All Requests Fully Processed!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontFamily: globalFont, maxWidth: "360px", mx: "auto", fontWeight: "600", fontSize: "0.85rem" }}>
                  All farmer registrations have been verified. There are currently no pending accounts in the moderator queue.
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>

      </Box>
    </Box>
  );
}

export default AdminDashboard;