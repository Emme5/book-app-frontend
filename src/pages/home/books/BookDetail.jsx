import React, { useEffect, useState } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { useParams } from 'react-router-dom'
import { getImgUrl } from '../../../utils/getImgUrl';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import { useFetchBookByIdQuery } from '../../../redux/features/books/booksApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const BookDetail = () => {
  const { id } = useParams();
  const { data: book, isLoading, isError } = useFetchBookByIdQuery(id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const dispatch = useDispatch();

  const handlePrevImage = () => {
    if (selectedImageIndex === -1) {
      // ถ้าอยู่ที่รูปหลัก ให้ไปรูปสุดท้ายของ coverImages
      setSelectedImageIndex(book.coverImages?.length - 1 || -1);
    } else {
      // ถ้าอยู่ที่รูปอื่น ให้ย้อนกลับไป 1 รูป หรือกลับไปที่รูปหลัก
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex === -1) {
      // ถ้าอยู่ที่รูปหลัก ให้ไปรูปแรกของ coverImages
      setSelectedImageIndex(book.coverImages?.length > 0 ? 0 : -1);
    } else if (selectedImageIndex < (book.coverImages?.length - 1)) {
      // ถ้ายังไม่ถึงรูปสุดท้าย ให้ไปรูปถัดไป
      setSelectedImageIndex(selectedImageIndex + 1);
    } else {
      // ถ้าถึงรูปสุดท้ายแล้ว ให้กลับไปที่รูปหลัก
      setSelectedImageIndex(-1);
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  useEffect(() => {
    if (book) {
      setSelectedImageIndex(-1);
    }
  }, [book]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500">
        <p>เกิดข้อผิดพลาดในการโหลดข้อมูลหนังสือ</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
        {/* รูปหนังสือ */}
        <div className='w-full md:w-1/2 min-h-[400px] md:min-h-[600px] flex flex-col'>
          <div className="sticky top-32 space-y-6 h-full">
            {/* รูปหลัก */}
            <div className="relative border rounded-lg overflow-hidden h-[300px] sm:h-[400px] md:h-[500px] group mx-4">
            <img 
              src={getImgUrl(selectedImageIndex === -1 ? book.coverImage : book.coverImages?.[selectedImageIndex])}
              alt={book.title} 
              className='w-full h-full object-contain rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300'
            />

      <button 
        onClick={handlePrevImage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6 text-gray-800" />
      </button>

      <button 
        onClick={handleNextImage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6 text-gray-800" />
      </button>
    </div>
            
            {/* รูปย่อยด้านล่าง */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 px-4 pb-4">

            {/* รูปเพิ่มเติม */}
        {book.coverImages?.map((image, index) => (
        <button 
          key={index}
          onClick={() => setSelectedImageIndex(index)}
          className={`relative min-w-[80px] w-20 h-20 rounded-lg overflow-hidden transition-all duration-300
              ${selectedImageIndex === -1 
                ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 shadow-lg' 
                : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 hover:scale-105'}`}
        >
          <img 
            src={getImgUrl(image)}
            alt={`${book.title} view ${index + 1}`}
            className='w-full h-full object-cover'
          />
          {selectedImageIndex === index && (
            <div className="absolute inset-0 bg-blue-500/10" />
          )}
        </button>
            ))}
          </div>

          </div>
        </div>

        {/* รายละเอียดเพิ่มเติมและชื่อหนังสือ */}
        <div className='w-full md:w-1/2 flex flex-col space-y-6'>
          <div className="flex-grow">
            <p className="text-blue-600 mb-2">{book.category}</p>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{book.title}</h1>
            <p className="text-lg text-gray-600">โดย {book.author || 'ชื่อผู้แต่ง, ชื่อผู้เขียน'}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500 line-through">฿{book.oldPrice?.toFixed(2)}</p>
            <p className="text-2xl font-bold text-green-500">฿{book.newPrice?.toFixed(2)}</p>
            {book.oldPrice > book.newPrice && (
              <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
                ลด {Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}%
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div className="border-t border-b border-gray-200 py-4">
              <p className="text-gray-600">
                <span className="font-semibold">วันที่วางจำหน่าย:</span>{' '}
                {new Date(book.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">รายละเอียด</h2>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </div>
          </div>

          <div className="flex gap-4 mt-auto pt-6">
            <button
              onClick={() => handleAddToCart(book)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 sm:px-6 rounded-lg
                      flex items-center justify-center gap-2 transition-colors duration-200 text-sm sm:text-base"
            >
              <FiShoppingCart className="text-xl" />
              <span>เพิ่มลงตะกร้า</span>
            </button>
            <button
              className="flex-1 border-2 border-blue-500 text-blue-500 hover:bg-blue-50 
                      py-3 px-4 sm:px-6 rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              ซื้อเลย
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
