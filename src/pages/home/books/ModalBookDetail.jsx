import React, { useEffect, useState } from "react";
import { useFetchBookByIdQuery } from "../../../redux/features/books/booksApi";
import { getImgUrl } from "../../../utils/getImgUrl";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/features/cart/cartSlice";


function ModalBookDetail({ bookId, onClose }) {
	const dispatch = useDispatch();
	const { data: bookDetail, isLoading } = useFetchBookByIdQuery(bookId);

	function handleAddToCart(id) {
		dispatch(addToCart(id));
	}

	if (!bookId) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white w-full max-w-4xl p-4 md:p-8 rounded-lg shadow-lg 
                    animate-[fadeIn_0.3s_ease-out] scale-100 transform transition-all
                    mx-auto h-[90vh] md:h-auto overflow-y-auto">
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<div className="flex flex-col md:flex-row gap-4 md:gap-8">
					{/* Left side - Image */}
					<div className="w-full md:w-1/2">
					<img
						src={getImgUrl(bookDetail?.coverImage)}
						alt={bookDetail?.title}
						className="w-full h-auto max-h-[40vh] md:max-h-full object-contain rounded-md"
					/>
					</div>

					{/* Right side - Content */}
					<div className="w-full md:w-1/2 flex flex-col">
					<div className="flex justify-between items-start">
						<div>
						<p className="text-gray-600 mb-2 text-sm">
							{bookDetail?.category}
						</p>
						<h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
							{bookDetail?.title}
						</h2>
						</div>
						<button
							className="text-gray-500 hover:text-gray-700 text-2xl transition-colors p-2"
							onClick={onClose}
						>
						&times;
						</button>
					</div>

					{/* Description */}
					<p className="text-gray-600 mb-8 text-sm md:text-base">
						{bookDetail?.description}
					</p>

					<div className="mb-8">
						<p className="text-sm text-gray-500 line-through">
						฿{bookDetail?.oldPrice?.toFixed(2)}
						</p>
						<p className="text-xl md:text-2xl font-bold text-green-500">
						฿{bookDetail?.newPrice?.toFixed(2)}
						</p>
						{bookDetail?.oldPrice > bookDetail?.newPrice && (
						<p className="text-sm text-red-500 font-bold">
							ลด {Math.round(((bookDetail.oldPrice - bookDetail.newPrice) / bookDetail.oldPrice) * 100)}%
						</p>
						)}
					</div>

					{/* Buttons */}
					<div className="flex gap-4 mt-auto">
						<button
						className="flex-1 border-2 border-blue-500 text-blue-500 py-2 md:py-3 px-4 rounded 
                           hover:bg-blue-50 transition-colors text-sm md:text-base"
						onClick={() => handleAddToCart(bookDetail)}
						>
						เพิ่มลงตะกร้า
						</button>
						<button 
						className="flex-1 bg-blue-500 text-white py-2 md:py-3 px-4 rounded 
                           hover:bg-blue-600 transition-colors text-sm md:text-base"
						>
						ซื้อเลย
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
