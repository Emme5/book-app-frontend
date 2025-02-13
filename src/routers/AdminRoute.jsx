import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = ({children}) => {
  const token = localStorage.getItem('token');

 // เพิ่มการตรวจสอบ token validity
  if(!token) {
    return <Navigate to="/admin" replace />;
  }

  try {
    // อาจเพิ่มการตรวจสอบ token expiration หรือ role ถ้าจำเป็น
    return children ? children : <Outlet/>;
  } catch (error) {
    console.error('Token validation error:', error);
    return <Navigate to="/admin" replace />;
  }
};

export default AdminRoute;