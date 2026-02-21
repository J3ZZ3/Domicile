import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="route-loading">Loading...</div>;
  if (!currentUser) return <Navigate to="/admin-login" state={{ from: location }} replace />;
  if (!currentUser.isAdmin) return <Navigate to="/client-dashboard" replace />;

  return children;
};

export const ClientRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="route-loading">Loading...</div>;
  if (!currentUser) return <Navigate to="/client-login" state={{ from: location }} replace />;
  if (currentUser.isAdmin) return <Navigate to="/admin-dashboard" replace />;

  return children;
};

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="route-loading">Loading...</div>;
  if (!currentUser) return <Navigate to="/client-login" state={{ from: location }} replace />;

  return children;
};

export default ProtectedRoute;
