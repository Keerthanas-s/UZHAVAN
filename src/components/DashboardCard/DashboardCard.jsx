import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "../../styles/dashboardCard.css";

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <Card className="dashboard-card">
      <CardContent>
        <div className="card-header">
          <Typography className="card-title">{title}</Typography>
          {icon && <div className="card-icon">{icon}</div>}
        </div>

        <Typography className="card-value" style={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;