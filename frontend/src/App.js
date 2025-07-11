import React from 'react';
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import KidsPage from './pages/KidsPage';
import MensPage from './pages/MensPage';
import WomenPage from './pages/WomenPage';
import AdminLogin from './pages/AdminLogin';
import './App.css';

// ProtectedRoute Component
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="app-container">
      {token && (
        <aside className="sidebar">
          <h2 className="logo">🛒 Admin</h2>
          <nav className="nav-links">
            <NavLink to="/admin/panel" className={({ isActive }) => isActive ? 'active' : ''}>Admin Panel</NavLink>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
            <NavLink to="/kids" className={({ isActive }) => isActive ? 'active' : ''}>Kids</NavLink>
            <NavLink to="/mens" className={({ isActive }) => isActive ? 'active' : ''}>Mens</NavLink>
            <NavLink to="/women" className={({ isActive }) => isActive ? 'active' : ''}>Women</NavLink>
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
            {/* Protected routes */}
            <Route path="/admin/panel" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/kids" element={
              <ProtectedRoute>
                <KidsPage />
              </ProtectedRoute>
            } />
            <Route path="/mens" element={
              <ProtectedRoute>
                <MensPage />
              </ProtectedRoute>
            } />
            <Route path="/women" element={
              <ProtectedRoute>
                <WomenPage />
              </ProtectedRoute>
            } />

            {/* Public route */}
            <Route path="/login" element={<AdminLogin />} />

            {/* Redirect root to dashboard if logged in */}
            <Route path="/" element={
              token ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/login" replace />
            } />

            {/* 404 fallback */}
            <Route path="*" element={<p>404: Not Found</p>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
