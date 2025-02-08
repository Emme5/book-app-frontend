import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const SuccessPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        const checkPaymentStatus = async () => {
            const sessionId = searchParams.get('session_id');
            
            if (sessionId) {
                try {
                    // แก้ไข URL ให้ตรงกับ backend
                    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/check-payment/${sessionId}`);
                    if (!response.ok) {
                        throw new Error('Failed to check payment status');
                    }
                    
                    const data = await response.json();
    
                    if (data.status === 'paid') {
                        await Swal.fire({
                            title: 'ชำระเงินสำเร็จ!',
                            text: 'ขอบคุณสำหรับการสั่งซื้อ',
                            icon: 'success',
                            confirmButtonText: 'ดูรายการสั่งซื้อ'
                        });
                        navigate('/orders');
                    } else {
                        // กรณียังไม่ชำระเงิน
                        Swal.fire({
                            title: 'รอการตรวจสอบ',
                            text: 'กรุณารอสักครู่...',
                            icon: 'info',
                            showConfirmButton: false,
                            timer: 2000
                        });
                        // เช็คสถานะทุก 5 วินาที
                        const checkInterval = setInterval(async () => {
                            try {
                                const statusCheck = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/check-payment/${sessionId}`);
                                const statusData = await statusCheck.json();
                                if (statusData.status === 'paid') {
                                    clearInterval(checkInterval);
                                    await Swal.fire({
                                        title: 'ชำระเงินสำเร็จ!',
                                        text: 'ขอบคุณสำหรับการสั่งซื้อ',
                                        icon: 'success'
                                    });
                                    navigate('/orders');
                                }
                            } catch (error) {
                                clearInterval(checkInterval);
                                console.error('Error checking status:', error);
                            }
                        }, 5000);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: 'ไม่สามารถตรวจสอบสถานะการชำระเงินได้',
                        icon: 'error'
                    });
                }
            }
        };
    
        checkPaymentStatus();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">กำลังตรวจสอบการชำระเงิน...</h1>
                {/* เพิ่ม loading spinner ถ้าต้องการ */}
            </div>
        </div>
    );
};

export default SuccessPage;