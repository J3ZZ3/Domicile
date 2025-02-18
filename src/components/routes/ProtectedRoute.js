import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Route protection for admin routes
export const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Check if user is an admin
  if (!currentUser.isAdmin && !currentUser.role?.includes('admin')) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Route protection for client routes
export const ClientRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Redirect admins to admin dashboard
  if (currentUser.isAdmin || currentUser.role?.includes('admin')) {
    return <Navigate to="/admin/dashboard" />;
  }

  return children;
};

export default { ProtectedRoute, ClientRoute }; 