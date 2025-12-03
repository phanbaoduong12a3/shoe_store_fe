import { useEffect, useState } from 'react';
import { Table, Card, Space, Button, App, Input, Select, InputNumber } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getOrdersAction } from '@/stores/order';
import { Order } from '@/services/order-service';
import './order-page.scss';

const OrderPage = () => {
  const dispatch = useAppDispatch();
  const { orders, total, loading } = useAppSelector((state) => state.order);
  const { message } = App.useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    categoryId: undefined as string | undefined,
    brandId: undefined as string | undefined,
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    gender: undefined as 'male' | 'female' | 'unisex' | 'kids' | undefined,
  });

  useEffect(() => {
    fetchorders();
  }, [currentPage, pageSize, searchText, filters]);

  const fetchorders = () => {
    dispatch(
      getOrdersAction({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        ...filters,
        onSuccess: (data: any) => {
          console.log('orders loaded:', data);
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

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: '20%',
    },
    {
      title: 'Giá',
      dataIndex: 'subtotal',
      key: 'subtotal',
      width: '12%',
    },
    {
      title: 'Phí giao hàng',
      dataIndex: 'shippingFee',
      key: 'shippingFee',
      width: '12%',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: '12%',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: '15%',
      render: (status: any) => (
        <div className="order-rating">
          {status === 'pending' ? (
            <>
              <span>Chờ duyệt</span>
            </>
          ) : (
            <span>Đã duyệt</span>
          )}
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '8%',
      render: (_: any) => (
        <Space size="small" className="action-buttons">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit()}
            className="edit-btn"
          />
        </Space>
      ),
    },
  ];

  const handleEdit = () => {
    message.info('Chức năng đang phát triển');
  };

  return (
    <div className="order-page">
      <Card
        className="order-card"
        title="Quản lý đơn hàng"
        extra={
          <Space>
            <Input.Search
              placeholder="Tìm kiếm đơn hàng..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 250 }}
              prefix={<SearchOutlined />}
            />
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
            <Select
              placeholder="Giới tính"
              allowClear
              style={{ width: 120 }}
              onChange={(value: any) => setFilters({ ...filters, gender: value })}
            >
              <Select.Option value="male">Nam</Select.Option>
              <Select.Option value="female">Nữ</Select.Option>
              <Select.Option value="unisex">Unisex</Select.Option>
              <Select.Option value="kids">Trẻ em</Select.Option>
            </Select>
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
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total: number) => `Tổng ${total} đơn hàng`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
        />
      </Card>
    </div>
  );
};

export default OrderPage;
