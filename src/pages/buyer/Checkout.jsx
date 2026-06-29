import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order placed successfully!");
    navigate("/buyer/track-order");
  };

  return (
    <div className="page-wrapper">
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} className="form">
        <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <textarea placeholder="Delivery Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
}

export default Checkout;
