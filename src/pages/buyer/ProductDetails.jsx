import { useParams, useNavigate } from "react-router-dom";
import { productCatalog } from "../../data/mockData";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cart/cartSlice";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = productCatalog.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div className="page-wrapper"><h1>Product not found</h1></div>;
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    alert("Added to cart!");
  };

  return (
    <div className="page-wrapper">
      <h1>{product.name}</h1>
      <div className="product-detail">
        <p><strong>Price:</strong> ₹{product.price}/kg</p>
        <p><strong>Seller:</strong> {product.seller}</p>
        <p><strong>Rating:</strong> ⭐ {product.rating}</p>
        <p><strong>In Stock:</strong> {product.quantity} kg</p>
        <button onClick={handleAddToCart}>Add to Cart</button>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
}

export default ProductDetails;
