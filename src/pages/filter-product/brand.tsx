import CustomDropdown from '@/components/CustomDropdown';
import ProductCard from '@/container/product-card/ProductCard';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getCategoriesAction } from '@/stores/category';
import { getProductsAction } from '@/stores/product';
import { SearchOutlined } from '@ant-design/icons';
import { Input, InputNumber, message, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BrandFilterProductPage = () => {
  const { products, loading: productsLoading } = useAppSelector((state) => state.product);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const [displayedCount, setDisplayedCount] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    categoryId: undefined as string | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    gender: undefined as 'male' | 'female' | 'unisex' | 'kids' | undefined,
  });
  const genderOptions = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Unisex', value: 'unisex' },
    { label: 'Trẻ em', value: 'kids' },
  ];
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const fetchCategories = () => {
    dispatch(
      getCategoriesAction({
        isActive: true,
        onSuccess: (data: any) => {
          setCategoryList(data?.data?.categories || []);
        },
        onError: (error: any) => {
          message.error({
            content: error?.response?.data?.message || 'Không thể tải danh sách thương hiệu!',
            duration: 3,
          });
        },
      })
    );
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    if (id) {
      dispatch(
        getProductsAction({
          brandId: id,
          search: searchText || undefined,
          ...filters,
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
  }, [id, dispatch.apply, filters, searchText]);

  return (
    <div className="mb-10 mt-5">
      <div className="filter-section">
        <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
          <CustomDropdown
            placeholder="Danh mục"
            value={filters.categoryId}
            options={categoryList?.map((b) => ({
              label: b.name,
              value: b._id,
            }))}
            onChange={(value) => {
              setFilters({ ...filters, categoryId: value });
            }}
          />
          <CustomDropdown
            placeholder="Giới tính"
            value={filters.gender}
            options={genderOptions.map((b) => ({
              label: b.label,
              value: b.value,
            }))}
            onChange={(value) => {
              setFilters({ ...filters, gender: value as 'male' | 'female' | 'unisex' | 'kids' });
            }}
          />
          <InputNumber
            placeholder="Giá tối thiểu"
            style={{ width: 150 }}
            formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={(value: any) =>
              setFilters({ ...filters, minPrice: (value as number) || undefined })
            }
          />
          <InputNumber
            placeholder="Giá tối đa"
            style={{ width: 150 }}
            formatter={(value: any) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            onChange={(value: any) =>
              setFilters({ ...filters, maxPrice: (value as number) || undefined })
            }
          />
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />
        </Space>
      </div>
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

export default BrandFilterProductPage;
