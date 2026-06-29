import { topFarmers, productCatalog } from "../../data/mockData";
import { useState } from "react";

function Store() {
  const [selectedFarmer, setSelectedFarmer] = useState(topFarmers[0]?.id);

  return (
    <div className="page-wrapper">
      <h1>Store</h1>
      <p>Browse by farmer</p>
      <div className="grid-3">
        {topFarmers.map((farmer) => (
          <button key={farmer.id} onClick={() => setSelectedFarmer(farmer.id)} className={selectedFarmer === farmer.id ? "active" : ""}>
            {farmer.name}
          </button>
        ))}
      </div>
      <div className="grid-3">
        {productCatalog.slice(0, 3).map((product) => (
          <div className="card" key={product.id}>
            <h3>{product.name}</h3>
            <p>₹{product.price}/kg</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Store;
