import TextDefault from '@/components/Text/Text';
import { Card, Spin, Empty, Modal, Input } from 'antd';
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
  // Tab state
  const [activeTab, setActiveTab] = useState<'pending' | 'cancelled'>('pending');

  useEffect(() => {
    if (user) {
      dispatch(userOrderAction({}));
    }
  }, [dispatch, user]);

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
    const filteredOrders = orders?.filter((order) =>
      activeTab === 'pending' ? order.status === 'pending' : order.status === 'cancelled'
    );
    if (!filteredOrders || filteredOrders.length === 0) {
      return (
        <Card className="empty-cart-card">
          <Empty
            description={
              activeTab === 'pending'
                ? 'Không có đơn hàng đang chờ xử lý.'
                : 'Không có đơn hàng đã hủy.'
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      );
    }
    return (
      <div className="flex flex-col gap-5">
        {filteredOrders.map((order) => (
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
    );
  };

  return (
    <div className="mt-6">
      <p className="text-[2rem] font-semibold"> Đơn hàng của bạn</p>
      <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-50 rounded-2xl shadow-lg">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Đang chờ xử lý
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'cancelled' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab('cancelled')}
          >
            Đã hủy
          </button>
        </div>
        {renderOrders()}

        {/* Modal xem chi tiết đơn hàng */}
        <Modal
          open={viewModal}
          title={<p className="text-[1.125rem]">Thông tin đơn hàng</p>}
          onCancel={() => setViewModal(false)}
          footer={null}
          centered
        >
          {selectedOrder && (
            <div className="flex flex-col gap-2 text-[1.125rem]">
              <p>
                <span>Mã đơn hàng:</span> {selectedOrder._id}
              </p>
              <p>
                <span>Số điện thoại:</span> {selectedOrder.customer.phone}
              </p>
              <p>
                <span>Tên khách hàng:</span> {selectedOrder.customer.name}
              </p>
              <p>
                <span>Email:</span> {selectedOrder.customer.email}
              </p>
              <p>
                <span>Tiền hàng:</span> {selectedOrder.subtotal.toLocaleString('vi-VN')}đ
              </p>
              <p>
                <span>Phí vận chuyển:</span> {selectedOrder.shippingFee.toLocaleString('vi-VN')}đ
              </p>
              <p>
                <span>Giảm giá:</span> {(selectedOrder.discount || 0).toLocaleString('vi-VN')}đ
              </p>
              <p>
                <span>Mã voucher:</span> {selectedOrder.voucherCode || 'Không có'}
              </p>
              <p className="flex gap-2">
                <span>Ngày đặt:</span>
                {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
              </p>
              <p className="flex gap-2">
                <span>Tổng tiền:</span> {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
              </p>
              <p className="flex gap-2">
                <span>Trạng thái:</span> {selectedOrder.status}
              </p>
              <p>
                <span>Phương thức thanh toán:</span> {selectedOrder.paymentMethod}
              </p>
              <p className="flex gap-2">
                <span>Địa chỉ giao hàng:</span> {selectedOrder.shippingAddress.address}-
                {selectedOrder.shippingAddress.city}-{selectedOrder.shippingAddress.district}-
                {selectedOrder.shippingAddress.ward}
              </p>
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
