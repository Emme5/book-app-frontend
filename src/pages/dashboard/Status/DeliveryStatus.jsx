import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { 
  useGetAllOrdersQuery, 
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation 
} from '../../../redux/features/order/ordersApi';
import { HashLoader } from 'react-spinners';
import eventEmitter from '../../../utils/eventEmitter';
import { Trash2 } from 'lucide-react';

const DeliveryStatus = () => {
  const { data: orders = [], isLoading, error } = useGetAllOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [searchTerm, setSearchTerm] = useState(''); // state สำหรับค้นหา
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [deleteOrderMutation] = useDeleteOrderMutation();
  // สร้าง state สำหรับ dropdown ที่เปิด/ปิด
  const [openOrderId, setOpenOrderId] = useState(null);

  // ฟังก์ชันสำหรับเปิด/ปิด dropdown
  const toggleOrderDetails = (orderId) => {
    setOpenOrderId(prevId => prevId === orderId ? null : orderId);
  };

  // สถานะที่เป็นไปได้ทั้งหมด
  const possibleStatuses = [
    "รอดำเนินการ",
    "ชำระเงินแล้ว",
    "กำลังจัดเตรียมสินค้า",
    "กำลังจัดส่ง",
    "จัดส่งสำเร็จ",
    "มีปัญหาในการจัดส่ง",
    "ยกเลิกการจัดส่ง"
  ];

  // ฟังก์ชันค้นหา
  useEffect(() => {
    if (orders && orders.length > 0) {
      const results = searchTerm
        ? orders.filter(order => 
            order._id && order._id.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : orders;
      
      // ใช้ setFilteredOrders เพียงครั้งเดียว
      setFilteredOrders(results);
    }
  }, [searchTerm, orders]);

  const handleDeleteOrder = async (orderId) => {
    try {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ',
            text: 'คุณต้องการลบรายการสั่งซื้อนี้ใช่หรือไม่?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
          await deleteOrderMutation(orderId).unwrap();
          setFilteredOrders(prev => prev.filter(order => order._id !== orderId));
          
          await Swal.fire({
              title: 'ลบสำเร็จ',
              text: 'ลบรายการสั่งซื้อเรียบร้อยแล้ว',
              icon: 'success',
              timer: 1500
          });
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถลบรายการได้',
          icon: 'error'
      });
  }
};

  // ฟังก์ชันอัพเดทสถานะ แก้ไขให้ใช้ mutation
  const handleStatusChange = async (newStatus, orderId) => {
    try {
      const result = await Swal.fire({
        title: 'ยืนยันการเปลี่ยนสถานะ',
        text: 'คุณต้องการเปลี่ยนสถานะการจัดส่งใช่หรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        // แก้ไขการ update status
        const response = await updateStatus({ 
          orderId, 
          status: newStatus 
        }).unwrap();
  
        // อัพเดท filteredOrders เพื่อสะท้อนการเปลี่ยนแปลง
        setFilteredOrders(prev => 
          prev.map(order => 
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
  
        await Swal.fire({
          title: 'สำเร็จ!',
          text: 'อัพเดทสถานะเรียบร้อยแล้ว',
          icon: 'success',
          timer: 1000
        });
        
        eventEmitter.emit('orderStatusUpdated')
      }
    } catch (error) {
      console.error('Error updating status:', error);
      await Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: error.message || 'ไม่สามารถอัพเดทสถานะได้',
        icon: 'error'
      });
    }
  };

  // ฟังก์ชันสำหรับแสดงสีของสถานะ
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
      case 'ชำระเงินแล้ว':
      return 'bg-green-100 text-green-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  // เพิ่ม Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
          <HashLoader color="#00ef15" />
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">จัดการสถานะการจัดส่ง</h1>
        
        {/* ช่องค้นหา */}
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาด้วยเลขที่คำสั่งซื้อ"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
          />
        </div>
      </div>

      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่คำสั่งซื้อ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อลูกค้า</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(filteredOrders || []).map((order) => (
              <React.Fragment key={order._id}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                    <button 
                      onClick={() => toggleOrderDetails(order._id)}
                      className="mr-2 text-blue-500 hover:text-blue-700"
                    >
                      {openOrderId === order._id ? '🔽' : '📶'}
                    </button>
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.productIds?.length} รายการ
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('th-TH') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status || "รอดำเนินการ"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-4">
                      <select
                        className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={(e) => handleStatusChange(e.target.value, order._id)}
                        value={order.status || "รอดำเนินการ"}
                      >
                        {possibleStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      
                      {/* ปุ่มลบ */}
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
                {openOrderId === order._id && (
                  <tr>
                    <td colSpan="6" className="bg-gray-50 p-4 border border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border-r border-gray-200 pr-4">
                          <h4 className="font-semibold mb-2">ข้อมูลลูกค้า</h4>
                          <p className='mb-3'>อีเมล: {order.email}</p>
                          <p className='mb-3'>เบอร์โทร: {order.phone}</p>
                          <p className='mb-3'>
                            เวลาสั่งซื้อ: {order.createdAt ? 
                              new Date(order.createdAt).toLocaleTimeString('th-TH', {
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : '-'}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">ที่อยู่จัดส่ง</h4>
                          <p className='mb-3'>{order.address.city}, {order.address.state}</p>
                          <p className='mb-3'>{order.address.country}, {order.address.zipcode}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryStatus;