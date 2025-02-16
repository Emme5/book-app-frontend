import React, { useEffect, useState } from "react";
import { useFetchBookByIdQuery } from "../../../redux/features/books/booksApi";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ModalBookDetail({ bookId, onClose }) {
    const dispatch = useDispatch();
	const navigate = useNavigate();
    const { data: bookDetail, isLoading } = useFetchBookByIdQuery(bookId);
    const [selectedImageIndex, setSelectedImageIndex] = useState(-1);

	const handlePrevImage = () => {
        if (selectedImageIndex === -1) {
            setSelectedImageIndex(bookDetail.coverImages?.length - 1 || -1);
        } else {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const handleNextImage = () => {
        if (selectedImageIndex === -1) {
            setSelectedImageIndex(bookDetail.coverImages?.length > 0 ? 0 : -1);
        } else if (selectedImageIndex < (bookDetail.coverImages?.length - 1)) {
            setSelectedImageIndex(selectedImageIndex + 1);
        } else {
            setSelectedImageIndex(-1);
        }
    };

	function handleAddToCart(id) {
        dispatch(addToCart(id));
    }

	if (!bookId) return null;

	return (
		<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl overflow-hidden relative">
                {/* ปุ่มปิด */}
                <button
                    className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 
                              bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]">
                        {/* ส่วนรูปภาพ */}
                        <div className="md:w-1/2 p-4 bg-gray-50">
							<div className="relative h-[300px] md:h-[400px] group">
								<img
									src={selectedImageIndex === -1 ? bookDetail?.coverImage : bookDetail?.coverImages?.[selectedImageIndex]}
									alt={bookDetail?.title}
									className="w-full h-full object-contain rounded-lg"
								/>
								
								{/* ปุ่มเลื่อนรูป */}
								<button 
									onClick={handlePrevImage}
									className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 
											rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<ChevronLeft className="w-6 h-6 text-gray-800" />
								</button>

								<button 
									onClick={handleNextImage}
									className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 
											rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<ChevronRight className="w-6 h-6 text-gray-800" />
								</button>
							</div>
						</div>

					{/* ส่วนรายละเอียด */}
					<div className="md:w-1/2 p-6 overflow-y-auto">
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm mb-3">
                                {bookDetail?.category}
                            </span>
                            
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                {bookDetail?.title}
                            </h2>
                            
                            <p className="text-gray-600 text-sm mb-4">
                                โดย {bookDetail?.author}
                            </p>

                            {/* วันที่วางจำหน่าย */}
                            <p className="text-sm text-gray-500 mb-4">
                                วันที่วางจำหน่าย: {new Date(bookDetail?.createdAt).toLocaleDateString('th-TH')}
                            </p>

                            {/* รายละเอียดแบบย่อ */}
                            <p className="text-gray-600 mb-6 text-sm line-clamp-3">
                                {bookDetail?.description}
                            </p>

                            {/* ราคา */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-500 line-through">
                                    ฿{bookDetail?.oldPrice?.toFixed(2)}
                                </p>
                                <p className="text-2xl font-bold text-green-500">
                                    ฿{bookDetail?.newPrice?.toFixed(2)}
                                </p>
                                {bookDetail?.oldPrice > bookDetail?.newPrice && (
                                    <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium mt-1">
                                        ลด {Math.round(((bookDetail.oldPrice - bookDetail.newPrice) / bookDetail.oldPrice) * 100)}%
                                    </span>
                                )}
                            </div>

                            {/* ปุ่มดำเนินการ */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleAddToCart(bookDetail)}
                                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 
                                             transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    เพิ่มลงตะกร้า
                                </button>
                                
                                <button
                                    onClick={() => {
                                        navigate(`/book/${bookDetail._id}`);
                                        onClose();
                                    }}
                                    className="w-full border-2 border-blue-500 text-blue-500 py-2 rounded-lg 
                                             hover:bg-blue-50 transition-colors"
                                >
                                    ดูหนังสือ ➡️
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ModalBookDetail;
