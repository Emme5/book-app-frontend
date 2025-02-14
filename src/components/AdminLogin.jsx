import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import Swal from 'sweetalert2'
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import getBaseUrl from '../utils/baseURL'
import { jwtDecode } from 'jwt-decode';

const AdminLogin = () => {
    const [message, setMessage] = useState("")
    const {
          register,
          handleSubmit,
          watch,
          formState: { errors },
        } = useForm()

        const navigate = useNavigate()

        const onSubmit = async (data) => {
          console.log('Sending login data:', data); // เพิ่มบรรทัดนี้
          try {
              const response = await axios.post(
                  `${getBaseUrl()}/api/auth/admin`, 
                  data,
                  {
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  }
              );
              console.log('Login response:', response.data);
              
              const { token } = response.data;
              
              if (token) {
                  // แก้ตรงนี้จาก jwt_decode เป็น jwtDecode
                  const decodedToken = jwtDecode(token);
                  
                  localStorage.setItem('token', token);
                  localStorage.setItem('tokenExpiration', decodedToken.exp * 1000);
      
                  Swal.fire({
                      icon: 'success',
                      title: 'เข้าสู่ระบบสำเร็จ',
                      text: 'ยินดีต้อนรับสู่แดชบอร์ดผู้ดูแลระบบ',
                      timer: 1500,
                      showConfirmButton: false
                  });
      
                  navigate("/dashboard");
              }
          } catch (error) {
            console.log('Full error:', error); // เพิ่มบรรทัดนี้
              Swal.fire({
                  icon: 'error',
                  title: 'เข้าสู่ระบบไม่สำเร็จ',
                  text: error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
              });
              
              console.error(error);
          }
      };

      const checkTokenExpiration = () => {
        const token = localStorage.getItem('token');
        const expirationTime = localStorage.getItem('tokenExpiration');
    
        if (token && expirationTime) {
            if (Date.now() > parseInt(expirationTime)) {
                // Token หมดอายุ
                localStorage.removeItem('token');
                localStorage.removeItem('tokenExpiration');
                
                Swal.fire({
                    icon: 'warning',
                    title: 'หมดเวลาการใช้งาน',
                    text: 'กรุณาเข้าสู่ระบบอีกครั้ง',
                    timer: 1500
                });
    
                navigate("/");
            }
        }
    };

    useEffect(() => {
      checkTokenExpiration();
  }, []);

  return (
    <div className='h-screen flex justify-center items-center'>
          <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded 
          px-8 pt-6 pb-8 mb-4'>
            <h2 className='text-xl font-extrabold mb-4 flex justify-center'>Admin Dashboard Login</h2>
    
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold
                mb-2' htmlFor='username'>ชื่อผู้ใช้ , Username</label>
                <input 
                {...register("username", { required: true })}
                type='text' name='username' id='username' placeholder='username'
                className='shadow appearance-none border rounded w-full py-2 px-3
                leading-tight focus:outline-none focus:shadow' />
              </div>
    
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold
                mb-2' htmlFor='password'>รหัสผ่าน</label>
                <input 
                {...register("password", { required: true })}
                type='password' name='password' id='password' placeholder='Password'
                className='shadow appearance-none border rounded w-full py-2 px-3
                leading-tight focus:outline-none focus:shadow' />
              </div>
              {
                message && <p className='text-red-500 text-sm italic
                mb-3'>{message}</p>
              }
              <div className='w-full'>
                <button className='bg-amber-500 w-full hover:bg-red-500
                text-white font-bold py-2 px-8 rounded focus:outline-none'>ล็อกอิน</button>
              </div>
            </form>
    
            
            <p className='mt-5 text-center text-gray-500 text-sm'>🤐ต้องกำหนดรหัสผ่านจากเจ้าของเว็บไซต์🤫</p>
          </div>
        </div>
  )
}

export default AdminLogin
