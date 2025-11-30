import TextDefault from '@/components/Text/Text';
import { Button, Card, Flex, InputNumber, Spin, Empty, App, Popconfirm } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/routers/routes-constants';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getCartAction, updateCartAction, removeFromCartAction } from '@/stores/cart';
import { getOrCreateSessionId, isUserLoggedIn } from '@/utils/cart-utils';
import './my-order.scss';

const MyOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, loading } = useAppSelector((state) => state.cart);
  const userId = localStorage.getItem('userId') || '';
  const { message } = App.useApp();

  const loadCart = () => {
    const isLoggedIn = isUserLoggedIn();
    const sessionId = !isLoggedIn ? getOrCreateSessionId() : userId;

    dispatch(
      getCartAction({
        sessionId,
        onSuccess: (data) => {
          console.log('Cart loaded:', data);
        },
        onError: (error) => {
          console.error('Error loading cart:', error);
        },
      })
    );
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateQuantity = (productId: string, variantId: string, newQuantity: number) => {
    const isLoggedIn = isUserLoggedIn();
    const sessionId = !isLoggedIn ? getOrCreateSessionId() : userId;

    dispatch(
      updateCartAction({
        productId,
        variantId,
        quantity: newQuantity,
        sessionId,
        onSuccess: () => {
          message.success('Đã cập nhật số lượng!');
        },
        onError: (error) => {
          message.error(error?.response?.data?.message || 'Không thể cập nhật số lượng!');
        },
      })
    );
  };

  const handleRemoveItem = (productId: string, variantId: string) => {
    const isLoggedIn = isUserLoggedIn();
    const sessionId = !isLoggedIn ? getOrCreateSessionId() : userId;

    dispatch(
      removeFromCartAction({
        productId,
        variantId,
        sessionId,
        onSuccess: () => {
          message.success('Đã xóa sản phẩm khỏi giỏ hàng!');
        },
        onError: (error) => {
          message.error(error?.response?.data?.message || 'Không thể xóa sản phẩm!');
        },
      })
    );
  };

  const shippingFee = 50000;
  const taxRate = 0.1;

  const subtotal =
    cart?.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0) || 0;

  const tax = subtotal * taxRate;
  const total = subtotal + shippingFee + tax;
  const freeShippingThreshold = 500000;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const finalTotal = isFreeShipping ? subtotal + tax : total;

  if (loading && !cart) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Đang tải giỏ hàng..." />
      </div>
    );
  }

  return (
    <div className="my-order-page">
      <div className="page-header">
        <Flex align="center" gap={16}>
          <ShoppingCartOutlined style={{ fontSize: 32, color: '#1555d5' }} />
          <div>
            <TextDefault fs={32} fw="700">
              Giỏ hàng của bạn
            </TextDefault>
            <TextDefault color="#6b7280" fs={14}>
              {cart?.items.length || 0} sản phẩm
            </TextDefault>
          </div>
        </Flex>
        <Link to={RoutePaths.HOME}>
          <Button icon={<ArrowLeftOutlined />} size="large">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>

      {!cart || cart.items.length === 0 ? (
        <Card className="empty-cart-card">
          <Empty
            description={
              <div>
                <TextDefault fs={18} fw="600" style={{ marginBottom: 8 }}>
                  Giỏ hàng của bạn đang trống
                </TextDefault>
                <TextDefault color="#6b7280">
                  Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!
                </TextDefault>
              </div>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Link to={RoutePaths.HOME}>
              <Button type="primary" size="large" icon={<ShoppingCartOutlined />}>
                Khám phá ngay
              </Button>
            </Link>
          </Empty>
        </Card>
      ) : (
        <Flex gap={24} className="cart-content">
          <div className="cart-items-section">
            {cart.items.map((item, index) => {
              const primaryImage =
                item.productId.images.find((img) => img.isPrimary) || item.productId.images[0];
              const displayPrice = item.price;
              const hasDiscount = !!item.productId.salePrice;
              const discountPercent = hasDiscount
                ? Math.round(
                    ((item.productId.price - item.productId.salePrice!) / item.productId.price) *
                      100
                  )
                : 0;

              return (
                <Card key={item.variantId + index} className="cart-item-card">
                  <Flex gap={20}>
                    <div className="item-image-wrapper">
                      <img
                        src={item.image || primaryImage?.url || 'https://via.placeholder.com/120'}
                        alt={item.productName}
                        className="item-image"
                      />
                      {hasDiscount && <div className="discount-badge">-{discountPercent}%</div>}
                    </div>

                    <Flex vertical gap={12} style={{ flex: 1 }}>
                      <Flex justify="space-between" align="flex-start">
                        <div>
                          <TextDefault fs={18} fw="600" className="item-name">
                            {item.productName}
                          </TextDefault>
                          <Flex gap={16} style={{ marginTop: 8 }}>
                            <div className="variant-tag">
                              Màu: <strong>{item.color}</strong>
                            </div>
                            <div className="variant-tag">
                              Size: <strong>{item.size}</strong>
                            </div>
                          </Flex>
                        </div>

                        <Popconfirm
                          title="Xóa sản phẩm"
                          description="Bạn có chắc muốn xóa sản phẩm này?"
                          onConfirm={() => handleRemoveItem(item.productId._id, item.variantId)}
                          okText="Xóa"
                          cancelText="Hủy"
                          okButtonProps={{ danger: true }}
                        >
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            className="delete-btn"
                          />
                        </Popconfirm>
                      </Flex>

                      <Flex gap={16} align="center" className="price-quantity-row">
                        <div className="price-section">
                          <TextDefault fs={20} fw="700" color="#1555d5">
                            {displayPrice.toLocaleString('vi-VN')}đ
                          </TextDefault>
                          {hasDiscount && (
                            <TextDefault
                              fs={14}
                              color="#b9c0cb"
                              style={{ textDecoration: 'line-through', marginLeft: 8 }}
                            >
                              {item.productId.price.toLocaleString('vi-VN')}đ
                            </TextDefault>
                          )}
                        </div>

                        <div className="quantity-section">
                          <TextDefault color="#6b7280" fs={14}>
                            Số lượng:
                          </TextDefault>
                          <InputNumber
                            min={1}
                            max={99}
                            value={item.quantity}
                            onChange={(val) =>
                              handleUpdateQuantity(item.productId._id, item.variantId, val || 1)
                            }
                            size="large"
                            className="quantity-input"
                          />
                        </div>

                        <div className="item-total">
                          <TextDefault color="#6b7280" fs={14}>
                            Thành tiền:
                          </TextDefault>
                          <TextDefault fs={22} fw="700" color="#1555d5">
                            {(displayPrice * item.quantity).toLocaleString('vi-VN')}đ
                          </TextDefault>
                        </div>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              );
            })}
          </div>

          <Card className="order-summary-card">
            <TextDefault fs={24} fw="700" className="summary-title">
              Tóm tắt đơn hàng
            </TextDefault>

            <div className="summary-divider" />

            <Flex vertical gap={16} className="summary-details">
              <Flex justify="space-between" className="summary-row">
                <TextDefault color="#6b7280">Tạm tính ({cart.items.length} sản phẩm):</TextDefault>
                <TextDefault fw="600">{subtotal.toLocaleString('vi-VN')}đ</TextDefault>
              </Flex>

              <Flex justify="space-between" className="summary-row">
                <TextDefault color="#6b7280">Phí vận chuyển:</TextDefault>
                <TextDefault fw="600" color={isFreeShipping ? '#52c41a' : undefined}>
                  {isFreeShipping ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}đ`}
                </TextDefault>
              </Flex>

              {!isFreeShipping && subtotal > 0 && (
                <div className="free-shipping-progress">
                  <TextDefault fs={12} color="#6b7280">
                    Mua thêm {(freeShippingThreshold - subtotal).toLocaleString('vi-VN')}đ để được
                    miễn phí vận chuyển
                  </TextDefault>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(subtotal / freeShippingThreshold) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <Flex justify="space-between" className="summary-row">
                <TextDefault color="#6b7280">Thuế VAT (10%):</TextDefault>
                <TextDefault fw="600">{tax.toLocaleString('vi-VN')}đ</TextDefault>
              </Flex>

              <div className="summary-divider" />

              <Flex justify="space-between" className="total-row">
                <TextDefault fs={18} fw="700">
                  Tổng cộng:
                </TextDefault>
                <TextDefault fs={28} fw="700" color="#1555d5">
                  {finalTotal.toLocaleString('vi-VN')}đ
                </TextDefault>
              </Flex>
            </Flex>

            <Button
              type="primary"
              size="large"
              block
              className="checkout-btn"
              onClick={() => navigate(RoutePaths.PAYMENT)}
            >
              Tiến hành thanh toán
            </Button>

            <div className="security-badges">
              <TextDefault color="#6b7280" fs={12} style={{ textAlign: 'center' }}>
                🔒 Thanh toán an toàn & bảo mật
              </TextDefault>
            </div>
          </Card>
        </Flex>
      )}
    </div>
  );
};

export default MyOrderPage;
