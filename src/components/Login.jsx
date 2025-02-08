import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle , FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [message, setMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const {loginUser, signUpWithGoogle} = useAuth();
    const navigate = useNavigate();

     // Add gradient animation
     useEffect(() => {
      const style = document.createElement('style');
      style.textContent = `
          @keyframes gradient {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
          }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
  }, []);

     const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await loginUser(data.email, data.password);
            alert("ล็อกอินสำเร็จแล้ว");
            navigate("/");
        } catch (error) {
            setMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            console.error(error);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signUpWithGoogle();
            alert("ล็อกอินสำเร็จแล้ว");
            navigate("/");
        } catch (error) {
            alert("ไม่สามารถล็อกอินได้");
            console.error(error);
        }
    };

  return (
    <div className='min-h-screen flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8'
            style={{
                backgroundSize: '400% 400%',
                animation: 'gradient 15s ease infinite',
            }}>
            <div className='w-full max-w-md px-4'>
                <div className='bg-white shadow-xl rounded-2xl px-8 pt-8 pb-8'>
                    {/* Header */}
                    <div className='text-center mb-8'>
                        <h2 className='text-3xl font-bold text-gray-800 mb-2'>ยินดีต้อนรับ</h2>
                        <p className='text-gray-600'>เข้าสู่ระบบเพื่อดำเนินการต่อ</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                        {/* Email Field */}
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                อีเมล
                            </label>
                            <input
                                {...register("email", {
                                    required: "กรุณากรอกอีเมล",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "อีเมลไม่ถูกต้อง"
                                    }
                                })}
                                type='email'
                                className='appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm'
                                placeholder='example@email.com'
                            />
                            {errors.email && (
                                <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                                รหัสผ่าน
                            </label>
                            <div className='relative'>
                                <input
                                    {...register("password", {
                                        required: "กรุณากรอกรหัสผ่าน"
                                    })}
                                    type={showPassword ? 'text' : 'password'}
                                    className='appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm'
                                    placeholder='รหัสผ่าน'
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword ? 
                                        <FaEyeSlash className="w-5 h-5 hover:text-orange-500" /> : 
                                        <FaEye className="w-5 h-5 hover:text-orange-500" />
                                    }
                                </button>
                            </div>
                            {errors.password && (
                                <p className='text-red-500 text-xs mt-1'>{errors.password.message}</p>
                            )}
                        </div>

                        {message && (
                            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative' role="alert">
                                <span className="block sm:inline">{message}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200'
                            >
                                เข้าสู่ระบบ
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className='mt-6'>
                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-300'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-white text-gray-500'>หรือ</span>
                            </div>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <div className='mt-6'>
                        <button
                            onClick={handleGoogleSignIn}
                            className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200'
                        >
                            <FaGoogle className='text-orange-600 mr-2' />
                            ล็อกอินโดยใช้ Google
                        </button>
                    </div>

                    {/* Register Link */}
                    <p className='mt-6 text-center text-sm text-gray-600'>
                        หากไม่มีบัญชีโปรด
                        <Link to="/register" className='font-medium text-orange-600 hover:text-orange-500 ml-1'>
                            ลงทะเบียน
                        </Link>
                    </p>
                    
                </div>
            </div>
        </div>
    );
};

export default Login
