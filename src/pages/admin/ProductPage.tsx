import { useEffect, useState } from 'react';
import { Table, Card, Space, Button, App, Switch, Image, Input, InputNumber } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/stores';
import {
  getProductsAction,
  toggleProductStatusAction,
  deleteProductAction,
} from '@/stores/product';
import { Product } from '@/services/product-service';
import CreateProductModal from './components/CreateProductModal';
import './product-page.scss';
import CustomDropdown from '@/components/CustomDropdown';
import { getBrandsAction } from '@/stores/brand';
import { getCategoriesAction } from '@/stores/category';
import ConfirmModal from '@/components/ConfirmModal';
import EditProductModal from './components/EditProductModal';

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { products, loading, total } = useAppSelector((state) => state.product);
  const { message } = App.useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: undefined as string | undefined,
    brandId: undefined as string | undefined,
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
  const [brandList, setBrandList] = useState<any[]>([]);
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, searchText, filters]);

  const fetchProducts = () => {
    dispatch(
      getProductsAction({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        ...filters,
        onSuccess: (data: any) => {
          console.log('Products loaded:', data);
        },
        onError: () => {
          message.error({
            content: 'Không thể tải danh sách sản phẩm!',
            duration: 3,
          });
        },
      })
    );
  };

  const fetchBrands = () => {
    dispatch(
      getBrandsAction({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        onSuccess: (data: any) => {
          setBrandList(data?.data?.brands || []);
        },
        onError: () => {
          message.error({
            content: 'Không thể tải danh sách thương hiệu!',
            duration: 3,
          });
        },
      })
    );
  };

  const fetchCategories = () => {
    dispatch(
      getCategoriesAction({
        isActive: true,
        onSuccess: (data: any) => {
          setCategoryList(data?.data?.categories || []);
        },
        onError: () => {
          message.error({
            content: 'Không thể tải danh sách thương hiệu!',
            duration: 3,
          });
        },
      })
    );
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || 10);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleToggleStatus = (
    id: string,
    isActive: boolean,
    isFeatured: boolean,
    isNew: boolean
  ) => {
    dispatch(
      toggleProductStatusAction({
        id: id,
        isActive: isActive,
        isFeatured: isFeatured,
        isNew: isNew,
        onSuccess: () => {
          message.success({
            content: 'Cập nhật trạng thái thành công!',
            duration: 2,
          });
        },
        onError: () => {
          message.error({
            content: 'Cập nhật trạng thái thất bại!',
            duration: 3,
          });
        },
      })
    );
  };

  const getTotalStock = (product: Product) => {
    return product.variants.reduce((sum: number, variant: any) => sum + variant.stock, 0);
  };

  const getPrimaryImage = (product: Product) => {
    const primary = product.images.find((img: any) => img.isPrimary);
    return primary?.url || product.images[0]?.url;
  };

  const columns: ColumnsType<Product> = [
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      width: '8%',
      render: (_: any, record: any) => (
        <div className="product-image-preview">
          {getPrimaryImage(record) ? (
            <Image
              src={getPrimaryImage(record)}
              alt={record.name}
              width={60}
              height={60}
              style={{ objectFit: 'cover' }}
              preview={false}
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text: any, record: any) => (
        <div>
          <div className="product-name">{text}</div>
          <div className="product-sku">SKU: {record.sku}</div>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: '12%',
      render: (price: any, record: any) => (
        <div className="product-price">
          {record.salePrice ? (
            <>
              <div className="sale-price">{record.salePrice.toLocaleString('vi-VN')}₫</div>
              <div className="original-price">{price.toLocaleString('vi-VN')}₫</div>
            </>
          ) : (
            <div className="normal-price">{price.toLocaleString('vi-VN')}₫</div>
          )}
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'variants',
      key: 'stock',
      width: '8%',
      render: (_: any, record: any) => (
        <span className={`stock-count ${getTotalStock(record) === 0 ? 'out-of-stock' : ''}`}>
          {getTotalStock(record)}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: '15%',
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small">
          <Switch
            checked={record.isActive}
            onChange={() =>
              handleToggleStatus(record._id, !record.isActive, record.isFeatured, record.isNew)
            }
            checkedChildren="Hoạt động"
            unCheckedChildren="Ẩn"
            size="small"
          />
          <Switch
            checked={record.isFeatured}
            onChange={() =>
              handleToggleStatus(record._id, record.isActive, !record.isFeatured, record.isNew)
            }
            checkedChildren="Nổi bật"
            unCheckedChildren="Thường"
            size="small"
          />
          <Switch
            checked={record.isNew}
            onChange={() =>
              handleToggleStatus(record._id, record.isActive, record.isFeatured, !record.isNew)
            }
            checkedChildren="Mới"
            unCheckedChildren="Cũ"
            size="small"
          />
        </Space>
      ),
    },
    {
      title: 'Đã bán',
      dataIndex: 'totalSold',
      key: 'totalSold',
      width: '8%',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      width: '10%',
      render: (rating: any) => (
        <div className="product-rating">
          {rating && rating.average !== undefined ? (
            <>
              <span>⭐ {rating.average.toFixed(1)}</span>
              <span className="rating-count">({rating.count || 0})</span>
            </>
          ) : (
            <span className="no-rating">Chưa có</span>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '8%',
      render: (_: any, record: any) => (
        <Space size="small" className="action-buttons">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="edit-btn"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleOpenDelete(record)}
            className="delete-btn"
          />
        </Space>
      ),
    },
  ];

  const handleEdit = (record: Product) => {
    setSelectedProduct(record);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDelete = (record: Product) => {
    setSelectedProduct(record);
    setOpenDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedProduct) return;

    dispatch(
      deleteProductAction({
        id: selectedProduct._id,
        onSuccess: () => {
          message.success('Xóa sản phẩm thành công!');
          setOpenDeleteModal(false);
          fetchProducts();
        },
        onError: () => {
          message.error('Xóa sản phẩm thất bại!');
          setOpenDeleteModal(false);
        },
      })
    );
  };

  const handleCreateModalSuccess = () => {
    setIsCreateModalOpen(false);
    fetchProducts();
  };

  const handleUpdateModalSuccess = () => {
    setIsUpdateModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="product-page">
      <Card
        className="product-card"
        title="Quản lý sản phẩm"
        extra={
          <Space>
            <Input.Search
              placeholder="Tìm kiếm sản phẩm..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Thêm sản phẩm
            </Button>
          </Space>
        }
      >
        <div className="filter-section">
          <Space wrap>
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
              placeholder="Thương hiệu"
              value={filters.brandId}
              options={brandList?.map((b) => ({
                label: b.name,
                value: b._id,
              }))}
              onChange={(value) => {
                setFilters({ ...filters, brandId: value });
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
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={products}
          rowKey="_id"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total: number) => `Tổng ${total} sản phẩm`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </Card>

      <CreateProductModal
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateModalSuccess}
      />
      <EditProductModal
        open={isUpdateModalOpen}
        product={selectedProduct}
        onSuccess={handleUpdateModalSuccess}
        onCancel={() => setIsUpdateModalOpen(false)}
      ></EditProductModal>
      <ConfirmModal
        open={openDeleteModal}
        title="Xác nhận xóa"
        content={`Bạn có chắc chắn muốn xóa sản phẩm "${selectedProduct?.name}"?`}
        okText="Xóa"
        cancelText="Hủy"
        onCancel={() => setOpenDeleteModal(false)}
        onOk={handleConfirmDelete}
      />
    </div>
  );
};

export default ProductPage;
