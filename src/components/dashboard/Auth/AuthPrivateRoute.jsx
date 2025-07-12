import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthCheck } from '../hook/useAuthCheck';
import Loading from '../../public/ui/Loading';

export const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthCheck();
  if (loading) return <Loading />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};


export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthCheck();
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

