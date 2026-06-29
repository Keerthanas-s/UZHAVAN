import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import "../../styles/farmerCard.css";

const FarmerCard = ({ farmer, onView }) => {
  return (
    <Card className="farmer-card">
      <CardContent>
        <Typography className="farmer-name">
          {farmer.name}
        </Typography>

        <Typography className="farmer-location">
          📍 {farmer.location}
        </Typography>

        <Typography className="farmer-rating">
          ⭐ {farmer.rating}
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          className="farmer-btn"
          onClick={() => onView(farmer)}
        >
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default FarmerCard;