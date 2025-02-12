import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../redux/features/cart/cartSlice'

const BookCard = ({book}) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
  }

  return (
    <div className=" rounded-lg transition-shadow duration-300">
  <div className="flex flex-col sm:flex-row sm:items-center sm:h-72 sm:justify-center gap-4">
    <div className="sm:h-72 sm:flex-shrink-0 border rounded-md relative">
    {book?.oldPrice > book?.newPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold z-10">
              ลด {Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}%
            </div>
          )}
      <Link to={`/book/${book._id}`}>
        <img
          src={book?.coverImage}
          alt=""
          className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"/>
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
      className="btn-primary px-6 space-x-1 flex items-center gap-1 ">
        <FiShoppingCart className="" />
        <span>เพิ่มลงตะกร้า</span>
      </button>
    </div>
  </div>
</div>
  )
}

export default BookCard
