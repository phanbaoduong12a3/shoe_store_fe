import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSection = () => {
  return (
    <div className="w-full max-w-container mx-auto mb-8">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        effect="fade"
        autoplay={{
          delay: 2000, // ⛳ Trượt sau 2 giây
          disableOnInteraction: false,
        }}
        speed={800} // ⛳ Thời gian trượt giữa 2 ảnh (0.8s)
      >
        <SwiperSlide>
          <div className="h-80 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="h-80 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="h-80 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HeroSection;
