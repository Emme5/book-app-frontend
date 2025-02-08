import React from 'react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../../redux/features/order/ordersApi';
import Swal from "sweetalert2";
import { HashLoader } from 'react-spinners';
import eventEmitter from '../../../utils/eventEmitter';

const DeliveryStatus = () => {
      // ใช้ hooks จาก RTK Query
  const { data: orders = [], isLoading, error } = useGetAllOrdersQuery();
  
  const [updateStatus] = useUpdateOrderStatusMutation();

  // สถานะที่เป็นไปได้ทั้งหมด
  const possibleStatuses = [
    "รอดำเนินการ",
    "กำลังจัดเตรียมสินค้า",
    "กำลังจัดส่ง",
    "จัดส่งสำเร็จ",
    "มีปัญหาในการจัดส่ง",
    "ยกเลิกการจัดส่ง"
  ];

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
        await updateStatus({ orderId, status: newStatus }).unwrap();

        await Swal.fire({
          title: 'สำเร็จ!',
          text: 'อัพเดทสถานะเรียบร้อยแล้ว',
          icon: 'success',
          timer: 1000
        });
        
        eventEmitter.emit('orderStatusUpdated');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      await Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถอัพเดทสถานะได้',
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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">จัดการสถานะการจัดส่ง</h1>
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
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order._id}</td>
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
                <select
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    onChange={(e) => handleStatusChange(e.target.value, order._id)}
                    value={order.status || "รอดำเนินการ"}
                  >
                    {possibleStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryStatus;