import TextDefault from '@/components/Text/Text';
import { Card, Spin, Empty, Modal, Input, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores';
import { userOrderAction, cancelOrderAction } from '@/stores/order';
import { Order } from '@/services/order-service';

const OrdersPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const {
    orders,
    loading: orderLoading,
    error: orderError,
  } = useAppSelector((state) => state.order);

  // Modal state
  const [viewModal, setViewModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Tab state
  const ORDER_TABS = [
    { key: 'pending', label: 'Đang chờ xử lý' },
    { key: 'confirmed', label: 'Đã xác nhận' },
    { key: 'processing', label: 'Đang xử lý' },
    { key: 'shipping', label: 'Đang giao hàng' },
    { key: 'delivered', label: 'Đã giao' },
    { key: 'cancelled', label: 'Đã hủy' },
  ];
  type OrderTabKey = (typeof ORDER_TABS)[number]['key'];
  const [activeTab, setActiveTab] = useState<OrderTabKey>('pending');

  useEffect(() => {
    if (user) {
      dispatch(userOrderAction({}));
    }
  }, [dispatch, user]);

  // Reset về trang 1 khi đổi tab
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [activeTab]);

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
  };

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);
    if (size) {
      setPageSize(size);
    }
  };

  const renderOrders = () => {
    if (orderLoading) {
      return (
        <div className="loading-container">
          <Spin size="large" tip="Đang tải đơn hàng..." />
        </div>
      );
    }
    if (orderError) {
      return <div className="error-message">{orderError}</div>;
    }

    const filteredOrders = orders?.filter((order) => order.status === activeTab);

    if (!filteredOrders || filteredOrders.length === 0) {
      const tabLabel = ORDER_TABS.find((tab) => tab.key === activeTab)?.label || '';
      return (
        <Card className="empty-cart-card">
          <Empty
            description={`Không có đơn hàng ${tabLabel.toLowerCase()}.`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      );
    }

    // Tính toán phân trang
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return (
      <>
        <div className="flex flex-col gap-5">
          {paginatedOrders.map((order) => (
            <Card
              key={order._id}
              className="shadow-md rounded-xl mb-4"
              bodyStyle={{ padding: '20px' }}
            >
              <div className="flex justify-between items-center">
                <TextDefault fs={18} fw="700">
                  Đơn hàng #{order._id}
                </TextDefault>
                <div className="flex gap-3">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-2 shadow transition"
                    onClick={() => handleView(order)}
                  >
                    Xem
                  </button>
                  {activeTab === 'pending' && (
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-4 py-2 shadow transition"
                      onClick={() => handleCancel(order)}
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {filteredOrders.length > pageSize && (
          <div className="flex justify-center mt-6">
            <Pagination
              current={currentPage}
              total={filteredOrders.length}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="mt-6">
      <p className="text-[2rem] font-semibold"> Đơn hàng của bạn</p>
      <div className="max-w-container mx-auto mt-8 p-4 bg-gray-50 rounded-2xl shadow-lg">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {ORDER_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeTab === tab.key
                  ? tab.key === 'cancelled'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.key as OrderTabKey)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {renderOrders()}

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
                  <strong>Phí vận chuyển:</strong>{' '}
                  {selectedOrder.shippingFee.toLocaleString('vi-VN')}đ
                </p>

                <p>
                  <strong>Giảm giá:</strong> {(selectedOrder.discount || 0).toLocaleString('vi-VN')}
                  đ
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
                    const image = item.productId?.images?.[0]?.url;

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
          title={`Hủy đơn hàng #${selectedOrder?._id}`}
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
    </div>
  );
};

export default OrdersPage;
