import { Card, Col, Row, Statistic } from "antd";
import {
    ShoppingCartOutlined,
    UserOutlined,
    DollarOutlined,
    RiseOutlined,
} from "@ant-design/icons";

const DashboardPage = () => {
    return (
        <div>
            <h1 style={{ marginBottom: 24 }}>Dashboard</h1>
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tổng đơn hàng"
                            value={1234}
                            prefix={<ShoppingCartOutlined />}
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Người dùng"
                            value={567}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Doanh thu"
                            value={93456789}
                            prefix={<DollarOutlined />}
                            suffix="đ"
                            valueStyle={{ color: "#cf1322" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Tăng trưởng"
                            value={11.28}
                            prefix={<RiseOutlined />}
                            suffix="%"
                            valueStyle={{ color: "#3f8600" }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;
