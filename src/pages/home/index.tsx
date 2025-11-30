import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getProductsAction } from '@/stores/product';
import { getCategoriesAction } from '@/stores/category';
import { getBrandsAction } from '@/stores/brand';
import HeroSection from './components/hero';
import BrandCarousel from './components/brand_carousel';
import CategoryCarousel from './components/category_carousel';
import { Divider, Spin } from 'antd';
import ProductCard from '@/container/product-card/ProductCard';
import IntroSection from './components/intro_section';
import { FacebookFilled, InstagramFilled, PinterestFilled, TwitchFilled } from '@ant-design/icons';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { products, loading: productsLoading } = useAppSelector((state) => state.product);
  const { brands, loading: brandsLoading } = useAppSelector((state) => state.brand);
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.category);
  useEffect(() => {
    // Call API get categories
    dispatch(
      getCategoriesAction({
        isActive: true,
        onSuccess: (data) => {
          console.log('Categories loaded:', data);
        },
        onError: (error) => {
          console.error('Error loading categories:', error);
        },
      })
    );

    // Call API get brands
    dispatch(
      getBrandsAction({
        onSuccess: (data) => {
          console.log('Brands loaded:', data);
        },
        onError: (error) => {
          console.error('Error loading brands:', error);
        },
      })
    );

    // Call API get products
    dispatch(
      getProductsAction({
        page: 1,
        limit: 8,
        onSuccess: (data) => {
          console.log('Products loaded:', data);
        },
        onError: (error) => {
          console.error('Error loading products:', error);
        },
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
            <CategoryCarousel categories={[...categories]} />
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
            <BrandCarousel
              brands={[...brands, ...brands, ...brands, ...brands, ...brands, ...brands]}
            />
          </div>
        )}
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-6 text-red-600">GỢI Ý CHO BẠN</h2>
        {productsLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : (
          <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 md:gap-10">
            {Array(10)
              .fill(products)
              .flat()
              .map((product, index) => (
                <ProductCard key={`${product._id}-${index}`} product={product} />
              ))}
          </div>
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

        <div className="flex gap-4">
          <FacebookFilled style={{ fontSize: '42px' }} />
          <InstagramFilled style={{ fontSize: '42px' }} />
          <PinterestFilled style={{ fontSize: '42px' }} />
          <TwitchFilled style={{ fontSize: '42px' }} />
        </div>
      </div>

      <Divider />
    </div>
  );
};

export default HomePage;
