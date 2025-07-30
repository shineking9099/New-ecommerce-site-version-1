import React, { useState, useContext } from 'react';
import './Registerpages.css';
import axios from 'axios';
import { ShopContext } from '../Context/ShopContext';

const RegisterPage = () => {
  const { cartItems } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    phone: '',
    whatsapp: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        cartProducts: cartItems,
      };

      const res = await axios.post('http://localhost:5000/api/register', payload);
      console.log('✅ Registration Success:', res.data);
      setMessage('Order submitted successfully!');
    } catch (err) {
      console.error('❌ Registration Error:', err);
      setMessage('Order failed! Try again.');
    }
  };

  return (
    <div className="register-container">
      <h2 className="page-title">Customer Order Form</h2>

      {cartItems.length === 0 ? (
        <p className="error-message">No items in the cart.</p>
      ) : (
        <div className="cart-summary">
          <h3 className="summary-title">Cart Summary</h3>
          {cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <div className="product-image-container">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                />
              </div>
              <div className="product-details">
                <h4 className="product-name">{item.name}</h4>
                <div className="product-info">
                  <p className="product-price">
                    <span className="info-label">Price:</span> Rs {item.price}
                  </p>
                  <p className="product-quantity">
                    <span className="info-label">Quantity:</span> {item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="register-form">
        <h3 className="form-title">Shipping Details</h3>
        <div className="form-group">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="text" name="address" placeholder="Shipping Address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="tel" name="whatsapp" placeholder="WhatsApp Number" value={formData.whatsapp} onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-btn">Submit Order</button>
        {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
