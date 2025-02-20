import React, { useState, useEffect } from 'react'
import { useDeleteBookMutation, useFetchAllBooksQuery } from '../../../redux/features/books/booksApi';
import { Link, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const ManageBooks = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 20;
    
    const { 
        data, 
        error: fetchError, 
        isLoading,
        refetch 
    } = useFetchAllBooksQuery({
        page: currentPage,
        limit: ITEMS_PER_PAGE
    });

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < data?.totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const [deleteBook] = useDeleteBookMutation();

    // ฟังก์ชันลบหนังสือ
    const handleDeleteBook = async (id) => {
        try {
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
                await refetch(); // Refetch หลังลบ
                Swal.fire({
                    title: 'ลบสำเร็จ!',
                    text: 'หนังสือและรูปภาพถูกลบเรียบร้อยแล้ว',
                    icon: 'success',
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Delete error:', error);
            Swal.fire({
                title: 'เกิดข้อผิดพลาด!',
                text: error.message || 'ไม่สามารถลบหนังสือได้',
                icon: 'error'
            });
        }
    };
    
    // กรองหนังสือตามการค้นหา
    const filteredBooks = data?.books?.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // แสดง loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // แสดง error state
    if (fetchError) {
        return (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                <p>เกิดข้อผิดพลาดในการโหลดข้อมูล: {fetchError.message}</p>
            </div>
        );
    }

    return (
        <section className="py-1 bg-blueGray-50">
            <div className="w-full xl:w-10/12 mb-12 px-4 mx-auto mt-24">
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                    {/* ส่วนหัวและการค้นหา */}
                    <div className="rounded-t mb-0 px-4 py-3 border-0">
                        <div className="flex flex-wrap items-center justify-between">
                            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className="font-semibold text-base text-blueGray-700">
                                หนังสือทั้งหมด ({data?.totalBooks || 0} เล่ม)
                            </h3>
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

                    {/* ตารางแสดงรายการหนังสือ */}
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
                                {!filteredBooks || filteredBooks.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-500">
                                            {searchTerm ? 'ไม่พบหนังสือที่ค้นหา' : 'ไม่มีรายการหนังสือ'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBooks.map((book, index) => (
                                        <tr key={book._id}>
                                            <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left text-blueGray-700">
                                                {index + 1}
                                            </th>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                {book.title}
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                {book.category}
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                                ${book.newPrice}
                                            </td>
                                            <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 space-x-4">
                                                <Link 
                                                    to={`/dashboard/edit-book/${book._id}`} 
                                                    className="font-medium text-indigo-600 hover:text-indigo-700 mr-2 hover:underline underline-offset-2"
                                                >
                                                    แก้ไข
                                                </Link>
                                                <button 
                                                    onClick={() => handleDeleteBook(book._id)}
                                                    className="font-medium bg-red-500 py-1 px-4 rounded-full text-white mr-2 hover:bg-red-600 transition-colors"
                                                >
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
            <div className="flex justify-center items-center space-x-4 mt-4 mb-8">
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${
                        currentPage === 1 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    หน้าก่อนหน้า
                </button>
                
                <span className="text-gray-600">
                    หน้า {data?.currentPage} จาก {data?.totalPages}
                </span>
                
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === data?.totalPages}
                    className={`px-4 py-2 rounded ${
                        currentPage === data?.totalPages 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                    หน้าถัดไป
                </button>
            </div>
        </section>
    );
};

export default ManageBooks;