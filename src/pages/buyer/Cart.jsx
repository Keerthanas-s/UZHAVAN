import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../../redux/cart/cartSlice";
import { useNavigate } from "react-router-dom";

function Cart() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * 1), 0);

  return (
    <div className="page-wrapper">
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <table className="table-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td><button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Total: ₹{total}</h2>
          <button onClick={() => navigate("/buyer/checkout")}>Checkout</button>
        </>
      )}
    </div>
  );
}

export default Cart;
