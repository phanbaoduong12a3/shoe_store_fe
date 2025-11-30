import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Brand } from '@/services/brand-service';

interface Props {
  brands: Brand[];
}

const BrandCarousel: React.FC<Props> = ({ brands }) => {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={16}
      breakpoints={{
        320: { slidesPerView: 2 }, // Mobile
        480: { slidesPerView: 3 },
        768: { slidesPerView: 4 }, // Tablet
        1024: { slidesPerView: 5 }, // Desktop
        1280: { slidesPerView: 6 },
      }}
      style={{ padding: '20px 0' }}
    >
      {brands.map((brand) => (
        <SwiperSlide key={brand._id}>
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-32 flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer">
            <img
              src={brand.logo || 'https://example.com/default.jpg'}
              alt={brand.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BrandCarousel;
