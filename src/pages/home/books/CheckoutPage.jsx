import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm, useWatch } from "react-hook-form"
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';
import { useCreateOrderMutation } from '../../../redux/features/order/ordersApi';
import { loadStripe } from '@stripe/stripe-js';


const CheckoutPage = () => {
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    const cartItem = useSelector(state => state.cart.cartItem);
    const navigate = useNavigate();
    const totalPrice = cartItem.reduce((acc, item) => acc + item.newPrice, 0).toFixed(2);
    const { currentUser } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [createOrder, {isLoading, error}] = useCreateOrderMutation();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (cartItem.length === 0) {
            Swal.fire({
                title: "ไม่พบสินค้าในตะกร้า",
                text: "กรุณาเพิ่มสินค้าในตะกร้าก่อนดำเนินการต่อ",
                icon: "warning",
                confirmButtonText: "ตกลง",
                confirmButtonColor: "#3085d6",
            }).then(() => {
                navigate('/');
            });
        }

        // Verify HTTPS
        if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
            Swal.fire({
                title: "ความปลอดภัย",
                text: "กรุณาใช้ HTTPS สำหรับการชำระเงิน",
                icon: "warning",
                confirmButtonText: "ตกลง",
            }).then(() => {
                window.location.href = window.location.href.replace('http:', 'https:');
            });
        }
    }, [cartItem, navigate]);

    const createCheckoutSession = async (orderId, items) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        id: item._id,
                        title: item.title,
                        price: Number(item.newPrice),
                        quantity: 1
                    })),
                    orderId
                }),
            });
    
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create checkout session');
            }
    
            return await response.json();
        } catch (error) {
            console.error('Checkout session error:', error);
            throw error;
        }
    };

    const handleCashOnDelivery = async () => {
        try {
            setIsProcessing(true);

            if (!currentUser?.email) {
                throw new Error('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
            }

            const newOrder = {
                name: watch('name'),
                email: currentUser.email,
                address: {
                    fullAddress: watch('address'),
                    district: watch('district'),
                    amphure: watch('amphure'),
                    province: watch('state'),
                    zipcode: watch('zipcode')
                },
                phone: watch('phone'),
                productIds: cartItem.map(item => item._id),
                totalPrice: totalPrice,
                status: 'รอดำเนินการ',
                paymentStatus: 'ชำระเงินปลายทาง'
            };

            const order = await createOrder(newOrder).unwrap();
            
            if (!order?._id) {
                throw new Error('ไม่สามารถสร้างออเดอร์ได้');
            }

            Swal.fire({
                title: "สั่งซื้อสำเร็จ",
                text: "ออเดอร์ของคุณถูกบันทึกแล้ว คุณจะชำระเงินเมื่อได้รับสินค้า",
                icon: "success",
                confirmButtonText: "ตกลง",
            }).then(() => {
                navigate('/orders');
            });

        } catch (err) {
            console.error("Error:", err);
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: err.message || "ไม่สามารถดำเนินการสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง",
                icon: "error",
                confirmButtonText: "ตกลง",
            });
        } finally {
            setIsProcessing(false);
        }
    };
      
    const onSubmit = async (data) => {
        try {
            setIsProcessing(true);
    
            if (!currentUser?.email) {
                throw new Error('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
            }
    
            // สร้าง order
            const newOrder = {
                name: data.name,
                email: currentUser.email,
                address: {
                    fullAddress: data.address,
                    district: data.district,
                    amphure: data.amphure,
                    province: data.state,
                    zipcode: data.zipcode
                },
                phone: data.phone,
                productIds: cartItem.map(item => item._id),
                totalPrice: totalPrice,
                status: 'pending',
                paymentStatus: 'pending'
            };
    
            const order = await createOrder(newOrder).unwrap();
            
            if (!order?._id) {
                throw new Error('ไม่สามารถสร้างออเดอร์ได้');
            }
    
            // สร้าง Stripe checkout session
            const { sessionId } = await createCheckoutSession(order._id, cartItem);
    
            // Redirect ไปยัง Stripe checkout
            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId });
    
            if (error) {
                throw error;
            }
    
        } catch (err) {
            console.error("Error:", err);
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: err.message || "ไม่สามารถดำเนินการชำระเงินได้ กรุณาลองใหม่อีกครั้ง",
                icon: "error",
                confirmButtonText: "ตกลง",
            });
        } finally {
            setIsProcessing(false);
        }
    };

  return (
    <section>
      <div className="min-h-screen bg-gray-50 py-8">
    <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
             {/* Header */}
            <div className="p-6 bg-gray-800 text-white">
            <h1 className="text-2xl font-bold">รายละเอียดการสั่งซื้อ</h1>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 space-y-2 sm:space-y-0">
                            <div className="text-lg">ราคารวม: <span className="font-semibold text-green-400">${totalPrice}</span></div>
                            <div className="text-lg">จำนวนสินค้า: <span className="font-semibold">{cartItem.length}</span></div>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ชื่อ-นามสกุล
                                    </label>
                                    <input
                                        {...register("name", { required: "กรุณากรอกชื่อ" })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        อีเมล
                                    </label>
                                    <input
                                        type="email"
                                        disabled
                                        defaultValue={currentUser?.email}
                                        className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        เบอร์โทรศัพท์
                                    </label>
                                    <input
                                        {...register("phone", {
                                            required: "กรุณากรอกเบอร์โทรศัพท์",
                                            pattern: {
                                                value: /^[0-9]{10}$/,
                                                message: "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"
                                            }
                                        })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address Information */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ที่อยู่
                                    </label>
                                    <input
                                        {...register("address", { required: "กรุณากรอกที่อยู่" })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        ตำบล/แขวง
                                    </label>
                                    <input
                                        {...register("district", { required: "กรุณากรอกตำบล/แขวง" })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.district && (
                                        <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        อำเภอ/เขต
                                    </label>
                                    <input
                                        {...register("amphure", { required: "กรุณากรอกอำเภอ/เขต" })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.amphure && (
                                        <p className="mt-1 text-sm text-red-600">{errors.amphure.message}</p>
                                    )}
                                </div>
                            </div>

                                <div className="grid grid-cols-2 gap-4">
                                <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            จังหวัด
                                        </label>
                                        <input
                                            {...register("state", { required: "กรุณากรอกจังหวัด" })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.state && (
                                            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                                        )}
                                </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            รหัสไปรษณีย์
                                        </label>
                                        <input
                                            {...register("zipcode", {
                                                required: "กรุณากรอกรหัสไปรษณีย์",
                                                pattern: {
                                                    value: /^[0-9]{5}$/,
                                                    message: "กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง"
                                                }
                                            })}
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.zipcode && (
                                            <p className="mt-1 text-sm text-red-600">{errors.zipcode.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="mt-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    onChange={(e) => setIsChecked(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">
                                    ฉันยอมรับ <Link className="text-blue-600 hover:underline">ข้อกำหนด & เงื่อนไข</Link>
                                    {' '}และ{' '}
                                    <Link className="text-blue-600 hover:underline">นโยบายการช้อปปิ้ง</Link>
                                </span>
                            </label>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                                <p className="font-medium">เกิดข้อผิดพลาดในการสั่งซื้อ กรุณาลองใหม่อีกครั้ง</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="mt-6">
                        <h3 className="text-lg font-medium mb-2">วิธีการชำระเงินที่รองรับ:</h3>
                        <div className="flex space-x-4 py-4">
                            <div className="p-2">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKDv2FszUt_gcJAo2Qs8XmcSgqF0vxLQWxag&s" alt="Credit Card" className="h-8" />
                                <span className="text-sm">บัตรเครดิต/เดบิต</span>
                            </div>
                            <div className="p-2">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png" alt="PromptPay" className="h-8" />
                                <span className="text-sm">พร้อมเพย์</span>
                            </div>
                        </div>

                        <div className="mt-6 flex space-x-4">
                            <button
                                type="submit"
                                disabled={!isChecked || isProcessing}
                                className={`flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                                ${(!isChecked || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
                                transition duration-200 ease-in-out`}
                            >
                                {isProcessing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังนำไปสู่หน้าชำระเงิน...
                                </span>
                                ) : (
                                'ชำระเงินออนไลน์'
                                )}
                            </button>
                            
                            <button
                                type="button"
                                onClick={handleCashOnDelivery}
                                disabled={!isChecked || isProcessing}
                                className={`flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-lg
                                ${(!isChecked || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}
                                transition duration-200 ease-in-out`}
                            >
                                ชำระเงินปลายทาง
                            </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
  )
}

export default CheckoutPage
