import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const PrivateRoute = () => {
  const {
    authState: { isAuthenticated, customer },
  } = useContext(AuthContext);
  return isAuthenticated && customer ? <Outlet /> : <Navigate to='/login' />;
};

export const EmployeePrivateRoute = () => {
  const {
    authState: { isAuthenticated, employee },
  } = useContext(AuthContext);
  return isAuthenticated && employee ? (
    <Outlet />
  ) : (
    <Navigate to='/login/employee' />
  );
};

export const AdminPrivateRoute = () => {
  const {
    authState: { isAuthenticated, admin },
  } = useContext(AuthContext);
  return isAuthenticated && admin ? <Outlet /> : <Navigate to='/admin/login' />;
};
