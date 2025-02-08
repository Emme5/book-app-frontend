import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { FaGoogle, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useForm } from "react-hook-form"
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {registerUser, signUpWithGoogle} = useAuth();

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm()

    const password = watch("password", "");

    // Password strength criteria
    const hasLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const getPasswordStrength = () => {
      const criteria = [hasLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar];
      const metCriteria = criteria.filter(Boolean).length;
      
      if (metCriteria <= 2) return { text: 'อ่อน', color: 'text-red-500', bg: 'bg-red-500' };
      if (metCriteria <= 4) return { text: 'ปานกลาง', color: 'text-yellow-500', bg: 'bg-yellow-500' };
      return { text: 'แข็งแรง', color: 'text-green-500', bg: 'bg-green-500' };
    };

    const onSubmit = async(data) => {
      if (data.password !== data.confirmPassword) {
        setMessage("รหัสผ่านไม่ตรงกัน");
        return;
      }
  
      try {
        await registerUser(data.email, data.password);
        alert("ลงทะเบียนสำเร็จแล้ว");
      } catch (error) {
        setMessage("ไม่สามารถลงทะเบียนได้");
        console.error(error);
      }
    };

    const handleGoogleSignIn = async () => {
      try {
        await signUpWithGoogle();
        alert("ล็อกอินสำเร็จแล้ว");
      } catch (error) {
        alert("ไม่สามารถล็อกอินได้");
        console.error(error);
      }
    };

    const strengthIndicator = getPasswordStrength();

  return (
    <div className='min-h-screen flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8' style={{
      backgroundSize: '400% 400%',
      animation: 'gradient 15s ease infinite',
    }}>
      <div className='w-full max-w-md'>
        <div className='bg-white shadow-xl rounded-lg px-8 pt-8 pb-8 mb-4'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-800 mb-2'>ลงทะเบียน</h2>
            <p className='text-gray-600'>สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน</p>
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
              <label className='block text-gray-700 text-sm font-bold mb-2'>
                รหัสผ่าน
              </label>
              <div className='relative'>
                <input
                  {...register("password", {
                    required: "กรุณากรอกรหัสผ่าน",
                    minLength: {
                      value: 8,
                      message: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
                    }
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

              {/* Password Strength Indicator */}
              {password && (
                <div className='mt-2'>
                  <div className='flex items-center mb-1'>
                    <div className='text-sm'>ความแข็งแรงของรหัสผ่าน: </div>
                    <div className={`ml-2 text-sm font-medium ${strengthIndicator.color}`}>
                      {strengthIndicator.text}
                    </div>
                  </div>
                  <div className='h-1 w-full bg-gray-200 rounded-full'>
                    <div
                      className={`h-1 rounded-full ${strengthIndicator.bg} transition-all duration-300`}
                      style={{
                        width: `${(getPasswordStrength().text === 'อ่อน' ? 33 : getPasswordStrength().text === 'ปานกลาง' ? 66 : 100)}%`
                      }}
                    ></div>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className='mt-2 grid grid-cols-2 gap-2 text-sm'>
                    <div className='flex items-center'>
                      {hasLength ? (
                        <FaCheckCircle className='text-green-500 mr-2' />
                      ) : (
                        <FaTimesCircle className='text-red-500 mr-2' />
                      )}
                      อย่างน้อย 8 ตัวอักษร
                    </div>
                    <div className='flex items-center'>
                      {hasUpperCase ? (
                        <FaCheckCircle className='text-green-500 mr-2' />
                      ) : (
                        <FaTimesCircle className='text-red-500 mr-2' />
                      )}
                      ตัวพิมพ์ใหญ่
                    </div>
                    <div className='flex items-center'>
                      {hasLowerCase ? (
                        <FaCheckCircle className='text-green-500 mr-2' />
                      ) : (
                        <FaTimesCircle className='text-red-500 mr-2' />
                      )}
                      ตัวพิมพ์เล็ก
                    </div>
                    <div className='flex items-center'>
                      {hasNumber ? (
                        <FaCheckCircle className='text-green-500 mr-2' />
                      ) : (
                        <FaTimesCircle className='text-red-500 mr-2' />
                      )}
                      ตัวเลข
                    </div>
                    <div className='flex items-center'>
                      {hasSpecialChar ? (
                        <FaCheckCircle className='text-green-500 mr-2' />
                      ) : (
                        <FaTimesCircle className='text-red-500 mr-2' />
                      )}
                      อักขระพิเศษ
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className='block text-gray-700 text-sm font-bold mb-2'>
                ยืนยันรหัสผ่าน
              </label>
              <div className='relative'>
                <input
                  {...register("confirmPassword", {
                    required: "กรุณายืนยันรหัสผ่าน",
                    validate: value => value === password || "รหัสผ่านไม่ตรงกัน"
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className='appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm'
                  placeholder='ยืนยันรหัสผ่าน'
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? 
                    <FaEyeSlash className="w-5 h-5 hover:text-orange-500" /> : 
                    <FaEye className="w-5 h-5 hover:text-orange-500" />
                  }
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword.message}</p>
              )}
            </div>

            {message && (
              <p className='text-red-500 text-sm text-center'>{message}</p>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200'
              >
                ลงทะเบียน
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

          {/* Login Link */}
          <p className='mt-6 text-center text-sm text-gray-600'>
            หากมีบัญชีโปรด
            <Link to="/login" className='font-medium text-orange-600 hover:text-orange-500 ml-1'>
              ลงชื่อเข้าใช้ได้เลย
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
