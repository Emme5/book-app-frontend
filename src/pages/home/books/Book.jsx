import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useFetchAllBooksQuery } from "../../../redux/features/books/booksApi";
import { useNavigate } from 'react-router-dom';
import ModalBookDetail from "./ModalBookDetail";
import { ScanSearch } from 'lucide-react';

const categories = ["ทุกประเภท",
	"ธุรกิจ",
	"จิตวิทยา",
	"สยองขวัญ",
	"ภาษา",
	"การ์ตูน",
	"คอมพิวเตอร์",
	"สุขภาพ",
	"มังงะ",
	"ดนตรี",
	"ท่องเที่ยว",
	"ประวัติศาสตร์"
];

function Book() {
	const navigate = useNavigate();
	const { data: books = [], isLoading } = useFetchAllBooksQuery();
    const [selectedBookId, setSelectedBookId] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState("ทุกประเภท");
	const [currentPage, setCurrentPage] = useState(1)
	const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('q') || '';
	const booksPerPage = 48;

	// ฟังก์ชันกรองหนังสือตามหมวดหมู่และคำค้นหา
	const filteredBooks = Array.isArray(books) ? books.filter((book) => {
		const matchesCategory = 
			selectedCategory === "ทุกประเภท" || 
			book?.category?.toLowerCase() === selectedCategory?.toLowerCase();
		
		const searchTerms = searchQuery.toLowerCase();
		const matchesSearch = 
			searchQuery === '' || 
			book?.title?.toLowerCase().includes(searchTerms) ||
			book?.author?.toLowerCase().includes(searchTerms) ||
			book?.category?.toLowerCase().includes(searchTerms);
		
		return matchesCategory && matchesSearch;
	}) : [];

	const indexOfLastBook = currentPage * booksPerPage;
	const indexOfFirstBook = indexOfLastBook - booksPerPage;
	const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
	const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const handleViewDetail = (id) => {
		document.body.style.overflow = 'hidden';
        setSelectedBookId(id);
		setIsModalOpen(true);
    }

    const closeModal = () => {
		document.body.style.overflow = 'unset';
		setSelectedBookId(null);
		setIsModalOpen(false);
	};

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	// Reset category when search query changes
	useEffect(() => {
		console.log('Search Query:', searchQuery);
		console.log('Books:', books);
		console.log('Filtered Books:', filteredBooks);
		setSelectedCategory("ทุกประเภท");
		setCurrentPage(1);
	}, [searchQuery, books]);
	
	if (!books || (Array.isArray(books) && books.length === 0)) {
		return <div className="text-center py-10">ไม่พบข้อมูลหนังสือ</div>;
	}

	return (
		<div>
			{/* ส่วนตกแต่งตัวกรองหนังสือ */}
			<div className="mb-8 flex flex-wrap gap-2">
				{categories.map((category, index) => (
				<button
					key={index}
					onClick={() => setSelectedCategory(category)}
					className={`px-4 py-2 rounded-full text-sm transition-colors ${
					selectedCategory === category
						? "bg-blue-500 text-white"
						: "bg-gray-100 text-gray-700 hover:bg-gray-300"
					}`}
				>
					{category}
				</button>
				))}
			</div>

			{/* ส่วนแสดงหนังสือ */}
			{filteredBooks.length > 0 ? (
				<>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
				{currentBooks.map((book) => (
				<div key={book._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-500">
					{/* ทำให้การ์ดทั้งก้อนคลิกเพื่อไปหน้า BookDetail */}
					<div 
						className="cursor-pointer" 
						onClick={() => navigate(`/book/${book._id}`)}
					>
						<div className="relative">
							{/* ส่วนแสดงส่วนลด */}
							{book.oldPrice > book.newPrice && (
								<div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
									ลด {Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}%
								</div>
							)}
							<img
								src={book.coverImage}
								alt={book.title}
								className="w-screen sm:h-72 object-contain rounded-t-lg"
							/>
						</div>
						
						<div className="p-4">
							<h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">
								{book.title}
							</h3>
							<p className="text-sm text-gray-600">โดย {book.author}</p>
							<div className="mt-2 space-y-1">
								<p className="text-sm text-gray-500 line-through">฿{book.oldPrice.toFixed(2)}</p>
								<p className="text-lg font-bold text-green-500">฿{book.newPrice.toFixed(2)}</p>
							</div>
						</div>
					</div>

					{/* แยกปุ่ม Quick View ออกมา */}
					<div className="p-4 pt-0">
						<button
							onClick={(e) => {
								e.stopPropagation(); // ป้องกันการ bubble ขึ้นไปที่การ์ด
								handleViewDetail(book._id);
							}}
							className="w-full px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition flex items-center justify-center gap-2"
						>
							<ScanSearch size={20} />
							Quick View
						</button>
					</div>
				</div>
				))}
				</div>

						{totalPages > 1 && (
							<div className="flex justify-center gap-2 my-6">
							<button
								onClick={() => paginate(currentPage - 1)}
								disabled={currentPage === 1}
								className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
							>
								ก่อนหน้า
							</button>
							
							{[...Array(totalPages)].map((_, index) => (
								<button
								key={index}
								onClick={() => paginate(index + 1)}
								className={`px-4 py-2 rounded ${
									currentPage === index + 1
									? 'bg-blue-500 text-white'
									: 'bg-gray-200 hover:bg-gray-300'
								}`}
								>
								{index + 1}
								</button>
							))}
						
							<button
								onClick={() => paginate(currentPage + 1)}
								disabled={currentPage === totalPages}
								className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
							>
								ถัดไป
							</button>
							</div>
						)}
						</>
			  ) : (
				<div className="text-center py-10">
					<p className="text-lg text-gray-600">
						{searchQuery 
							? `ไม่พบหนังสือที่ตรงกับคำค้นหา "${searchQuery}"` 
							: "ไม่มีหนังสือในหมวดหมู่นี้"}
					</p>
				</div>
			)}

				{isModalOpen && (
					<ModalBookDetail bookId={selectedBookId} onClose={closeModal} />
				)}

			</div>
	);
}

export default Book;
