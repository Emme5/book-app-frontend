import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

import news1 from "../../assets/news/news-1.png"
import news2 from "../../assets/news/news-2.png"
import news3 from "../../assets/news/news-3.png"
import news4 from "../../assets/news/new-6.webp"
import news5 from "../../assets/news/new-5.webp"
import news6 from "../../assets/news/new-7.webp"
import { Link } from 'react-router-dom';

const news = [
  {
    "id": 1,
    "title": "การประชุมสุดยอดสภาพภูมิอากาศโลกเรียกร้องให้ดำเนินการอย่างเร่งด่วน",
    "description": "ผู้นำโลกมารวมตัวกันที่การประชุมสุดยอดสภาพภูมิอากาศโลกเพื่อหารือเกี่ยวกับกลยุทธ์เร่งด่วนในการต่อสู้กับการเปลี่ยนแปลงสภาพภูมิอากาศ โดยมุ่งเน้นไปที่การลดการปล่อยคาร์บอนและส่งเสริมโซลูชั่นพลังงานหมุนเวียน",
    "image": news1
  },
  {
    "id": 2,
    "title": "ประกาศความก้าวหน้าในเทคโนโลยี AI",
    "description": "นักวิจัยได้ประกาศความก้าวหน้าครั้งสำคัญในปัญญาประดิษฐ์ โดยมีความก้าวหน้าใหม่ที่สัญญาว่าจะปฏิวัติอุตสาหกรรมตั้งแต่การดูแลสุขภาพไปจนถึงการเงิน",
    "image": news2
  },
  {
    "id": 3,
    "title": "ภารกิจอวกาศใหม่มุ่งสำรวจดาราจักรที่ห่างไกล",
    "description": "นาซ่าได้เปิดเผยแผนการสำหรับภารกิจอวกาศใหม่ที่จะมุ่งสำรวจดาราจักรที่ห่างไกล โดยมีความหวังว่าจะค้นพบข้อมูลเชิงลึกเกี่ยวกับต้นกำเนิดของจักรวาล",
    "image": news3
  },
  {
    "id": 4,
    "title": "Meta ปรับตำแหน่งผู้บริหารระดับสูงฝ่ายนโยบายสาธารณะ",
    "description": "โดย Nick Clegg อดีตรองนายกรัฐมนตรีอังกฤษที่อยู่ในตำแหน่งนี้มาตั้งแต่ปี 2018 จะลงจากตำแหน่ง และแต่งตั้ง Joel Kaplan รองประธานฝ่ายนโยบายของ Meta มารับตำแหน่งแทน Clegg โพสต์ใน Threads ว่าตอนนี้เป็นเวลาเหมาะสมในการลงจากตำแหน่งของเขา ซึ่งเขาจะใช้เวลาจากนี้ในการส่งต่องานให้กับ Kaplan ทั้งคู่ทำงานร่วมกันมาระยะหนึ่งแล้ว Clegg ยังบอกว่า Kaplan เป็นคนที่เหมาะสมสำหรับงานนี้ในช่วงเวลาตอนนี้",
    "image": news6
  },
  {
    "id": 5,
    "title": "สมาร์ทโฟนรุ่นใหม่ที่เป็นนวัตกรรมเปิดตัวโดยบริษัทเทคโนโลยีชั้นนำ",
    "description": "บริษัทเทคโนโลยีชั้นนำได้เปิดตัวสมาร์ทโฟนรุ่นล่าสุดที่มีเทคโนโลยีล้ำสมัย อายุการใช้งานแบตเตอรี่ที่ดีขึ้น และการออกแบบใหม่ที่เพรียวบาง",
    "image": news4
  },
  {
    "id": 6,
    "title": "NVIDIA ประกาศออกแอพคลาวด์เกมมิ่ง GeForce Now สำหรับ Steam Deck",
    "description": "โดย NVIDIA คุยว่าการนำ Steam Deck มาเล่นเกมแบบสตรีมจากคลาวด์จะช่วยประหยัดแบตกว่าเกมที่ประมวลผลในเครื่อง ช่วยให้แบตเตอรี่ใช้ได้นานขึ้นเกมเมอร์ยังสามารถนำ Steam Deck ไปต่อกับจอมอนิเตอร์ที่รองรับ HDR เพื่อเล่นเกมที่แสดงผลแบบ HDR ในจอขนาดใหญ่ขึ้นได้ด้วย ตัวแอพจะเริ่มให้บริการภายในปี 2025 ยังไม่ระบุเดือน",
    "image": news5
  }
]

const News = () => {
  return (
    <div className='py-12'>
      <h2 className='text-3xl font-semibold mb-6'>ข่าวใหม่</h2>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        autoplay={{
          delay: 2000, // ตั้งค่าให้สไลด์ทุกๆ 2 วินาที
          disableOnInteraction: false, // ให้ autoplay ทำงานต่อหลังจากเลื่อนเอง
        }}
        navigation={true}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination, Navigation, Autoplay]} // เพิ่ม Autoplay module
        className="mySwiper"
      >
        {
            news.map((item, index) => (
                <SwiperSlide key={index}>
                    <div className='flex flex-col sm:flex-row sm:justify-between 
                    items-center gap-12'>
                        {/* { content } */}
                        <div className='py-4'>
                            <Link to="/">
                              <h3 className='text-lg font-medium hover:text-lime-500 mb-4'>
                              {item.title}</h3>
                            </Link>
                            <div className='w-12 h-[4px] bg-yellow-300 mb-5'></div>
                            <p className='text-sm text-gray-600'>{item.description}</p>
                        </div>

                      {/* Image */}
                        <div className='flex-shrink-0'>
                          <img src={item.image} alt='' className='w-full object-cover'/>
                        </div>
                    </div>
                </SwiperSlide>
            ))
        }
      </Swiper>
    </div>
  )
}

export default News
