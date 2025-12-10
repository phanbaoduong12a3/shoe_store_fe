import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Category } from '@/services/category-service';
import { Link } from 'react-router-dom';
import { RoutePaths } from '@/routers/routes-constants';

interface Props {
  categories: Category[];
}

export default function CategoryCarousel({ categories }: Props) {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={20}
      breakpoints={{
        320: { slidesPerView: 2 },
        480: { slidesPerView: 3 },
        640: { slidesPerView: 4 },
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 6 },
      }}
      style={{ padding: '20px 0' }}
    >
      {categories.map((category) => (
        <SwiperSlide key={category._id}>
          <Link to={RoutePaths.CATEGORY_DETAIL_LINK(category._id)}>
            <div className="bg-white border border-gray-200 rounded-lg h-40 p-5 flex items-center gap-5 hover:shadow-lg transition-shadow cursor-pointer">
              {/* Ảnh to hơn */}
              <img
                src={category.image || 'https://example.com/image.jpg'}
                alt={category.name}
                className="w-16 h-16 object-contain flex-shrink-0" 
              />

              {/* Tên Category lớn hơn */}
              <span className="font-semibold text-gray-800 text-base leading-tight line-clamp-2">
                {category.name}
              </span>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
