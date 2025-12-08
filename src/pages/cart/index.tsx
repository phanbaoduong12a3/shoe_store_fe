import TextDefault from '@/components/Text/Text';
import { Button, Card, Flex, InputNumber, Spin, Empty, App } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/routers/routes-constants';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/stores';
import { getCartAction, updateCartAction, removeFromCartAction } from '@/stores/cart';
import { userOrderAction } from '@/stores/order';
import { getOrCreateSessionId, isLogged } from '@/utils/cart-utils';
import './my-order.scss';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, loading: cartLoading, itemLoading } = useAppSelector((state) => state.cart);
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);

  const { message } = App.useApp();

  const loadCart = React.useCallback(() => {
    dispatch(
      getCartAction({
        userId: user ? user._id : undefined,
        sessionId: !isLogged() ? getOrCreateSessionId() : undefined,
        onSuccess: (data) => {
          console.log('Cart loaded:', data);
        },
        onError: (error) => {
          console.error('Error loading cart:', error);
        },
      })
    );
  }, [dispatch, user]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    if (user) {
      dispatch(userOrderAction({}));
    }
  }, [dispatch, user]);

  const handleUpdateQuantity = (productId: string, variantId: string, newQuantity: number) => {
    dispatch(
      updateCartAction({
        productId,
        variantId,
        quantity: newQuantity,
        sessionId: !isLogged() ? getOrCreateSessionId() : undefined,
        userId: isLogged() ? user!._id : undefined,
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
    dispatch(
      removeFromCartAction({
        productId,
        variantId,
        sessionId: !isLogged() ? getOrCreateSessionId() : undefined,
        userId: isLogged() ? user!._id : undefined,
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

  if (cartLoading || authLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Đang tải giỏ hàng..." />
      </div>
    );
  }

  return (
    <div className="my-order-page">
      <div style={{ marginBottom: 32 }}>
        <p className="text-[2rem] font-semibold"> Đơn hàng của bạn</p>
      </div>

      {!cart || cart.items.length === 0 ? (
        <Card className="empty-cart-card">
          <Empty
            description={
              <div className="flex flex-col">
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

                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          className="delete-btn"
                          onClick={() => {
                            const ok = window.confirm('Bạn có chắc muốn xóa sản phẩm này?');
                            if (ok) {
                              handleRemoveItem(item.productId._id, item.variantId);
                            }
                          }}
                        />
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
                          <Spin spinning={!!itemLoading[item.variantId]} size="small">
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
                          </Spin>
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
              // onClick={() => navigate(RoutePaths.PAYMENT)}
              onClick={() => {
                if (isLogged()) {
                  navigate(RoutePaths.PAYMENT);
                } else {
                  message.info('Vui lòng đăng nhập để tiếp tục thanh toán.');
                  setTimeout(() => {
                    navigate(RoutePaths.LOGIN);
                  }, 1500);
                }
              }}
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

export default Cart;
