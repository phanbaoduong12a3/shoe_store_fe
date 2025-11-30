import { Flex, Spin } from 'antd';
import './home.scss';
import TextDefault from '@/components/Text/Text';
import ProductCard from '@/container/product-card/ProductCard';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getProductsAction } from '@/stores/product';
import { getCategoriesAction } from '@/stores/category';
import { getBrandsAction } from '@/stores/brand';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.product);

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
    <Flex className="home-page" gap={24} vertical>
      <div className="header-img-banner">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC104btx6RhJkUVGOFYmrGEewwwYCv-JlUaTDb5bHPp84UL1yPoVslIabUmEiDIdZZ-pM9Hkw-6c9W6HYC0jQSyOPT5pnHv51UTUFQCGGz1AeT1gA3OH-zhWFPVpzf51dQ0McRHt7-WBZghJOatzAllRj8FdWF9QWaHK9OK70FnoJF5kjQYELLZ9kHikUT9u3HmdGWhpwV5feoIBGiQGf3M8PvouW0WjCkavclkTIIteIHwMzxCrsecY9CpEVFrhB8u116kwRiN7NCE"
          alt=""
        />
        <Flex gap={24} vertical>
          <TextDefault className="Title">Bộ Sưu Tập Cuối Năm 2025</TextDefault>
          <TextDefault className="SubTitle">Khám phá những bộ sưu tập xu hướng</TextDefault>
        </Flex>
      </div>

      <TextDefault fs={30} color="#000" fw="600">
        Sản phẩm nổi bật
      </TextDefault>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Flex gap={24} wrap="wrap">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default HomePage;
