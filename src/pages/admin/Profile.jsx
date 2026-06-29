import React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar
} from "@mui/material";

function Profile() {
  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Admin Profile
      </Typography>

      <Paper sx={{ p: 4, textAlign: "center" }}>

        <Avatar
          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            mb: 2
          }}
        >
          A
        </Avatar>

        <Typography variant="h5">
          Administrator
        </Typography>

        <Typography color="text.secondary">
          admin@uzhavan.com
        </Typography>

      </Paper>
    </Box>
  );
}

export default Profile;