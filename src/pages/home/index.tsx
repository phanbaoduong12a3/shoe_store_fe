import { useEffect, useState } from 'react';
import { Spin } from 'antd';

import { useAppDispatch, useAppSelector } from '@/stores';
import { getProductsAction } from '@/stores/product';

import HeroSection from './components/hero';
import IntroSection from './components/intro_section';
import CategoryCarousel from './components/category_carousel';
import BrandCarousel from './components/brand_carousel';
import AIRecommendBox from './components/ai_recoment_box';

import ProductCard from '@/container/product-card/ProductCard';
import AiShoeChat from './components/ai_recoment_box';

const PRODUCTS_PER_PAGE = 8;

const HomePage = () => {
  const dispatch = useAppDispatch();

  const { products, loading: productsLoading } = useAppSelector((state) => state.product);
  const { categories, loading: categoriesLoading } = useAppSelector((state) => state.category);
  const { brands, loading: brandsLoading } = useAppSelector((state) => state.brand);

  const [displayedCount, setDisplayedCount] = useState(PRODUCTS_PER_PAGE);

  // 👉 LOCAL STATE CHO AI
  const [aiProducts, setAiProducts] = useState<any[] | null>(null);

  // Load sản phẩm mặc định
  useEffect(() => {
    dispatch(
      getProductsAction({
        page: 1,
        limit: 30,
      })
    );
  }, [dispatch]);

  // Danh sách đang hiển thị
  const displayProducts = aiProducts ?? products;

  return (
    <div className="mt-6">
      <HeroSection />

      {/* ===== CATEGORY ===== */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">DANH MỤC NỔI BẬT</h2>

        {categoriesLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : (
          <CategoryCarousel categories={categories} />
        )}
      </section>

      {/* ===== BRAND ===== */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">THƯƠNG HIỆU NỔI BẬT</h2>

        {brandsLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : (
          <BrandCarousel brands={brands} />
        )}
      </section>

      {/* ===== AI + PRODUCT LIST ===== */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-red-600">GỢI Ý CHO BẠN</h2>

        {/* 🤖 AI BOX */}
        <AiShoeChat />

        {/* Nút quay lại gợi ý mặc định */}
        {aiProducts && (
          <div className="mb-4">
            <button className="text-sm underline text-gray-600" onClick={() => setAiProducts(null)}>
              ← Quay lại gợi ý mặc định
            </button>
          </div>
        )}

        {productsLoading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 md:gap-10">
              {displayProducts.slice(0, displayedCount).map((product, index) => (
                <ProductCard key={`${product._id}-${index}`} product={product} />
              ))}
            </div>

            {displayedCount < displayProducts.length && (
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
      </section>

      <IntroSection />
    </div>
  );
};

export default HomePage;
