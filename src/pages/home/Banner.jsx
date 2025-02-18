import React, { useState, useEffect } from 'react';
import { Book, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnimatedBanner = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      gradient: "from-orange-100 to-amber-100",
      title: "เปิดโลกการอ่าน",
      subtitle: "เปิดประตูสู่จินตนาการไปด้วยกัน",
      textColor: "text-orange-800",
      subtitleColor: "text-orange-700",
      buttonColor: "border-orange-500 text-orange-600 hover:bg-orange-500",
      pathColor: "#f97316"
    },
    {
      gradient: "from-blue-100 to-purple-100",
      title: "หนังสือดีๆ รอคุณอยู่",
      subtitle: "ค้นพบเรื่องราวใหม่ๆ ทุกวัน",
      textColor: "text-blue-800",
      subtitleColor: "text-blue-700",
      buttonColor: "border-blue-500 text-blue-600 hover:bg-blue-500",
      pathColor: "#2563eb"
    },
    {
      gradient: "from-green-100 to-teal-100",
      title: "อ่านหนังสือดี ชีวิตดี",
      subtitle: "พบกับหนังสือคุณภาพมากมาย",
      textColor: "text-green-800",
      subtitleColor: "text-green-700",
      buttonColor: "border-green-500 text-green-600 hover:bg-green-500",
      pathColor: "#22c55e"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

	return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 
            ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className={`relative w-full h-full bg-gradient-to-r ${slide.gradient}`}>
            {/* Animated background elements */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: 0.1
                  }}
                >
                  <Book size={32} className={slide.textColor + " rotate-12"} />
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="relative h-full flex items-center z-10">
              <div className="px-8 md:px-16 lg:px-24 w-full">
                <div className="max-w-xl animate-slideIn">
                  <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${slide.textColor} animate-fadeIn`}>
                    {slide.title}
                  </h2>
                  <h1 className={`text-2xl md:text-3xl font-light mb-6 ${slide.subtitleColor} animate-fadeInDelay`}>
                    {slide.subtitle}
                  </h1>
                  <button 
                    onClick={() => navigate("/book")}
                    className={`text-xl bg-transparent border px-6 py-3 
                      rounded-lg flex items-center group hover:text-white 
                      transition-all duration-300 shadow-lg ${slide.buttonColor}`}
                  >
                    เลือกซื้อ
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 
          transition-opacity duration-300 w-12 h-12 flex items-center justify-center group"
      >
        <ChevronLeft size={40} className="text-gray-800/80 group-hover:text-gray-800 drop-shadow-lg" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 
          transition-opacity duration-300 w-12 h-12 flex items-center justify-center group"
      >
        <ChevronRight size={40} className="text-gray-800/80 group-hover:text-gray-800 drop-shadow-lg" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-gray-800 w-6'
                : 'bg-gray-800/50 hover:bg-gray-800/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Add required styles
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(10deg); }
  }
  
  @keyframes shine {
    from { transform: translateX(-100%); }
    to { transform: translateX(100%); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(-100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeInDelay {
    0% { opacity: 0; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-shine {
    animation: shine 3s linear infinite;
  }
  
  .animate-slideIn {
    animation: slideIn 1s ease-out forwards;
  }
  
  .animate-fadeIn {
    animation: fadeIn 1s ease-out forwards;
  }
  
  .animate-fadeInDelay {
    animation: fadeInDelay 2s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default AnimatedBanner;
