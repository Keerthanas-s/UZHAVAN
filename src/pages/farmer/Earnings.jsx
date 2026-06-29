import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MonetizationOn, ShoppingBag, EventAvailable, AccessTime } from "@mui/icons-material";
import farmerApi from "../../api/farmerapi";

const globalFont = "system-ui, -apple-system, sans-serif";

function Earnings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedCount: 0,
    deliveriesCount: 0,
    pendingPayments: 0,
  });
  const [chartData, setChartData] = useState([]);

  const loadEarnings = async () => {
    setLoading(true);
    try {
      const response = await farmerApi.getEarnings();
      const orderList = Array.isArray(response.data) ? response.data : [];
      setOrders(orderList);

      // Calculations
      const completed = orderList.filter((o) => o.status === "DELIVERED" || o.status === "COMPLETED");
      const totalRevenue = completed.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const completedCount = completed.length;
      
      // Successful deliveries
      const deliveriesCount = completedCount;

      // Pending payments (orders confirmed or pending but not yet delivered/cancelled)
      const pending = orderList.filter((o) => o.status === "PENDING" || o.status === "CONFIRMED" || o.status === "SHIPPED");
      const pendingPayments = pending.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      setStats({
        totalRevenue,
        completedCount,
        deliveriesCount,
        pendingPayments,
      });

      // Chart Data grouping by date
      const dateMap = {};
      completed.forEach((o) => {
        if (o.orderDate) {
          const dateStr = new Date(o.orderDate).toLocaleDateString([], { month: "short", day: "numeric" });
          dateMap[dateStr] = (dateMap[dateStr] || 0) + (o.totalPrice || 0);
        }
      });

      const chart = Object.keys(dateMap).map((key) => ({
        day: key,
        amount: dateMap[key],
      })).slice(-7); // last 7 transaction days

      setChartData(chart.length > 0 ? chart : [{ day: "Today", amount: 0 }]);

    } catch (error) {
      console.error("Failed to load earnings stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEarnings();
  }, []);

  return (
    <Box sx={{ p: { xs: 2.5, md: 4 }, background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)", minHeight: "100vh", fontFamily: globalFont }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4.5 }}>
        <Box>
          <Typography variant="h4" fontWeight="900" sx={{ color: "#166534", fontFamily: globalFont, letterSpacing: "-0.8px" }}>
            Earnings Dashboard 💰
          </Typography>
          <Typography color="text.secondary" sx={{ fontFamily: globalFont, fontWeight: "600", fontSize: "0.95rem", mt: 0.5 }}>
            Analyze your income statistics and cash-out requests.
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="success" 
          onClick={loadEarnings} 
          sx={{ borderRadius: "20px", fontWeight: "800", textTransform: "none", fontFamily: globalFont }}
        >
          Refresh Statistics
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <>
          {/* Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4.5 }}>
            {[
              { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, sub: "Delivered Earnings", icon: <MonetizationOn sx={{ color: "#166534", fontSize: 26 }} />, bg: "#f0fdf4" },
              { title: "Orders Completed", value: stats.completedCount, sub: `Out of ${orders.length} total bookings`, icon: <ShoppingBag sx={{ color: "#2563eb", fontSize: 26 }} />, bg: "#eff6ff" },
              { title: "Delivery Completed", value: stats.deliveriesCount, sub: "Successful Deliveries", icon: <EventAvailable sx={{ color: "#0891b2", fontSize: 26 }} />, bg: "#ecfeff" },
              { title: "Pending Payments", value: `₹${stats.pendingPayments.toLocaleString()}`, sub: "Bookings in progress", icon: <AccessTime sx={{ color: "#d97706", fontSize: 26 }} />, bg: "#fffbeb" },
            ].map((card, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Paper elevation={0} sx={{ p: 3, border: "1px solid #e2e8f0", borderRadius: "16px", background: "#ffffff", boxShadow: "0 1px 3px 0 rgba(0,0,0,0.02)" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight="800" sx={{ fontFamily: globalFont }}>
                      {card.title}
                    </Typography>
                    <Box sx={{ p: 1, borderRadius: "8px", bgcolor: card.bg, display: "flex", alignItems: "center" }}>
                      {card.icon}
                    </Box>
                  </Box>
                  <Typography variant="h4" fontWeight="900" sx={{ mb: 0.8, color: "#0f172a", fontFamily: globalFont, letterSpacing: "-0.5px" }}>
                    {card.value}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: globalFont, fontWeight: "600" }}>
                    {card.sub}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Graph Section */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e2e8f0", borderRadius: "16px", mb: 4.5, background: "#ffffff" }}>
            <Typography variant="h6" fontWeight="800" sx={{ mb: 3.5, color: "#166534", fontFamily: globalFont }}>
              Earnings History (Daily Completed Sales)
            </Typography>
            <Box sx={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <ReBarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: "600", fontFamily: globalFont }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11, fontWeight: "600", fontFamily: globalFont }} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{ border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: globalFont, fontWeight: "700" }} 
                    formatter={(value) => [`₹${value}`, "Amount"]} 
                  />
                  <Bar dataKey="amount" fill="#166534" radius={[4, 4, 0, 0]} maxBarSize={45} />
                </ReBarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* Transaction History Section */}
          <Paper elevation={0} sx={{ p: 3, border: "1px solid #e2e8f0", borderRadius: "16px", background: "#ffffff" }}>
            <Typography variant="h6" fontWeight="800" sx={{ mb: 2.5, color: "#166534", fontFamily: globalFont }}>
              Recent Transactions
            </Typography>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "800", color: "#475569", fontFamily: globalFont }}>Transaction ID</TableCell>
                  <TableCell sx={{ fontWeight: "800", color: "#475569", fontFamily: globalFont }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: "800", color: "#475569", fontFamily: globalFont }}>Item Details</TableCell>
                  <TableCell sx={{ fontWeight: "800", color: "#475569", fontFamily: globalFont }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "800", color: "#475569", fontFamily: globalFont }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "800", color: "#475569", fontFamily: globalFont }} align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((row) => (
                    <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#f8fafc" }, transition: "background 0.2s" }}>
                      <TableCell sx={{ fontWeight: "800", color: "#166534", fontFamily: globalFont }}>#TXN-{row.id}</TableCell>
                      <TableCell sx={{ fontFamily: globalFont, fontWeight: "600", color: "#475569" }}>{row.customer?.name || "Customer"}</TableCell>
                      <TableCell sx={{ fontFamily: globalFont, fontWeight: "700", color: "#0f172a" }}>{row.product?.name} - {row.orderedQuantity} {row.product?.unit || "kg"}</TableCell>
                      <TableCell sx={{ fontFamily: globalFont, fontWeight: "600", color: "#475569" }}>{row.orderDate ? new Date(row.orderDate).toLocaleDateString() : "Recent"}</TableCell>
                      <TableCell sx={{ fontFamily: globalFont, fontWeight: "600" }}>
                        <Chip 
                          label={row.status} 
                          size="small" 
                          variant="outlined" 
                          color={row.status === "DELIVERED" || row.status === "COMPLETED" ? "success" : "warning"} 
                          sx={{ fontWeight: "800", fontSize: "0.7rem", borderRadius: "6px" }} 
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: "#166534", fontWeight: "900", fontFamily: globalFont, fontSize: "0.95rem" }}>
                        ₹{row.totalPrice}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, fontFamily: globalFont, color: "text.secondary" }}>
                      No transaction entries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}
    </Box>
  );
}

export default Earnings;