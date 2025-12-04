import { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Space,
  Button,
  App,
  Switch,
  Image,
  Modal,
  Input,
  Select,
  InputNumber,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  PlusOutlined,
} from '@ant-design/icons';
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

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { products, loading, total } = useAppSelector((state) => state.product);
  const { message } = App.useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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
        onError: (error: any) => {
          message.error({
            content: error?.response?.data?.message || 'Không thể tải danh sách sản phẩm!',
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

  const handleToggleStatus = (product: Product, field: 'isActive' | 'isFeatured' | 'isNew') => {
    dispatch(
      toggleProductStatusAction({
        id: product._id,
        field,
        onSuccess: (data: any) => {
          message.success({
            content: data.data.message || 'Cập nhật trạng thái thành công!',
            duration: 2,
          });
        },
        onError: (error: any) => {
          message.error({
            content: error?.response?.data?.message || 'Cập nhật trạng thái thất bại!',
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
            onChange={() => handleToggleStatus(record, 'isActive')}
            checkedChildren="Hoạt động"
            unCheckedChildren="Ẩn"
            size="small"
          />
          <Switch
            checked={record.isFeatured}
            onChange={() => handleToggleStatus(record, 'isFeatured')}
            checkedChildren="Nổi bật"
            unCheckedChildren="Thường"
            size="small"
          />
          <Switch
            checked={record.isNew}
            onChange={() => handleToggleStatus(record, 'isNew')}
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
            onClick={() => handleEdit()}
            className="edit-btn"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
            className="delete-btn"
          />
        </Space>
      ),
    },
  ];

  const handleEdit = () => {
    message.info('Chức năng đang phát triển');
  };

  const handleDelete = (record: Product) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa sản phẩm "${record.name}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        dispatch(
          deleteProductAction({
            id: record._id,
            onSuccess: (data: any) => {
              message.success({
                content: data.data.message || 'Xóa sản phẩm thành công!',
                duration: 2,
              });
              fetchProducts();
            },
            onError: (error: any) => {
              message.error({
                content: error?.response?.data?.message || 'Xóa sản phẩm thất bại!',
                duration: 3,
              });
            },
          })
        );
      },
    });
  };

  const handleCreateModalSuccess = () => {
    setIsCreateModalOpen(false);
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
            <Select
              placeholder="Danh mục"
              allowClear
              style={{ width: 150 }}
              onChange={(value: any) => setFilters({ ...filters, categoryId: value })}
            >
              {/* TODO: Load categories */}
            </Select>
            <Select
              placeholder="Thương hiệu"
              allowClear
              style={{ width: 150 }}
              onChange={(value: any) => setFilters({ ...filters, brandId: value })}
            >
              {/* TODO: Load brands */}
            </Select>
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
    </div>
  );
};

export default ProductPage;
