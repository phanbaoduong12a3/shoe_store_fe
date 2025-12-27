import { useEffect, useState } from 'react';
import { Table, Card, Space, Button, App, Input, Tag, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useAppDispatch, useAppSelector } from '@/stores';
import { cancelOrderAction, userOrderAction } from '@/stores/order';
import { Order } from '@/services/order-service';
import './order-page.scss';
import CustomDropdown from '@/components/CustomDropdown';
import TextDefault from '@/components/Text/Text';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const [cancelReason, setCancelReason] = useState('');
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
  const [filters, setFilters] = useState({
    status: '' as string | '',
    paymentMethod: undefined as string | undefined,
    paymentStatus: undefined as string | undefined,
  });
  const paymentMethodOptions = [
    { label: 'Tiền mặt', value: 'cod' },
    { label: 'Momo', value: 'momo' },
    { label: 'ZaloPay', value: 'zalopay' },
    { label: 'Chuyển khoản', value: 'banking' },
  ];
  const paymentStatusOptions = [
    { label: 'Đang chờ', value: 'pending' },
    { label: 'Đã thanh toán', value: 'paid' },
    { label: 'Thanh toán thất bại', value: 'failed' },
  ];

  const [viewModal, setViewModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setViewModal(true);
  };

  const handleCancel = (order: Order) => {
    setSelectedOrder(order);
    setCancelModal(true);
  };

  const handleCancelOrder = () => {
    if (selectedOrder) {
      dispatch(cancelOrderAction({ orderId: selectedOrder._id, reason: cancelReason }));
    }
    setCancelModal(false);
    setCancelReason('');
    fetchorders();
  };

  useEffect(() => {
    fetchorders();
  }, [currentPage, pageSize, searchText, filters]);

  const fetchorders = () => {
    dispatch(
      userOrderAction({
        page: currentPage,
        limit: pageSize,
        search: searchText || undefined,
        ...filters,
        onSuccess: (data: any) => {
          console.log('orders loaded:', data);
        },
        onError: () => {
          message.error({
            content: 'Không thể tải danh sách đơn hàng!',
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
          pending: 'red',
          confirmed: 'blue',
          processing: 'cyan',
          shipping: 'purple',
          delivered: 'green',
          cancelled: 'red',
        };
        return (
          <Space size="small" className="action-buttons">
            {/* pending → duyệt */}
            <Button type="primary" onClick={() => handleView(record)}>
              Xem
            </Button>
            {record.status === 'pending' && (
              <Button
                type="primary"
                style={{
                  backgroundColor: colorMap[record.status],
                  borderColor: colorMap[record.status],
                }}
                onClick={() => handleCancel(record)}
              >
                Hủy
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="order-page">
      <Card
        className="order-card"
        title="Quản lý đơn hàng"
        extra={
          <Space>
            <CustomDropdown
              placeholder="Phương thức thanh toán"
              value={filters.paymentMethod}
              options={paymentMethodOptions.map((b) => ({
                label: b.label,
                value: b.value,
              }))}
              onChange={(value) => {
                setFilters({ ...filters, paymentMethod: value });
              }}
            />
            <CustomDropdown
              placeholder="Trạng thái thanh toán"
              value={filters.paymentStatus}
              options={paymentStatusOptions.map((b) => ({
                label: b.label,
                value: b.value,
              }))}
              onChange={(value) => {
                setFilters({ ...filters, paymentStatus: value });
              }}
            />
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
                    setFilters({ ...filters, status: tab.key });
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
      {/* Modal xem chi tiết đơn hàng */}
      <Modal
        open={viewModal}
        title={
          <p className="text-[1.125rem]">
            {' '}
            <strong>Thông tin đơn hàng</strong>
          </p>
        }
        onCancel={() => setViewModal(false)}
        footer={null}
        centered
        width={800}
      >
        {selectedOrder && (
          <div className="flex flex-col gap-4 text-[1.05rem]">
            {/* ==== Thông tin đơn hàng ==== */}
            <div className="grid grid-cols-2 gap-2">
              <p>
                <strong>Mã đơn hàng:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {selectedOrder.customer.phone}
              </p>

              <p>
                <strong>Tên khách hàng:</strong> {selectedOrder.customer.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedOrder.customer.email}
              </p>

              <p>
                <strong>Tiền hàng:</strong> {selectedOrder.subtotal.toLocaleString('vi-VN')}đ
              </p>
              <p>
                <strong>Phí vận chuyển:</strong> {selectedOrder.shippingFee.toLocaleString('vi-VN')}
                đ
              </p>

              <p>
                <strong>Giảm giá:</strong> {(selectedOrder.discount || 0).toLocaleString('vi-VN')}đ
              </p>
              <p>
                <strong>Mã voucher:</strong> {selectedOrder.voucherCode || 'Không có'}
              </p>

              <p>
                <strong>Ngày đặt:</strong>{' '}
                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </p>
              <p>
                <strong>Tổng tiền:</strong> {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
              </p>

              <p className="col-span-2">
                <strong>Phương thức thanh toán:</strong>{' '}
                {{
                  cod: 'Thanh toán khi nhận hàng',
                  momo: 'Thanh toán qua MoMo',
                  zalopay: 'Thanh toán qua ZaloPay',
                  banking: 'Thanh toán chuyển khoản',
                }[selectedOrder.paymentMethod] || 'Không xác định'}
              </p>

              <p className="col-span-2">
                <strong>Địa chỉ giao hàng:</strong>
                {selectedOrder.shippingAddress.address} -{selectedOrder.shippingAddress.ward} -
                {selectedOrder.shippingAddress.district} -{selectedOrder.shippingAddress.city}
              </p>
            </div>

            {/* ===================== Bảng sản phẩm ===================== */}
            <h3 className="text-lg font-semibold mt-4">Sản phẩm</h3>

            <table className="w-full border border-gray-300 rounded-md overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Ảnh</th>
                  <th className="border p-2">Sản phẩm</th>
                  <th className="border p-2">Màu</th>
                  <th className="border p-2">Size</th>
                  <th className="border p-2">Giá</th>
                  <th className="border p-2">SL</th>
                  <th className="border p-2">Tổng</th>
                </tr>
              </thead>

              <tbody>
                {selectedOrder.items.map((item) => {
                  const image = item?.image;
                  return (
                    <tr key={item.sku}>
                      {/* Ảnh */}
                      <td className="border p-2 text-center">
                        <img
                          src={image}
                          alt={item.productName}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>

                      {/* Tên */}
                      <td className="border p-2">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                      </td>

                      {/* Màu */}
                      <td className="border p-2 text-center">{item.color}</td>

                      {/* Size */}
                      <td className="border p-2 text-center">{item.size}</td>

                      {/* Giá */}
                      <td className="border p-2 text-right">
                        {item.price.toLocaleString('vi-VN')}đ
                      </td>

                      {/* Số lượng */}
                      <td className="border p-2 text-center">{item.quantity}</td>

                      {/* Tổng */}
                      <td className="border p-2 text-right font-semibold">
                        {item.subtotal.toLocaleString('vi-VN')}đ
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
      {/* Modal hỏi lý do hủy */}
      <Modal
        open={cancelModal}
        title={`Hủy đơn hàng #${selectedOrder?.orderNumber}`}
        onCancel={() => setCancelModal(false)}
        onOk={handleCancelOrder}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        centered
      >
        <div className="flex flex-col gap-2">
          <TextDefault color="#6b7280">Vui lòng nhập lý do hủy đơn hàng:</TextDefault>
          <Input.TextArea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={3}
            placeholder="Nhập lý do hủy..."
          />
        </div>
      </Modal>
    </div>
  );
};

export default OrdersPage;
