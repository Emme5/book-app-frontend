import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { useCancelOrderMutation } from '../../../redux/features/order/ordersApi';

const CancelPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cancelOrder] = useCancelOrderMutation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const orderId = searchParams.get('order_id');

        if (orderId) {
            cancelOrder(orderId)
              .unwrap()
              .then(data => console.log('Order canceled:', data))
              .catch(error => console.error('Error canceling order:', error));
          }
        }, [location, cancelOrder]);
        
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <XCircle className="h-16 w-16 text-red-500" />
                </div>

                {/* Message */}
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    การชำระเงินถูกยกเลิก
                </h1>
                <p className="text-gray-600 mb-8">
                    คุณได้ยกเลิกการชำระเงิน หากมีข้อสงสัยหรือต้องการความช่วยเหลือ 
                    กรุณาติดต่อเรา
                </p>

                {/* Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/cart')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        กลับไปที่ตะกร้าสินค้า
                    </button>
                    
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-200"
                    >
                        กลับไปหน้าหลัก
                    </button>
                </div>

                {/* Contact Information */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        มีคำถาม? ติดต่อเราได้ที่{' '}
                        <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                            support@example.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CancelPage;