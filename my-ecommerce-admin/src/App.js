import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import KidsPage from './pages/KidsPage';
import MensPage from './pages/MensPage';
import WomenPage from './pages/WomenPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Changed from 'adminToken' to 'token'
  return token ? children : <Navigate to="/login" replace />;
};

const AppLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2 className="logo">🛒 Admin</h2>
        <nav className="nav-links">
          <NavLink to="/admin/dashboard">Dashboard</NavLink>
          <NavLink to="/admin/panel">Upload Products</NavLink>
          <NavLink to="/kids">Kids</NavLink>
          <NavLink to="/mens">Mens</NavLink>
          <NavLink to="/women">Women</NavLink>
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
    <Router>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/panel" element={
          <ProtectedRoute>
            <AppLayout>
              <AdminPanel />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/kids" element={
          <ProtectedRoute>
            <AppLayout>
              <KidsPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/mens" element={
          <ProtectedRoute>
            <AppLayout>
              <MensPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/women" element={
          <ProtectedRoute>
            <AppLayout>
              <WomenPage />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}