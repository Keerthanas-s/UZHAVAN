import { productCatalog, topFarmers } from "../../data/mockData";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper">
      <h1>Welcome to UZHAVAN</h1>
      <p>Direct from farmer to your table</p>
      <div className="card">
        <h2>Top Rated Farmers</h2>
        <div className="grid-3">
          {topFarmers.map((farmer) => (
            <div className="card" key={farmer.id}>
              <h4>{farmer.name}</h4>
              <p>⭐ {farmer.rating}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h2>Featured Products</h2>
        <div className="grid-3">
          {productCatalog.slice(0, 3).map((product) => (
            <div className="card" key={product.id}>
              <h4>{product.name}</h4>
              <p>₹{product.price}/kg</p>
              <button onClick={() => navigate(`/buyer/product/${product.id}`)}>View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
