import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import "./AddToCart.css";
import { Link, useNavigate } from "react-router-dom";

const AddToCart = () => {
  const { cartItems, setCartItems } = useContext(ShopContext);
  const navigate = useNavigate();

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  // ✅ FIXED: Changed from item.new_price to item.price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/register", { state: { cartItems } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <Link to="/">
          <button>Go to Shop</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} />
          <div className="cart-item-info">
            <h3>{item.name}</h3>

            {/* ✅ FIXED: Show correct price */}
            <p>Price: Rs {item.price}</p>

            <div className="quantity-controls">
              <button onClick={() => decreaseQuantity(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQuantity(item.id)}>+</button>
            </div>

            <button onClick={() => removeFromCart(item.id)} className="remove-btn">
              Remove
            </button>
          </div>
        </div>
      ))}
      <div className="cart-total">
        <h3>Total: Rs {totalPrice}</h3>
        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default AddToCart;
