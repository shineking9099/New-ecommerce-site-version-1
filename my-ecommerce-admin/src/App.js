// App.jsx (Full React App Code with Admin and E-commerce Routing)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import ShopContextProvider from './components/Context/ShopContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/footer';

// Admin components
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import CustomerOrders from './pages/CustomerOrders/CustomerOrders';

// E-commerce components
import Home from './components/Homepage/Home';
import Healthandbeauty from './components/Healthandbeauty/Healthandbeauty';
import MobileandGadgets from './components/MobileandGagets/MobileandGagets';
import Extras from './components/Extras/Extras';
import Offers from './components/offers/offers';
import AddToCart from './components/AddToCart/AddToCart';
import Register from './components/Registerpages/Registerpages';
import Allproduct from './components/Allproduct/Allproduct';

import './App.css';

let ProductDisplay;
try {
  ProductDisplay = require('./components/ProductDisplay/ProductDisplay').default;
} catch (error) {
  console.error('Failed to load ProductDisplay component:', error);
  ProductDisplay = () => <div>Product Display Component Failed to Load</div>;
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/admin/login" replace />;
};

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 className="logo">🛒 Admin</h2>
        <nav className="nav-links">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/panel">Upload Products</NavLink>
          <NavLink to="/admin/dashboard/customerorder">Customer Orders</NavLink>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <ShopContextProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <Routes>
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/panel" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <AdminPanel />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/customerorder" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <CustomerOrders />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            } 
          />

          {/* E-commerce Routes */}
          <Route 
            path="/*" 
            element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<AddToCart />} />
                  <Route path="/Healthandbeauty" element={<Healthandbeauty />} />
                  <Route path="/MobileandGadgets" element={<MobileandGadgets />} />
                  <Route path="/allproducts" element={<Allproduct />} />
                  <Route path="/Extras" element={<Extras />} />
                  <Route path="/Offers" element={<Offers />} />
                  <Route path="/productdisplay/:productId" element={<ProductDisplay />} />
                  <Route path="/addtocart" element={<AddToCart />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Footer />
              </>
            } 
          />
        </Routes>
      </Router>
    </ShopContextProvider>
  );
}
