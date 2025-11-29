import { useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Button, Card, Flex, Spin } from "antd";
import { CheckCircleOutlined, PrinterOutlined } from "@ant-design/icons";
import TextDefault from "@/components/Text/Text";
import { useAppSelector } from "@/stores";
import { RoutePaths } from "@/routers/routes-constants";
import "./payment-confirm.scss";

const PaymentConfirmPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderNumber = searchParams.get("orderNumber");

    // Get order from Redux store
    const { currentOrder, loading } = useAppSelector((state) => state.order);

    useEffect(() => {
        // If no orderNumber in URL and no order in store, redirect to home
        if (!orderNumber && !currentOrder) {
            navigate(RoutePaths.HOME);
        }
    }, [orderNumber, currentOrder, navigate]);

    if (loading || (!currentOrder && orderNumber)) {
        return (
            <div className="loading-container">
                <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
            </div>
        );
    }

    if (!currentOrder) {
        return (
            <div className="payment-confirm-page">
                <Card>
                    <TextDefault fs={18} fw="600">Không tìm thấy thông tin đơn hàng!</TextDefault>
                    <Link to={RoutePaths.HOME}>
                        <Button type="primary">Quay lại trang chủ</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        return `${days[date.getDay()]}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    // Estimate delivery: 3-5 days from now
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);

    const paymentMethodLabels: Record<string, string> = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'bank_transfer': 'Chuyển khoản ngân hàng',
        'credit_card': 'Thẻ tín dụng/Ghi nợ',
        'e_wallet': 'Ví điện tử'
    };

    return (
        <div className="payment-confirm-page">
            <div className="success-header">
                <div className="success-icon">
                    <CheckCircleOutlined />
                </div>
                <TextDefault fs={32} fw="700" className="success-title">
                    Cảm ơn bạn đã đặt hàng!
                </TextDefault>
                <TextDefault color="#6b7280" className="success-subtitle">
                    Một email xác nhận đã được gửi đến {currentOrder.customer.email}
                </TextDefault>
                <TextDefault className="order-id">
                    Mã đơn hàng của bạn là: <span className="order-id-number">{currentOrder.orderNumber}</span>
                </TextDefault>
            </div>

            <Flex gap={40} className="confirm-container">
                {/* Left Section - Order Details */}
                <Card className="order-details-card">
                    <TextDefault fs={20} fw="700" className="section-title">
                        Chi tiết đơn hàng
                    </TextDefault>

                    <Flex vertical gap={16} className="order-items">
                        {currentOrder.items.map((item, index) => (
                            <Flex key={index} gap={16} className="order-item">
                                <div className="item-image-placeholder">
                                    <TextDefault color="#fff">{item.productName.charAt(0)}</TextDefault>
                                </div>
                                <Flex vertical gap={4} style={{ flex: 1 }}>
                                    <TextDefault fw="600">{item.productName}</TextDefault>
                                    <TextDefault fs={14} color="#6b7280">
                                        Size: {item.size} / Màu: {item.color}
                                    </TextDefault>
                                    <TextDefault fs={14} color="#6b7280">
                                        Số lượng: {item.quantity}
                                    </TextDefault>
                                </Flex>
                                <TextDefault fw="600">{item.subtotal.toLocaleString('vi-VN')}đ</TextDefault>
                            </Flex>
                        ))}
                    </Flex>
                </Card>

                {/* Right Section - Shipping & Summary */}
                <div className="right-section">
                    <Card className="shipping-info-card">
                        <TextDefault fs={20} fw="700" className="section-title">
                            Thông tin giao hàng
                        </TextDefault>

                        <Flex vertical gap={12} className="shipping-details">
                            <TextDefault fw="600">{currentOrder.shippingAddress.recipientName}</TextDefault>
                            <TextDefault color="#6b7280">
                                {currentOrder.shippingAddress.address}, {currentOrder.shippingAddress.ward}, {currentOrder.shippingAddress.district}, {currentOrder.shippingAddress.city}
                            </TextDefault>
                            <TextDefault color="#6b7280">{currentOrder.shippingAddress.phone}</TextDefault>

                            <div className="divider" />

                            <Flex vertical gap={4}>
                                <TextDefault fw="600">Dự kiến giao:</TextDefault>
                                <TextDefault color="#6b7280">{formatDate(estimatedDelivery.toISOString())}</TextDefault>
                            </Flex>

                            <Flex vertical gap={4}>
                                <TextDefault fw="600">Phương thức thanh toán:</TextDefault>
                                <TextDefault color="#6b7280">
                                    {paymentMethodLabels[currentOrder.paymentMethod] || currentOrder.paymentMethod}
                                </TextDefault>
                            </Flex>

                            <Flex vertical gap={4}>
                                <TextDefault fw="600">Trạng thái thanh toán:</TextDefault>
                                <TextDefault color={currentOrder.paymentStatus === 'paid' ? '#52c41a' : '#faad14'}>
                                    {currentOrder.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </TextDefault>
                            </Flex>
                        </Flex>
                    </Card>

                    <Card className="order-summary-card">
                        <TextDefault fs={20} fw="700" className="section-title">
                            Tổng kết đơn hàng
                        </TextDefault>

                        <Flex vertical gap={12} className="summary-details">
                            <Flex justify="space-between">
                                <TextDefault color="#6b7280">Tạm tính:</TextDefault>
                                <TextDefault fw="600">{currentOrder.subtotal.toLocaleString('vi-VN')}đ</TextDefault>
                            </Flex>

                            <Flex justify="space-between">
                                <TextDefault color="#6b7280">Phí vận chuyển:</TextDefault>
                                <TextDefault fw="600">
                                    {currentOrder.shippingFee === 0 ? 'Miễn phí' : `${currentOrder.shippingFee.toLocaleString('vi-VN')}đ`}
                                </TextDefault>
                            </Flex>

                            {currentOrder.discount > 0 && (
                                <Flex justify="space-between">
                                    <TextDefault color="#6b7280">Giảm giá:</TextDefault>
                                    <TextDefault fw="600" color="#52c41a">
                                        -{currentOrder.discount.toLocaleString('vi-VN')}đ
                                    </TextDefault>
                                </Flex>
                            )}

                            {currentOrder.loyaltyPointsUsed > 0 && (
                                <Flex justify="space-between">
                                    <TextDefault color="#6b7280">
                                        Điểm tích lũy ({currentOrder.loyaltyPointsUsed} điểm):
                                    </TextDefault>
                                    <TextDefault fw="600" color="#52c41a">
                                        -{currentOrder.loyaltyPointsDiscount.toLocaleString('vi-VN')}đ
                                    </TextDefault>
                                </Flex>
                            )}

                            <div className="divider" />

                            <Flex justify="space-between" className="total-row">
                                <TextDefault fs={18} fw="700">Tổng cộng:</TextDefault>
                                <TextDefault fs={24} fw="700" color="#1555d5">
                                    {currentOrder.totalAmount.toLocaleString('vi-VN')}đ
                                </TextDefault>
                            </Flex>
                        </Flex>
                    </Card>
                </div>
            </Flex>

            <div className="action-section">
                <TextDefault fs={18} fw="600" className="action-title">
                    Bạn muốn làm gì tiếp theo?
                </TextDefault>
                <Flex gap={16} className="action-buttons">
                    <Button type="primary" size="large" className="track-order-btn">
                        Theo dõi đơn hàng
                    </Button>
                    <Link to={RoutePaths.HOME}>
                        <Button size="large" className="continue-shopping-btn">
                            Tiếp tục mua sắm
                        </Button>
                    </Link>
                </Flex>
            </div>

            <div className="support-footer">
                <TextDefault color="#6b7280" className="support-text">
                    Cần hỗ trợ? Liên hệ chúng tôi qua hotline{" "}
                    <a href="tel:19001234" className="hotline-link">1900 1234</a>{" "}
                    hoặc{" "}
                    <a href="#" className="support-link">trò chuyện trực tuyến</a>
                </TextDefault>
                <Button type="text" icon={<PrinterOutlined />} className="print-btn" onClick={() => window.print()}>
                    In đơn hàng
                </Button>
            </div>
        </div>
    );
};

export default PaymentConfirmPage;