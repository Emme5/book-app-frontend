import React, { useState } from 'react'
import { useForm } from "react-hook-form"

import axios from "axios"
import { useNavigate } from 'react-router-dom'
import getBaseUrl from '../utils/baseURL'

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
          console.log(data)
            try {
              const response = await axios.post(`${getBaseUrl()}/api/auth/admin`, data)
              const auth = response.data;
              if (auth.token) {
                localStorage.setItem('token', auth.token);
                setTimeout(() => {
                  localStorage.removeItem('token')
                  alert('Token has been expired!, Please Login Again.');
                  navigate("/")
                }, 3600 * 1000)
              }

              alert("การเข้าสู่ระบบของผู้ดูแลระบบสำเร็จ!")
              navigate("/dashboard")

            } catch (error) {
              setMessage("ไม่สามารถลงทะเบียนได้")
              console.error(error)
            }
          }

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
