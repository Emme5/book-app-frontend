import React, { useEffect, useState } from 'react';
import BookCard from './books/BookCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';

const categories = [
  { name: "ทุกประเภท", color: "blue" },
  { name: "ธุรกิจ", color: "green" },
  { name: "นิยาย", color: "purple" },
  { name: "สยองขวัญ", color: "red" },
  { name: "ผจญภัย", color: "orange" },
  { name: "การตลาด", color: "yellow" }
];

const TopSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState("ทุกประเภท");
  const { data: books = [] } = useFetchAllBooksQuery();

  const filteredBooks = selectedCategory === "ทุกประเภท" 
    ? books 
    : books.filter(book => book.category === selectedCategory.toLowerCase());

  const getCategoryStyles = (categoryName, color) => {
    const isSelected = selectedCategory === categoryName;
    
    // สีพื้นฐาน
    const baseStyles = "px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium";
    
    // สีเมื่อเลือกและ hover ตามแต่ละหมวดหมู่
    const colorStyles = {
      blue: `${isSelected ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`,
      green: `${isSelected ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600 hover:bg-green-200'}`,
      purple: `${isSelected ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600 hover:bg-purple-200'}`,
      red: `${isSelected ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'}`,
      orange: `${isSelected ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600 hover:bg-orange-200'}`,
      yellow: `${isSelected ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'}`
    };

    return `${baseStyles} ${colorStyles[color]}`;
  };

  return (
    <div className='py-10'>
      <h2 className='text-4xl font-semibold mb-5'>
        สินค้าขายดี
      </h2>

      {/* category filtering */}
      <div className='mb-8 flex flex-wrap gap-2'>
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category.name)}
            className={getCategoryStyles(category.name, category.color)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        autoplay={{
          delay: 3000, // ตั้งค่าให้สไลด์ทุกๆ 3 วินาที
          disableOnInteraction: false, // ให้ autoplay ทำงานต่อหลังจากมีการเลื่อนด้วยตนเอง
        }}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 40 },
          1024: { slidesPerView: 2, spaceBetween: 50 },
          1180: { slidesPerView: 3, spaceBetween: 50 }
        }}
        modules={[Pagination, Navigation, Autoplay]} // เพิ่ม Autoplay
        className="mySwiper"
      >
        {
          filteredBooks.length > 0 && filteredBooks.map((book, index) => (
            <SwiperSlide key={index}>
              <BookCard book={book} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}

export default TopSellers;
