import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerOrders.css';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('adminToken'); // get token from localStorage

      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data.dbOrders || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="customer-orders">
      <h2>Customer Orders</h2>
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Total Items</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(0, 8)}...</td>
                  <td>{order.name}</td>
                  <td>{order.email}</td>
                  <td>{order.phone}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.cartProducts.reduce((sum, item) => sum + (item.quantity || 1), 0)}</td>
                  <td>
                    Rs{' '}
                    {order.cartProducts.reduce((sum, item) => {
                      const quantity = item.quantity || 1;
                      const price = item.price || 0;
                      return sum + quantity * price;
                    }, 0).toFixed(2)}
                  </td>
                  <td>
                    <button onClick={() => viewOrderDetails(order._id)}>View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const viewOrderDetails = (id) => {
  console.log("Viewing order ID:", id);
};

export default CustomerOrders;
