import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import banner1 from "../../assets/banner1.png";
import banner2 from "../../assets/banner2.gif";
import banner3 from "../../assets/banner3.gif";


const Banner = ({ onNavigate }) => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const navigate = useNavigate();

	// เพิ่ม auto slide effect
	useEffect(() => {
		const timer = setInterval(() => {
		  setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000);
	
		return () => clearInterval(timer);
	  }, []);

	const slides = [
		{
		  image: banner1
		},
		{
			image: banner2
		},
		{
			image: banner3
		}
		//Can Add more slides as needed
	  ];
	  

	  // ฟังก์ชันควบคุมการสไลด์
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // เพิ่มฟังก์ชันสำหรับเลือกสไลด์โดยตรง
  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

	return (
		<div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      
 {slides.map((slide, index) => (
   <div
     key={index}
     className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
       currentSlide === index ? 'opacity-100' : 'opacity-0'
     }`}
   >
     <div 
       className="absolute inset-0 bg-cover bg-center"
       style={{backgroundImage: `url(${slide.image})`}}
     >
       <div className="absolute inset-0 bg-black/10"></div>
     </div>

      {/* Content */}
     <div className="relative h-full flex items-center z-10">
       <div className="px-8 md:px-16 lg:px-24 w-full">
         <div className={`max-w-xl transition-opacity duration-1000 ${
           currentSlide === index ? 'opacity-100' : 'opacity-0'
         }`}>
           <h2 className="text-4xl md:text-4xl font-bold mb-4 text-gray-900">
             {slide.title}
           </h2>
           <h1 className="text-4xl md:text-xl font-light mb-4 text-gray-900">
             {slide.subtitle}
           </h1>
           <button 
             onClick={() => navigate("/book")}
             className="text-xl bg-transparent border border-orange-500 text-orange-400 px-6 py-3 rounded-none flex items-center group hover:bg-orange-500 hover:text-white transition-colors"
           >
             เลือกซื้อ
             <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
           </button>
         </div>
       </div>
     </div>
   </div>
 ))}

      {/* Navigation Arrows - ปรับแต่งสไตล์ */}
      <button 
        onClick={prevSlide}
        className="opacity-0 hover:opacity-100 transition-opacity duration-300 w-12 h-full flex items-center justify-start px-2 group"
 >
          <ChevronLeft size={40} className="text-white/80 group-hover:text-white drop-shadow-lg" />
      </button>
      <button 
        className="opacity-0 hover:opacity-100 transition-opacity duration-300 w-12 h-full flex items-center justify-end px-2 ml-auto group"
        >
          <ChevronRight size={40} className="text-white/80 group-hover:text-white drop-shadow-lg" />
      </button>

      {/* Navigation Dots - ปรับแต่งสไตล์และเพิ่ม active state */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-white w-6' // ขยายความกว้างเมื่อ active
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
