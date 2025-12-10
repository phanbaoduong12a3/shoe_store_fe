import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Brand } from '@/services/brand-service';
import { Link } from 'react-router-dom';
import { RoutePaths } from '@/routers/routes-constants';

interface Props {
  brands: Brand[];
}

const BrandCarousel: React.FC<Props> = ({ brands }) => {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={20}
      breakpoints={{
        320: { slidesPerView: 2 },
        480: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 5 },
        1280: { slidesPerView: 6 },
      }}
      style={{ padding: '20px 0' }}
    >
      {brands.map((brand) => (
        <SwiperSlide key={brand._id}>
          <Link to={RoutePaths.BRAND_DETAIL_LINK(brand._id)}>
            <div className="bg-white border border-gray-200 rounded-lg h-40 p-5 flex items-center gap-5 hover:shadow-xl transition-shadow cursor-pointer">
              {/* Ảnh lớn hơn */}
              <img
                src={brand.logo || 'https://example.com/default.jpg'}
                alt={brand.name}
                className="w-16 h-16 object-contain flex-shrink-0"
              />

              {/* Tên Brand */}
              <span className="font-semibold text-gray-800 text-base leading-tight line-clamp-2">
                {brand.name}
              </span>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BrandCarousel;
