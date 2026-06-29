import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
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
import axiosConfig from "../../api/axiosConfig";

function Analytics() {
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  const PIE_COLORS = ["#ffa000", "#1976d2", "#2e7d32", "#d32f2f", "#7b1fa2"];

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/orders");
      const orders = response.data || [];

      // 1. Group Orders by Date for Trend
      const groupedDates = {};
      orders.forEach((o) => {
        if (o.orderDate) {
          const date = new Date(o.orderDate).toLocaleDateString([], { month: "short", day: "numeric" });
          groupedDates[date] = (groupedDates[date] || 0) + (o.totalPrice || 0);
        }
      });
      const trends = Object.keys(groupedDates).map((key) => ({
        name: key,
        revenue: groupedDates[key],
      })).slice(-7); // take last 7 active dates
      setTrendData(trends.length > 0 ? trends : [{ name: "Today", revenue: 0 }]);

      // 2. Group Orders by Product Category
      const groupedCats = {};
      orders.forEach((o) => {
        const cat = o.product?.category || "Other";
        groupedCats[cat] = (groupedCats[cat] || 0) + 1;
      });
      const categories = Object.keys(groupedCats).map((key) => ({
        name: key,
        sales: groupedCats[key],
      }));
      setCategoryData(categories.length > 0 ? categories : [{ name: "None", sales: 0 }]);

      // 3. Group Orders by Status
      const groupedStatus = {};
      orders.forEach((o) => {
        const status = o.status || "PENDING";
        groupedStatus[status] = (groupedStatus[status] || 0) + 1;
      });
      const statuses = Object.keys(groupedStatus).map((key) => ({
        name: key,
        value: groupedStatus[key],
      }));
      setStatusData(statuses.length > 0 ? statuses : [{ name: "No Orders", value: 1 }]);
    } catch (error) {
      console.error("Failed to load analytics details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20", mb: 4 }}>
        Market Analytics 📊
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Revenue trends line chart */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px" }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#1b5e20", mb: 3 }}>
                Revenue Generation Timeline (Last 7 Sales Days)
              </Typography>
              <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#2e7d32" strokeWidth={3} dot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Status Breakdown Pie */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px", height: "100%" }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#1b5e20", mb: 3 }}>
                Order Status Ratios
              </Typography>
              <Box sx={{ width: "100%", height: 200, display: "flex", justifyContent: "center" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={70} fill="#8884d8">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
                {statusData.map((d, i) => (
                  <Box key={i} sx={{ display: "flex", justifyContent: "space-between", px: 2 }}>
                    <Typography variant="body2" fontWeight="700" color="text.secondary">
                      ● {d.name}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: PIE_COLORS[i % PIE_COLORS.length] }}>
                      {d.value} orders
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Category Sales bar chart */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px" }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#1b5e20", mb: 3 }}>
                Crops Distribution sales (Categorized)
              </Typography>
              <Box sx={{ width: "100%", height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#81c784" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Analytics;