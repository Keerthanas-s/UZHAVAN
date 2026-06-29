import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" color="error">
        403 - Unauthorized Access
      </Typography>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={() => navigate("/login")}
      >
        Go to Login
      </Button>
    </Box>
  );
};

export default Unauthorized;