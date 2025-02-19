import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../../redux/features/cart/cartSlice'
import { addToFavorites, fetchUserFavorites, removeFromFavorites } from '../../../redux/features/favorites/favoritesSlice'
import Swal from 'sweetalert2'
import { useAuth } from '../../../context/AuthContext';

const BookCard = ({book}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const dispatch = useDispatch();
  const { favoriteItems } = useSelector((state) => state.favorites);
  const isFavorite = Array.isArray(favoriteItems) && favoriteItems.some(item => 
    item?._id === book?._id
  );

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
  }

  const handleToggleFavorite = async () => {
    if (!currentUser) {
      Swal.fire({
        icon: 'warning',
        title: 'กรุณาเข้าสู่ระบบ',
        text: 'คุณต้องเข้าสู่ระบบก่อนเพิ่มหนังสือในรายการโปรด',
        showCancelButton: true,
        confirmButtonText: 'เข้าสู่ระบบ',
        cancelButtonText: 'ยกเลิก'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    try {
      const actionMethod = isFavorite ? removeFromFavorites : addToFavorites;
      const actionPayload = { bookId: book._id, userId: currentUser.uid };
  
      const result = await dispatch(actionMethod(actionPayload)).unwrap();
      
      // เพิ่มการเช็คผลลัพธ์จาก API
      if (!Array.isArray(result)) {
        throw new Error('Invalid response format');
      }
  
      // อัพเดท UI ทันทีหลังจากได้รับการตอบกลับ
      dispatch(fetchUserFavorites(currentUser.uid));
  
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: isFavorite ? 'นำออกจากรายการโปรดแล้ว' : 'เพิ่มในรายการโปรดแล้ว',
        showConfirmButton: false,
        timer: 1500,
        toast: true,
        background: '#4CAF50',
        color: '#fff',
        customClass: {
          popup: 'colored-toast'
        }
      });
    } catch (error) {
      console.error('Favorites Update Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: error.message || 'ไม่สามารถอัปเดตรายการโปรดได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  };

  return (
    <div className="rounded-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">
        <div className="sm:h-72 sm:flex-shrink-0 border rounded-md relative">
          {book?.oldPrice > book?.newPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold z-10">
              ลด {Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}%
            </div>
          )}
      {/* เพิ่มปุ่มหัวใจ */}
      <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
          >
            {isFavorite ? (
              <MdFavorite className="text-red-500 text-xl" />
            ) : (
              <MdFavoriteBorder className="text-red-500 text-xl" />
            )}
          </button>
          <Link to={`/book/${book._id}`}>
            <img
              src={book?.coverImage}
              alt=""
              className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>

        <div>
          <Link to={`/book/${book._id}`}>
            <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
              {book?.title}
            </h3>
          </Link>
          <p className="text-gray-600 mb-5">
            {book?.description ? 
              (book.description.length > 80 ? 
                `${book.description.slice(0, 80)}...` : 
                book.description
              ) : ''
            }
          </p>
          <p className="font-medium mb-5">
            ${book?.newPrice} <span className="line-through font-normal ml-2">
              ${book?.oldPrice}</span>
          </p>
          <button
            onClick={() => handleAddToCart(book)}
            className="btn-primary px-6 space-x-1 flex items-center gap-1"
          >
            <FiShoppingCart className="" />
            <span>เพิ่มลงตะกร้า</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookCard
