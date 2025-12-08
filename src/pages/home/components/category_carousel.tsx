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
      spaceBetween={16}
      breakpoints={{
        320: { slidesPerView: 2 }, // Mobile
        480: { slidesPerView: 3 },
        640: { slidesPerView: 4 },
        768: { slidesPerView: 5 },
        1024: { slidesPerView: 6 }, // Desktop
      }}
      style={{ padding: '20px 0' }}
    >
      {categories.map((category) => (
        <SwiperSlide key={category._id}>
          <Link to={RoutePaths.CATEGORY_DETAIL_LINK(category._id)}>
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-32 flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer">
              <img
                src={category.image || 'https://example.com/image.jpg'}
                alt={category.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
