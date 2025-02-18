import React, { useEffect } from 'react'
import { useGetOrderByEmailQuery } from '../../../redux/features/order/ordersApi';
import { useFetchBooksByIdsQuery } from '../../../redux/features/books/booksApi';
import { useAuth } from '../../../context/AuthContext';
import eventEmitter from '../../../utils/eventEmitter';

const OrderPage = () => {
  const { currentUser } = useAuth();
  const { 
    data: orders = [], 
    isLoading: ordersLoading, 
    isError: ordersError,
    refetch
  } = useGetOrderByEmailQuery(currentUser?.email, {
    // ไม่เรียก API ถ้าไม่มี email
    skip: !currentUser?.email
  });

  const validOrders = orders.filter(order => 
    order.status !== 'ยกเลิกการจัดส่ง' && 
    order.paymentStatus !== 'ยกเลิก' &&
    order.paymentStatus !== 'pending'
  );

  // เพิ่ม useEffect เพื่อรับ event
  useEffect(() => {
    const handleStatusUpdate = () => {
      refetch();  // เรียก API ใหม่เมื่อสถานะมีการเปลี่ยนแปลง
    };

    eventEmitter.on('orderStatusUpdated', handleStatusUpdate);

    // Cleanup
    return () => {
      eventEmitter.remove('orderStatusUpdated', handleStatusUpdate);
    };
  }, [refetch]);

  const allBookIds = orders.flatMap(order => order.productIds);
  
  const {
    data: books = [],
    isLoading: booksLoading,
    isError: booksError
  } = useFetchBooksByIdsQuery(allBookIds, {
    skip: allBookIds.length === 0
  });

  const booksMap = books.reduce((acc, book) => {
    acc[book._id] = book;
    return acc;
  }, {});

  if (ordersError || booksError) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <p className="font-bold">เกิดข้อผิดพลาด</p>
        <p className="text-sm">ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง</p>
      </div>
    </div>
  );

  // เพิ่มฟังก์ชัน getStatusColor
const getStatusColor = (status) => {
  switch(status) {
    case 'จัดส่งสำเร็จ':
      return 'bg-green-100 text-green-800';
    case 'กำลังจัดส่ง':
      return 'bg-blue-100 text-blue-800';
    case 'กำลังจัดเตรียมสินค้า':
      return 'bg-yellow-100 text-yellow-800';
    case 'มีปัญหาในการจัดส่ง':
      return 'bg-red-100 text-red-800';
    case 'ยกเลิกการจัดส่ง':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-purple-100 text-purple-800'; // สำหรับ "รอดำเนินการ"
  }
};

  return (
    <div className='container mx-auto p-4 sm:p-6 min-h-screen bg-gray-50'>
      <h2 className='text-2xl md:text-3xl font-mono mb-6 text-gray-800'>ประวัติการสั่งซื้อของคุณ</h2>
      
      {validOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-600 text-lg">ยังไม่มีรายการสั่งซื้อที่สมบูรณ์</p>
        </div>
      ) : (
        <div className="space-y-6">
          {validOrders.map((order, index) => (
            <div key={order._id} 
              className='bg-white border rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300'>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <p className='px-4 py-1.5 bg-orange-500 text-white rounded-full text-sm'>
                  คำสั่งซื้อที่ {index + 1}
                </p>
                <span className={`px-4 py-1.5 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  สถานะ : {order.status || 'รอดำเนินการ'}
                </span>
              </div>
              
              <h2 className='font-bold mt-4 text-gray-700'>หมายเลขคำสั่งซื้อ: {order._id}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className='font-semibold text-gray-700 mb-3'>ข้อมูลลูกค้า</h3>
                  <div className="space-y-2">
                    <p className='text-gray-600'><span className="font-medium">ชื่อ:</span> {order.name}</p>
                    <p className='text-gray-600'><span className="font-medium">อีเมล:</span> {order.email}</p>
                    <p className='text-gray-600'><span className="font-medium">เบอร์โทร:</span> {order.phone}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className='font-semibold text-gray-700 mb-3'>ที่อยู่จัดส่ง</h3>
                  <p className='text-gray-600'>
                    {order.address.city}, {order.address.state},
                    <br/>
                    {order.address.country}, {order.address.zipcode}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className='font-semibold text-gray-700 mb-3'>รายการหนังสือ</h3>
                <div className='mt-2 space-y-3'>
                {order.productIds.map((bookId) => {
                  const book = booksMap[bookId];

                    return (
                      <div key={bookId} 
                        className="flex items-start space-x-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                        {book ? (
                          <>
                            {/* ส่วนแสดงรูปภาพ */}
                            <img 
                              src={book.coverImage} // ใช้ URL จาก Cloudinary โดยตรง
                              alt={book.title} 
                              className="w-20 h-24 object-cover rounded-md shadow-sm"
                              onError={(e) => {
                                e.target.src = '/placeholder-book.png';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate">{book.title}</h4>
                              <p className="text-sm text-gray-600">หมวดหมู่: {book.category}</p>
                              
                              {/* แสดงราคาพร้อมส่วนลด (ถ้ามี) */}
                              <div className="mt-2">
                                <span className="text-sm font-medium text-green-600">
                                  ${book.newPrice} 
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-500 py-2">ไม่พบข้อมูลหนังสือ ({bookId})</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                <div className="space-y-1 sm:space-y-0 sm:space-x-4">
                  <span className="text-gray-600">
                    วันที่: {order.createdAt ? 
                      new Date(order.createdAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : '-'}
                  </span>
                  <span className="text-gray-600">
                    เวลา: {order.createdAt ? 
                      new Date(order.createdAt).toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      }) : '-'} น.
                  </span>
                </div>
                <p className='text-xl font-bold text-gray-800'>
                  ยอดรวม: ฿{order.totalPrice ? order.totalPrice.toLocaleString() : '0'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderPage;