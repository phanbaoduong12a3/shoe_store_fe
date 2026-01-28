import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Radio, Flex, Spin, App, Divider, InputNumber } from 'antd';
import { ShoppingCartOutlined, EnvironmentOutlined, CreditCardOutlined } from '@ant-design/icons';
import TextDefault from '@/components/Text/Text';
import { useAppDispatch, useAppSelector } from '@/stores';
import { clearCartAction, getCartAction } from '@/stores/cart';
import { createOrderAction } from '@/stores/order';
import { getOrCreateSessionId, isLogged } from '@/utils/cart-utils';
import { RoutePaths } from '@/routers/routes-constants';
import type { CustomerInfo, ShippingAddress } from '@/services/order-service';
import { createVNPayOrder } from '@/services/payment-service';
import './payment.scss';
import { getUserInfoAction } from '@/stores/auth';

const PaymentPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, loading: cartLoading } = useAppSelector((state) => state.cart);
  const { loading: orderLoading } = useAppSelector((state) => state.order);
  const { message } = App.useApp();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user ? user._id : '';
  const isLoggedIn = isLogged();

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'banking' | 'CREDIT_CARD' | 'zalopay'>(
    'COD'
  );
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [voucherCode, setVoucherCode] = useState('');

  const loadUserInfo = useCallback(() => {
    dispatch(getUserInfoAction())
      .unwrap()
      .then((data) => {
        const user = data?.user;
        if (!user) return;

        const defaultAddress = user.addresses?.find((a) => a.isDefault);

        form.setFieldsValue({
          customerName: user.fullName || '',
          customerPhone: user.phone || '',
          customerEmail: user.email || '',

          recipientName: defaultAddress?.recipientName || user.fullName || '',
          recipientPhone: defaultAddress?.phone || user.phone || '',
          address: defaultAddress?.address || '',
          ward: defaultAddress?.ward || '',
          district: defaultAddress?.district || '',
          city: defaultAddress?.city || '',
        });
      })
      .catch((err) => {
        console.error('Load user info error:', err);
      });
  }, [dispatch, form]);
  useEffect(() => {
    loadUserInfo();
  }, [loadUserInfo]);
  const loadCart = useCallback(() => {
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

  const shippingFee = 50000;
  const taxRate = 0.1;

  const subtotal =
    cart?.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0) || 0;

  const tax = subtotal * taxRate;
  const loyaltyPointsDiscount = loyaltyPoints * 1000; // 1 point = 1000đ
  const discount = loyaltyPointsDiscount;
  const totalAmount = subtotal + shippingFee + tax - discount;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmitOrder = async (values: any) => {
    if (!cart || cart.items.length === 0) {
      message.warning('Giỏ hàng trống!');
      return;
    }

    const customer: CustomerInfo = {
      name: values.customerName,
      phone: values.customerPhone,
      email: values.customerEmail,
    };

    const shippingAddress: ShippingAddress = {
      recipientName: values.recipientName,
      phone: values.recipientPhone,
      address: values.address,
      ward: values.ward,
      district: values.district,
      city: values.city,
      country: 'Vietnam',
    };

    const items = cart.items.map((item) => ({
      productId: item.productId._id,
      variantId: item.variantId,
      productName: item.productName,
      color: item.color,
      size: item.size,
      sku: `${item.productId._id}-${item.variantId}`,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      image: item.image,
    }));

    dispatch(
      createOrderAction({
        userId: isLogged() && userId ? userId : undefined,
        customer,
        shippingAddress,
        items,
        subtotal,
        shippingFee,
        discount,
        voucherCode: voucherCode || undefined,
        loyaltyPointsUsed: loyaltyPoints,
        loyaltyPointsDiscount,
        totalAmount,
        paymentMethod: paymentMethod.toLowerCase(),
        note: values.note,
        onSuccess: async (data) => {
          message.success('Đặt hàng thành công! 🎉');

          // Clear cart after successful order
          if (isLoggedIn && userId.length > 0) {
            dispatch(clearCartAction({}));
            dispatch(
              getCartAction({
                userId: userId,
                onSuccess: () => {
                  navigate(`${RoutePaths.MY_ORDER}`);
                },
                onError: (error) => {
                  console.error('Error reloading cart:', error);
                },
              })
            );
          }

          if (paymentMethod === 'banking') {
            try {
              const paymentResponse = await createVNPayOrder(data.data.order._id, totalAmount);

              if (paymentResponse.status === 200) {
                window.location.href = paymentResponse.data.paymentUrl;
                return;
              }
            } catch (error) {
              console.error('Payment error:', error);
              message.error('Không thể tạo link thanh toán! Vui lòng thử lại.');
            }
          }

        },
        onError: (error) => {
          message.error(error?.response?.data?.data?.message || 'Không thể tạo đơn hàng!');
        },
      })
    );
  };

  if (cartLoading && !cart) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="payment-page">
        <Card className="empty-cart">
          <TextDefault fs={18} fw="600">
            Giỏ hàng trống!
          </TextDefault>
          <Button type="primary" onClick={() => navigate(RoutePaths.HOME)}>
            Quay lại trang chủ
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="page-header">
        <TextDefault fs={32} fw="700">
          Thanh toán
        </TextDefault>
        <br />
        <TextDefault color="#6b7280">
          Vui lòng điền đầy đủ thông tin để hoàn tất đơn hàng
        </TextDefault>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmitOrder} className="payment-form">
        <Flex gap={24} className="payment-content">
          <div className="payment-left">
            {/* Customer Information */}
            <Card className="info-card">
              <Flex align="center" gap={12} className="card-title">
                <ShoppingCartOutlined style={{ fontSize: 24, color: '#1555d5' }} />
                <TextDefault fs={20} fw="700">
                  Thông tin khách hàng
                </TextDefault>
              </Flex>

              <Form.Item label="Họ và tên" name="customerName">
                <Input size="large" placeholder="Nguyễn Văn A" disabled />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="customerPhone">
                <Input size="large" placeholder="0123456789" disabled />
              </Form.Item>

              <Form.Item label="Email" name="customerEmail">
                <Input size="large" placeholder="example@email.com" disabled />
              </Form.Item>
            </Card>

            {/* Shipping Address */}
            <Card className="info-card">
              <Flex align="center" gap={12} className="card-title">
                <EnvironmentOutlined style={{ fontSize: 24, color: '#1555d5' }} />
                <TextDefault fs={20} fw="700">
                  Địa chỉ giao hàng
                </TextDefault>
              </Flex>

              <Form.Item
                label="Tên người nhận"
                name="recipientName"
                rules={[{ required: true, message: 'Vui lòng nhập tên người nhận!' }]}
              >
                <Input size="large" placeholder="Nguyễn Văn A" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại người nhận"
                name="recipientPhone"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ!' },
                ]}
              >
                <Input size="large" placeholder="0123456789" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ cụ thể"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
              >
                <Input size="large" placeholder="Số nhà, tên đường" />
              </Form.Item>

              <Flex gap={16}>
                <Form.Item
                  label="Phường/Xã"
                  name="ward"
                  rules={[{ required: true, message: 'Vui lòng nhập phường/xã!' }]}
                  style={{ flex: 1 }}
                >
                  <Input size="large" placeholder="Phường 1" />
                </Form.Item>
              </Flex>

              <Form.Item
                label="Tỉnh/Thành phố"
                name="city"
                rules={[{ required: true, message: 'Vui lòng nhập tỉnh/thành phố!' }]}
              >
                <Input size="large" placeholder="TP. Hồ Chí Minh" />
              </Form.Item>
            </Card>

            {/* Payment Method */}
            <Card className="info-card">
              <Flex align="center" gap={12} className="card-title">
                <CreditCardOutlined style={{ fontSize: 24, color: '#1555d5' }} />
                <TextDefault fs={20} fw="700">
                  Phương thức thanh toán
                </TextDefault>
              </Flex>

              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="payment-methods"
              >
                <Radio value="cod" className="payment-method-option">
                  <Flex vertical gap={4}>
                    <TextDefault fw="600">Thanh toán khi nhận hàng (COD)</TextDefault>
                    <TextDefault fs={13} color="#6b7280">
                      Thanh toán bằng tiền mặt khi nhận hàng
                    </TextDefault>
                  </Flex>
                </Radio>
                <Radio value="banking" className="payment-method-option">
                  <Flex vertical gap={4}>
                    <TextDefault fw="600">Thanh toán qua VNPay</TextDefault>
                    <TextDefault fs={13} color="#6b7280">
                      Thanh toán online với VNPay
                    </TextDefault>
                  </Flex>
                </Radio>
              </Radio.Group>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="payment-right">
            <Card className="order-summary-card">
              <p className="text-[2rem] font-semibold"> Đơn hàng của bạn</p>

              <Divider />

              <div className="order-items">
                {cart.items.map((item, index) => (
                  <Flex key={index} justify="space-between" className="order-item">
                    <Flex gap={12}>
                      <img src={item.image} alt={item.productName} className="item-image" />
                      <Flex vertical gap={4}>
                        <TextDefault fw="600">{item.productName}</TextDefault>
                        <TextDefault fs={13} color="#6b7280">
                          {item.color} / Size {item.size}
                        </TextDefault>
                        <TextDefault fs={13} color="#6b7280">
                          x{item.quantity}
                        </TextDefault>
                      </Flex>
                    </Flex>
                    <TextDefault fw="600" color="#1555d5">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </TextDefault>
                  </Flex>
                ))}
              </div>

              <Divider />

              {/* Voucher */}
              <div className="voucher-section">
                <TextDefault fw="600" style={{ marginBottom: 8 }}>
                  Mã giảm giá
                </TextDefault>
                <Flex gap={8}>
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                  />
                  <Button>Áp dụng</Button>
                </Flex>
              </div>

              {/* Loyalty Points */}
              <div className="loyalty-section">
                <TextDefault fw="600" style={{ marginBottom: 8 }}>
                  Điểm tích lũy
                </TextDefault>
                <Flex gap={8} align="center">
                  <InputNumber
                    min={0}
                    max={100}
                    value={loyaltyPoints}
                    onChange={(val) => setLoyaltyPoints(val || 0)}
                    placeholder="Số điểm"
                    style={{ flex: 1 }}
                  />
                  <TextDefault fs={13} color="#6b7280">
                    (1 điểm = 1,000đ)
                  </TextDefault>
                </Flex>
              </div>

              <Divider />

              {/* Price Summary */}
              <Flex vertical gap={12} className="price-summary">
                <Flex justify="space-between">
                  <TextDefault color="#6b7280">Tạm tính:</TextDefault>
                  <TextDefault fw="600">{subtotal.toLocaleString('vi-VN')}đ</TextDefault>
                </Flex>

                <Flex justify="space-between">
                  <TextDefault color="#6b7280">Phí vận chuyển:</TextDefault>
                  <TextDefault fw="600">{shippingFee.toLocaleString('vi-VN')}đ</TextDefault>
                </Flex>

                <Flex justify="space-between">
                  <TextDefault color="#6b7280">Thuế VAT (10%):</TextDefault>
                  <TextDefault fw="600">{tax.toLocaleString('vi-VN')}đ</TextDefault>
                </Flex>

                {discount > 0 && (
                  <Flex justify="space-between">
                    <TextDefault color="#52c41a">Giảm giá:</TextDefault>
                    <TextDefault fw="600" color="#52c41a">
                      -{discount.toLocaleString('vi-VN')}đ
                    </TextDefault>
                  </Flex>
                )}

                <Divider style={{ margin: '12px 0' }} />

                <Flex justify="space-between" className="total-row">
                  <TextDefault fs={18} fw="700">
                    Tổng cộng:
                  </TextDefault>
                  <TextDefault fs={28} fw="700" color="#1555d5">
                    {totalAmount.toLocaleString('vi-VN')}đ
                  </TextDefault>
                </Flex>
              </Flex>

              <Button
                type="primary"
                size="large"
                block
                htmlType="submit"
                loading={orderLoading}
                className="submit-btn"
              >
                {paymentMethod === 'zalopay' ? 'Thanh toán qua ZaloPay' : 'Đặt hàng'}
              </Button>

              <TextDefault fs={12} color="#6b7280" style={{ textAlign: 'center', marginTop: 16 }}>
                Bằng việc đặt hàng, bạn đồng ý với <a href="#">Điều khoản sử dụng</a> của chúng tôi
              </TextDefault>
            </Card>
          </div>
        </Flex>
      </Form>
    </div>
  );
};

export default PaymentPage;
