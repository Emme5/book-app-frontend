import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

const PrivateRoute = ({children}) => {
    const {currentUser, loading} = useAuth();

    if(loading) {
      return (
        <div className="flex flex-col justify-center items-center h-screen">
          <HashLoader color="#00ef15" />
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      );
    }
    if(currentUser) {
        return children;
    }
  return <Navigate to="/login" replace />;
}

export default PrivateRoute
