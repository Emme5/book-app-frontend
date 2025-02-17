import React, { useState } from 'react'
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const ManageBooks = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const {data: books, refetch} = useFetchAllBooksQuery()
    const [deleteBook] = useDeleteBookMutation()
    const handleDeleteBook = async (id) => {
        try {
            // แสดง confirm dialog ก่อนลบ
            const result = await Swal.fire({
                title: 'ยืนยันการลบ',
                text: "คุณต้องการลบหนังสือเล่มนี้ใช่หรือไม่? (รูปภาพจะถูกลบด้วย)",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'ใช่, ลบเลย',
                cancelButtonText: 'ยกเลิก'
            });
    
            if (result.isConfirmed) {
                await deleteBook(id).unwrap();
                Swal.fire({
                    title: 'ลบสำเร็จ!',
                    text: 'หนังสือและรูปภาพถูกลบเรียบร้อยแล้ว',
                    icon: 'success',
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error details:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: error.message || 'ไม่สามารถลบหนังสือได้',
                icon: 'error'
            });
        }
    };
    
    const filteredBooks = books?.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Handle navigating to Edit Book page
    const handleEditClick = (id) => {
        navigate(`dashboard/edit-book/${id}`);
    };

  return (
    <section className="py-1 bg-blueGray-50">
    <div className="w-full xl:w-10/12 mb-12 px-4 mx-auto mt-24"> {/* เปลี่ยนจาก w-8/12 เป็น w-10/12 */}
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            {/* ส่วนหัวและการค้นหา */}
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-semibold text-base text-blueGray-700">หนังสือทั้งหมด</h3>
                    </div>
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <input
                            type="text"
                            placeholder="ค้นหาหนังสือ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="block w-full overflow-x-auto">
                <table className="items-center bg-transparent w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                #
                            </th>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                ชื่อหนังสือ
                            </th>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                หมวดหมู่
                            </th>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                ราคา
                            </th>
                            <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                                จัดการ
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredBooks?.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-gray-500">
                                    ไม่พบหนังสือที่ค้นหา
                                </td>
                            </tr>
                        ) : (
                            filteredBooks?.map((book, index) => (
                                <tr key={index}>
                                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700 ">
                                        {index + 1}
                                    </th>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ">
                                        {book.title}
                                    </td>
                                    <td className="border-t-0 px-6 align-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        {book.category}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                        ${book.newPrice}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 space-x-4">
                                        <Link to={`/dashboard/edit-book/${book._id}`} className="font-medium text-indigo-600 hover:text-indigo-700 mr-2 hover:underline underline-offset-2">
                                            แก้ไข
                                        </Link>
                                        <button 
                                            onClick={() => handleDeleteBook(book._id)}
                                            className="font-medium bg-red-500 py-1 px-4 rounded-full text-white mr-2">
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>
  )
}

export default ManageBooks
