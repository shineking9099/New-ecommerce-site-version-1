import React from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import KidsPage from './pages/KidsPage';
import MensPage from './pages/MensPage';
import WomenPage from './pages/WomenPage';
import AdminLogin from './pages/AdminLogin';
import './App.css';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="app-container">
      {token && (
        <aside className="sidebar">
          <h2 className="logo">🛒 Admin</h2>
          <nav className="nav-links">
            <NavLink to="/admin/panel">Admin Panel</NavLink>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
            <NavLink to="/kids">Kids</NavLink>
            <NavLink to="/mens">Mens</NavLink>
            <NavLink to="/women">Women</NavLink>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </nav>
        </aside>
      )}

      <main className="main-content">
        <header className="topbar">
          <h1>Admin Dashboard</h1>
        </header>
        <div className="page-content">
          <Routes>
            <Route path="/admin/panel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/kids" element={<ProtectedRoute><KidsPage /></ProtectedRoute>} />
            <Route path="/mens" element={<ProtectedRoute><MensPage /></ProtectedRoute>} />
            <Route path="/women" element={<ProtectedRoute><WomenPage /></ProtectedRoute>} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/" element={token ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/login" replace />} />
            <Route path="*" element={<p>404: Not Found</p>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}