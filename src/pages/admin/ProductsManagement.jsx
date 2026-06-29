import React from "react";
import {
  Box,
  Typography,
  Paper
} from "@mui/material";

function ProductsManagement() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Products Management
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">
          Products List
        </Typography>

        <Typography color="text.secondary">
          Manage all products uploaded by farmers.
        </Typography>
      </Paper>
    </Box>
  );
}

export default ProductsManagement;