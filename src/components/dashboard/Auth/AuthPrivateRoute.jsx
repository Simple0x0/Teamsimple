import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthCheck } from '../hook/useAuthCheck';
import Loading from '../../public/ui/Loading';

export const AuthRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isFirstLogin, loading } = useAuthCheck();

  if (loading) return <Loading />;

  if (isAuthenticated && isFirstLogin && location.pathname !== '/reset-password') {
    return (
      <Navigate
        to="/reset-password"
        replace
        state={{ message: 'You must reset your password before accessing the platform.' }}
      />
    );
  }

  if (isAuthenticated && !isFirstLogin && 
      (location.pathname === '/login' || location.pathname === '/reset-password')) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isFirstLogin, loading } = useAuthCheck();

  if (loading) return <Loading />;

  // Authenticated but must reset password — block dashboard access
  if (isAuthenticated && isFirstLogin) {
    return (
      <Navigate
        to="/reset-password"
        replace
        state={{ message: 'Please reset your password before continuing.' }}
      />
    );
  }

  // Not authenticated — redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          message: 'Please log in to access the dashboard.',
          from: location.pathname,
        }}
      />
    );
  }

  // All checks passed — allow access
  return children;
};



/*import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthCheck } from '../hook/useAuthCheck';
import Loading from '../../public/ui/Loading';

export const AuthRoute = ({ children }) => {
  const { isAuthenticated, _, loading } = useAuthCheck();
  if (loading) return <Loading />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};


export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isFirstLogin, loading } = useAuthCheck();
  const location = useLocation();
  if (loading) return <Loading />;
  
  return isAuthenticated
    ? children
    : (
      <Navigate
        to="/login"
        replace
        state={{ message: 'Please log in to access the dashboard', from: location.pathname }}
      />
    );;
};


*/