import { useEffect, useState } from 'react';
import { Table, Card, Space, Button, App, Input, Select, InputNumber, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/stores';
import { changeOrderStatusAction, getOrdersAction } from '@/stores/order';
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
      width: '10%',
    },
    {
      title: 'Phí giao hàng',
      dataIndex: 'shippingFee',
      key: 'shippingFee',
      width: '10%',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: '10%',
    },
    {
      title: 'Trạng thái',
      key: 'status',
      width: '10%',
      render: (_: any, record: any) => {
        const statusMap: Record<string, string> = {
          pending: 'Chờ duyệt',
          confirmed: 'Đã xác nhận',
          processing: 'Đang xử lý',
          shipping: 'Đang giao hàng',
          delivered: 'Đã giao',
          cancelled: 'Đã hủy',
        };
        const colorMap: Record<string, string> = {
          pending: 'orange',
          confirmed: 'blue',
          processing: 'cyan',
          shipping: 'purple',
          delivered: 'green',
          cancelled: 'red',
        };

        return (
          <Tag color={colorMap[record.status] ?? 'default'}>
            {statusMap[record.status] ?? 'Không xác định'}
          </Tag>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'cancelReason',
      key: 'cancelReason',
      width: '10%',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: '10%',
      render: (_: any, record: any) => {
        return (
          <Space size="small" className="action-buttons">
            {/* pending → duyệt */}
            {record.status === 'pending' && (
              <Button
                type="primary"
                onClick={() => handleChangeStatus(record._id, 'confirmed', '')}
              >
                Duyệt
              </Button>
            )}

            {/* shipping → hoàn thành */}
            {record.status === 'shipping' && (
              <Button
                type="primary"
                onClick={() => handleChangeStatus(record._id, 'delivered', '')}
              >
                Hoàn thành
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const handleChangeStatus = (id: string, status: string, note: string) => {
    dispatch(
      changeOrderStatusAction({
        id: id,
        status: status,
        note: note,
        onSuccess: () => {
          message.success({
            content: 'Cập nhật đơn hàng thành công!',
            duration: 2,
          });
          fetchorders();
        },
        onError: () => {
          message.error({
            content: 'Cập nhật đơn hàng thất bại!',
            duration: 3,
          });
          fetchorders();
        },
      })
    );
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
