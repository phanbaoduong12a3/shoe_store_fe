import ProductCard from '@/container/product-card/ProductCard';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getProductsAction } from '@/stores/product';
import { message, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CategoryFilterProductPage = () => {
  const { products, loading: productsLoading } = useAppSelector((state) => state.product);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [displayedCount, setDisplayedCount] = useState(8);

  useEffect(() => {
    if (id) {
      dispatch(
        getProductsAction({
          categoryId: id,
          onSuccess: (data) => {
            console.log('Products loaded:', data);
          },
          onError: (error) => {
            message.error({
              content: error?.response?.data?.message || 'Không thể tải danh sách sản phẩm!',
              duration: 3,
            });
          },
        })
      );
    }
  }, [id, dispatch]);

  return (
    <div className="mb-10">
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
                onClick={() => setDisplayedCount((prev) => prev + 8)}
              >
                Xem thêm
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryFilterProductPage;
