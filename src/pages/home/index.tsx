import { useAppDispatch, useAppSelector } from '@/stores';
import HeroSection from './components/hero';
import { Spin } from 'antd';
import ProductCard from '@/container/product-card/ProductCard';
import IntroSection from './components/intro_section';
import CategoryCarousel from './components/category_carousel';
import BrandCarousel from './components/brand_carousel';
import { useEffect, useState } from 'react';
import { getProductsAction } from '@/stores/product';

const PRODUCTS_PER_PAGE = 8;

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { products, loading: productsLoading } = useAppSelector((state) => state.product);
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.category);
  const { brands, loading: brandsLoading } = useAppSelector((state) => state.brand);

  const [displayedCount, setDisplayedCount] = useState(PRODUCTS_PER_PAGE);

  useEffect(() => {
    dispatch(
      getProductsAction({
        page: 1,
        limit: 30,
        onSuccess: (data) => console.log('Products loaded:', data),
        onError: (err) => console.error('Error loading products:', err),
      })
    );
  }, [dispatch]);

  return (
    <div className="mt-6">
      <HeroSection />
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">DANH MỤC NỔI BẬT</h2>
        {categoriesLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : (
          <div>
            <CategoryCarousel categories={categories} />
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">THƯƠNG HIỆU NỔI BẬT</h2>
        {brandsLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : (
          <div>
            <BrandCarousel brands={brands} />
          </div>
        )}
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-red-600">GỢI Ý CHO BẠN</h2>
        {productsLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 md:gap-10">
              {products.slice(0, displayedCount).map((product, index) => (
                <ProductCard key={`${product._id}-${index}`} product={product} />
              ))}
            </div>
            {displayedCount < products.length && (
              <div className="flex justify-center mt-6">
                <button
                  className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
                  onClick={() => setDisplayedCount((prev) => prev + PRODUCTS_PER_PAGE)}
                >
                  Xem thêm
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <IntroSection />
      <div className="w-full py-10 flex justify-between items-center ">
        {/* LEFT: Text + Form */}
        <div className="flex-1">
          <p className="font-semibold mb-3 text-black">Đăng ký để nhận ưu đãi qua email:</p>

          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="border border-gray-400 px-4 py-2 w-full h-12.5"
            />
            <button className="bg-black text-white h-12.5 w-20">ĐĂNG KÝ</button>
          </div>

          <p className="text-sm mt-3 text-gray-600">
            Bằng cách đăng ký, bạn đồng ý với{' '}
            <span className="font-semibold cursor-pointer hover:underline">Chính sách bảo mật</span>{' '}
            của chúng tôi
          </p>
        </div>

        {/* <div className="flex gap-4">
          <FacebookFilled style={{ fontSize: '42px' }} />
          <InstagramFilled style={{ fontSize: '42px' }} />
          <PinterestFilled style={{ fontSize: '42px' }} />
          <TwitchFilled style={{ fontSize: '42px' }} />
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;
