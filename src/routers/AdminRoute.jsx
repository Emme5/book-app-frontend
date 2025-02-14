import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({children}) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  try {
    // ถอดรหัส token เพื่อตรวจสอบ
    const decodedToken = jwtDecode(token);
    
    // ตรวจสอบเวลาหมดอายุ
    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      return <Navigate to="/admin" replace />;
    }

    // ตรวจสอบบทบาท
    if (decodedToken.role !== 'admin') {
      return <Navigate to="/admin" replace />;
    }

    return children ? children : <Outlet/>;
  } catch (error) {
    console.error('Token validation error:', error);
    localStorage.removeItem('token');
    return <Navigate to="/admin" replace />;
  }
};

export default AdminRoute;