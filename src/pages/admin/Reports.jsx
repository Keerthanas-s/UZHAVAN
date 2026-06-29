import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Button,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { toast } from "react-toastify";
import axiosConfig from "../../api/axiosConfig";

function Reports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await axiosConfig.get("/orders");
      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error("Failed to load orders for reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDownloadCSV = () => {
    if (orders.length === 0) {
      toast.warning("No data available to download");
      return;
    }

    // Build CSV Headers
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Customer Phone",
      "Farmer Name",
      "Product Name",
      "Quantity",
      "Total Price (INR)",
      "Delivery Address",
      "Status",
    ];

    // Map rows
    const rows = orders.map((o) => [
      o.id,
      o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "Recent",
      o.customer?.name || "N/A",
      `"${o.customer?.phoneNumber || "N/A"}"`,
      o.farmer?.name || "N/A",
      o.product?.name || "N/A",
      o.orderedQuantity,
      o.totalPrice,
      `"${o.deliveryAddress || "N/A"}"`,
      o.status,
    ]);

    // Construct CSV String
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    // Trigger Download Link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Uzhavan_Sales_Report_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Sales report downloaded successfully!");
  };

  return (
    <Box sx={{ p: 4, background: "#fafafa", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: "#1b5e20" }}>
            Sales Reports 📑
          </Typography>
          <Typography color="text.secondary">
            Generate and export overall transaction details.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<Download />}
          onClick={handleDownloadCSV}
          sx={{ borderRadius: "20px", fontWeight: "bold" }}
        >
          Download CSV Report
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: "16px" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#1b5e20", mb: 3 }}>
            Full Transaction Logs ({orders.length} entries)
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Buyer</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Seller</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="center">Quantity</TableCell>
                <TableCell sx={{ fontWeight: "bold" }} align="right">Amount</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell sx={{ fontWeight: "bold" }}>#ORD-{o.id}</TableCell>
                    <TableCell>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "Recent"}</TableCell>
                    <TableCell>{o.customer?.name || "N/A"}</TableCell>
                    <TableCell>{o.farmer?.name || "N/A"}</TableCell>
                    <TableCell>{o.product?.name || "N/A"}</TableCell>
                    <TableCell align="center">{o.orderedQuantity} {o.product?.unit || "kg"}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", color: "#2e7d32" }}>₹{o.totalPrice}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>{o.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    No transactions recorded.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}

export default Reports;