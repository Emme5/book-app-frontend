import React from 'react';
import { Link } from 'react-router-dom';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

import promoImage from "../../assets/books/promocomputer.jpg";

const Recommended = () => {
  const { data } = useFetchAllBooksQuery();
  const books = data?.books || []; // แก้ตรงนี้

const computerBooks = books.filter(book => 
    book.category?.toLowerCase() === 'คอมพิวเตอร์'
).slice(0, 8);

    return (
      <div className="py-6">
      <h2 className="text-3xl font-semibold mb-4 pb-4 border-b border-gray-500">หนังสือคอมพิวเตอร์ที่คุณอาจจะสนใจ</h2>

      <div className="flex flex-col md:flex-row gap-4">
        {/* รูปโปรโมชั่นด้านซ้าย */}
        <div className="md:w-1/4">
          <img 
            src={promoImage}
            alt=""
            className="w-full rounded-lg shadow-sm"
          />
        </div>

        {/* การ์ดหนังสือด้านขวา */}
        <div className="md:w-2/4 md:pl-4 md:border-l border-gray-500">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {computerBooks.map((book, index) => (
              <Link 
                key={index} 
                to={`/book/${book._id}`}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className="relative">
                  {book.oldPrice > book.newPrice && (
                    <div className="absolute top-1 right-1 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-medium">
                      ลด {Math.round(((book.oldPrice - book.newPrice) / book.oldPrice) * 100)}%
                    </div>
                  )}
                  <img 
                    src={book.coverImage} 
                    alt={book.title}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>

                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-medium text-green-500">
                      ฿{book.newPrice}
                    </span>
                    {book.oldPrice > book.newPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ฿{book.oldPrice}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ลิงก์ดูทั้งหมด */}
      <div className="mt-4 flex justify-end">
        <Link 
          to="/book?category=คอมพิวเตอร์"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ดูทั้งหมด
        </Link>
      </div>
    </div>
  );
};

export default Recommended;