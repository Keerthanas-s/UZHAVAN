import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper
} from "@mui/material";
import "../../styles/orderTable.css";

const OrderTable = ({ orders }) => {
  return (
    <Paper className="order-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Qty</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="order-row">
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.productName}</TableCell>
              <TableCell>{order.qty}</TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default OrderTable;