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
  const ORDER_TABS = [
    { key: '', label: 'Tất cả' },
    { key: 'pending', label: 'Đang chờ xử lý' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'processing', label: 'Đang xử lý' },
    { key: 'shipping', label: 'Đang giao hàng' },
    { key: 'delivered', label: 'Đã hoàn thành' },
    { key: 'cancelled', label: 'Đã hủy' },
  ];
  type OrderTabKey = (typeof ORDER_TABS)[number]['key'];
  const [activeTab, setActiveTab] = useState<OrderTabKey>('');
  const { message } = App.useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchorders();
  }, [currentPage, pageSize, searchText, status]);

  const fetchorders = () => {
    dispatch(
      getOrdersAction({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        status: status,
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
          delivered: 'Đã hoàn thành',
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
        const colorMap: Record<string, string> = {
          pending: 'orange',
          confirmed: 'blue',
          processing: 'cyan',
          shipping: 'purple',
          delivered: 'green',
          cancelled: 'red',
        };
        return (
          <Space size="small" className="action-buttons">
            {/* pending → duyệt */}
            {record.status === 'pending' && (
              <Button
                type="primary"
                style={{
                  backgroundColor: colorMap[record.status],
                  borderColor: colorMap[record.status],
                }}
                onClick={() => handleChangeStatus(record._id, 'confirmed', '')}
              >
                Duyệt
              </Button>
            )}

            {/* duyệt → xử lý đơn hàng */}
            {record.status === 'confirmed' && (
              <Button
                type="primary"
                style={{
                  backgroundColor: colorMap[record.status],
                  borderColor: colorMap[record.status],
                }}
                onClick={() => handleChangeStatus(record._id, 'processing', '')}
              >
                Xử lý đơn hàng
              </Button>
            )}
            {/* xử lý đơn hàng → giao hàng */}
            {record.status === 'processing' && (
              <Button
                type="primary"
                style={{
                  backgroundColor: colorMap[record.status],
                  borderColor: colorMap[record.status],
                }}
                onClick={() => handleChangeStatus(record._id, 'shipping', '')}
              >
                Giao hàng
              </Button>
            )}
            {/* shipping → hoàn thành */}
            {record.status === 'shipping' && (
              <Button
                type="primary"
                style={{
                  backgroundColor: colorMap[record.status],
                  borderColor: colorMap[record.status],
                }}
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
            {ORDER_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              const tabColorMap: Record<string, string> = {
                pending: 'orange',
                confirmed: 'blue',
                processing: 'cyan',
                shipping: 'purple',
                delivered: 'green',
                cancelled: 'red',
              };
              const activeColor = tabColorMap[tab.key] || 'blue';

              return (
                <button
                  key={tab.key}
                  className={`
        px-6 py-2 rounded-lg font-semibold transition
        ${isActive ? `text-white` : 'bg-gray-200 text-gray-700'}
      `}
                  style={isActive ? { backgroundColor: activeColor } : undefined}
                  onClick={() => {
                    setStatus(tab.key);
                    setActiveTab(tab.key as OrderTabKey);
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
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
