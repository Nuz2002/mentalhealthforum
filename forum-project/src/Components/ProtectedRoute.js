

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');
  const applicationStatus = localStorage.getItem('applicationStatus');

  // 1) Not authenticated => /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2) Force admins to /admin only
  if (userType === 'ADMIN' && location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />;
  }

  // 3) If user is a specialist but not "APPROVED", redirect to /become-expert
  if (userType === 'SPECIALIST' && applicationStatus !== 'APPROVED') {
    if (location.pathname !== '/become-expert') {
      return <Navigate to="/become-expert" replace />;
    }
  }

  // 4) If non-specialist tries to visit /become-expert
  if (location.pathname === '/become-expert' && userType !== 'SPECIALIST') {
    return <Navigate to="/home" replace />;
  }

  // 5) All other allowed routes
  return children;
};

export default ProtectedRoute;
