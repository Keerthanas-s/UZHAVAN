import React from "react";
import { Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import "../../styles/productCard.css";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <Card className="product-card">
      <CardMedia
        component="img"
        image={product.image}
        alt={product.name}
        className="product-image"
      />

      <CardContent>
        <Typography className="product-name">
          {product.name}
        </Typography>

        <Typography className="product-price">
          ₹{product.price} / kg
        </Typography>

        <Button
          variant="contained"
          fullWidth
          className="product-btn"
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;