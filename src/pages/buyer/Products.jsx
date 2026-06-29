import { productCatalog } from "../../data/mockData";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cart/cartSlice";

function Products() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="page-wrapper">
      <h1>All Products</h1>
      <p>Browse fresh farm produce</p>
      <div className="grid-3">
        {productCatalog.map((product) => (
          <div className="card" key={product.id}>
            <h3>{product.name}</h3>
            <p>Seller: {product.seller}</p>
            <p className="price">₹{product.price}/kg</p>
            <p>⭐ {product.rating}</p>
            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
            <button onClick={() => navigate(`/buyer/product/${product.id}`)}>Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;