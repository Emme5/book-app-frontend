import React, { useEffect, useState } from 'react';
import BookCard from './books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';
import { ChevronDown, ChevronUp } from 'lucide-react';

const categories = [
  { name: "ทุกประเภท", color: "blue" },
  { name: "ธุรกิจ", color: "green" },
  { name: "จิตวิทยา", color: "purple" },
  { name: "สยองขวัญ", color: "red" },
  { name: "ภาษา", color: "pink" },
  { name: "การ์ตูน", color: "yellow" },
  { name: "คอมพิวเตอร์", color: "cyan" },
  { name: "สุขภาพ", color: "teal" },
  { name: "มังงะ", color: "indigo" },
  { name: "ดนตรี", color: "orange" },
  { name: "ท่องเที่ยว", color: "emerald" },
  { name: "ประวัติศาสตร์", color: "amber" }
];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("ทุกประเภท");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const { data: books = [] } = useFetchAllBooksQuery();

    // กรองหนังสือที่มี trending=true ก่อน แล้วค่อยกรองตามหมวดหมู่
    const trendingBooks = books.filter(book => book.trending === true);
    const filteredBooks = selectedCategory === "ทุกประเภท" 
    ? trendingBooks 
    : trendingBooks.filter(book => book.category?.toLowerCase() === selectedCategory.toLowerCase());

  const getCategoryStyles = (categoryName, color) => {
    const isSelected = selectedCategory === categoryName;
    const baseStyles = "px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium";
    
    // สีเมื่อเลือกและ hover ตามแต่ละหมวดหมู่
    const colorStyles = {
      blue: `${isSelected ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`,
      green: `${isSelected ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600 hover:bg-green-200'}`,
      purple: `${isSelected ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`,
      red: `${isSelected ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'}`,
      pink: `${isSelected ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-600 hover:bg-pink-200'}`,
      yellow: `${isSelected ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'}`,
      cyan: `${isSelected ? 'bg-cyan-500 text-white' : 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200'}`,
      teal: `${isSelected ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-600 hover:bg-teal-200'}`,
      indigo: `${isSelected ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'}`,
      orange: `${isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`,
      emerald: `${isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'}`,
      amber: `${isSelected ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'}`
    };

    return `${baseStyles} ${colorStyles[color]}`;
  };

  return (
    <div className='py-6 md:py-10 px-4 md:px-0'>
      <h2 className='text-2xl md:text-4xl font-semibold mb-4 md:mb-5'>
        สินค้าขายดี <span role='img' aria-label='fire'>🔥</span>
      </h2>

      {/* category filtering */}
      <div className='mb-6 md:mb-8'>
        <div className='flex flex-wrap gap-2 items-center'>
          {categories.slice(0, 3).map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category.name)}
              className={`${getCategoryStyles(category.name, category.color)} text-xs md:text-sm`}
            >
              {category.name}
            </button>
          ))}
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-300 text-xs md:text-sm font-medium border border-gray-300 flex items-center"
          >
            {showAllCategories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span className="ml-1">อื่นๆ</span>
          </button>
        </div>
        
        {showAllCategories && (
          <div className="mt-3 md:mt-4 bg-white p-3 md:p-4 rounded-lg shadow-md">
            <div className="flex flex-wrap gap-2">
              {categories.slice(3).map((category, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setShowAllCategories(false);
                  }}
                  className={`${getCategoryStyles(category.name, category.color)} text-xs md:text-sm`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        autoplay={{
          delay: 5000, // ตั้งค่าให้สไลด์ทุกๆ 3 วินาที
          disableOnInteraction: false, // ให้ autoplay ทำงานต่อหลังจากมีการเลื่อนด้วยตนเอง
        }}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1280: { slidesPerView: 3, spaceBetween: 30 }
        }}
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
       {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="text-center py-10">
              <p className="text-base md:text-lg text-gray-600">ไม่มีหนังสือในหมวดหมู่นี้</p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
}

export default TopSellers;
