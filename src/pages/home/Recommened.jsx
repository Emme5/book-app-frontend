import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import BookCard from './books/BookCard';
import { useFetchAllBooksQuery } from '../../redux/features/books/booksApi';


const Recommended = () => {
    
    const progressCircle = useRef(null);
    const progressContent = useRef(null);

    const onAutoplayTimeLeft = (s, time, progress) => {
        if (progressCircle.current && progressContent.current) {
            progressCircle.current.style.setProperty('--progress', 1 - progress);
            progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
        }
    };

    const { data: books = [] } = useFetchAllBooksQuery();
    // กรองเฉพาะหนังสือที่มี recommended=true
    const recommendedBooks = books.filter(book => book.recommended === true)

const createSlides = () => {
    const slides = [];
    // เปลี่ยนจาก books เป็น recommendedBooks
    for (let i = 0; i < recommendedBooks.length; i += 6) {
        const slideBooks = recommendedBooks.slice(i, i + 6);
        const firstRow = slideBooks.slice(0, 3);
        const secondRow = slideBooks.slice(3, 6);
        
        if (firstRow.length > 0) {
            slides.push({
                firstRow,
                secondRow: secondRow.length > 0 ? secondRow : []
            });
        }
    }
    return slides;
};

    return (
        <div className="py-10 px-4 md:px-0">
            <h2 className="text-2xl md:text-4xl font-semibold mb-5">แนะนำสำหรับคุณ</h2>

            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                autoplay={{
                    delay: 4500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Navigation, Autoplay, Pagination]}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                className="mySwiper"
                style={{
                    "--swiper-pagination-bullet-inactive-color": "transparent",
                    "--swiper-pagination-bullet-inactive-opacity": "0",
                    "--swiper-pagination-bullet-size": "0px",
                    "--swiper-pagination-bottom": "0px"
                }}
            >
                {createSlides().map((slide, slideIndex) => (
                    <SwiperSlide key={slideIndex}>
                        <div className="flex flex-col gap-6">
                            {/* แถวที่ 1 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {slide.firstRow.map((book, index) => (
                                    <div key={index} className="w-full">
                                        <BookCard book={book} />
                                    </div>
                                ))}
                            </div>
                            {/* แถวที่ 2 */}
                            {slide.secondRow.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {slide.secondRow.map((book, index) => (
                                        <div key={index} className="w-full">
                                            <BookCard book={book} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Recommended;