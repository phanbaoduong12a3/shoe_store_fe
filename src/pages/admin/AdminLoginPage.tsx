import { Button, Form, Input, App } from "antd";
import {
    EyeInvisibleOutlined,
    EyeTwoTone,
    LockOutlined,
    MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "@/routers/routes-constants";
import { useAppDispatch, useAppSelector } from "@/stores";
import { postSigninAction } from "@/stores/auth";
import "./admin-login.scss";
import { setItem } from "@/utils/storage";
import { EAuthToken } from "@/variables/storage";

interface LoginFormValues {
    email: string;
    password: string;
}

const AdminLoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);
    const { message } = App.useApp();

    const onFinish = (values: LoginFormValues) => {
        dispatch(
            postSigninAction({
                ...values,
                onSuccess: (result) => {
                    console.log(result);
                    // Check if user has admin role
                    if (result.data.user.role !== "admin") {
                        message.error({
                            content: "Bạn không có quyền truy cập trang quản trị!",
                            duration: 3,
                        });
                        return;
                    }
                    setItem(EAuthToken.ACCESS_TOKEN, result.data.token);

                    message.success({
                        content: `Chào mừng ${result.data.user.fullName}! Đăng nhập thành công 🎉`,
                        duration: 2,
                    });

                    // Navigate to admin dashboard
                    setTimeout(() => {
                        navigate(RoutePaths.ADMIN_DASHBOARD);
                    }, 500);
                },
                onError: (error) => {
                    const errorMessage =
                        error?.response?.data?.message ||
                        error?.message ||
                        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
                    message.error({
                        content: errorMessage,
                        duration: 3,
                    });
                    console.error("Login error:", error);
                },
            })
        );
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <LockOutlined className="lock-icon" />
                    <h2 className="title">Đăng nhập Admin</h2>
                    <p className="sub-title">Chỉ dành cho quản trị viên</p>
                </div>

                <div className="demo-note">
                    <p>
                        <strong>API Endpoint:</strong>
                    </p>
                    <p>POST http://localhost:8080/api/v1/signin</p>
                    <p style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
                        ⚠️ Chỉ tài khoản có role = 'admin' mới được phép đăng nhập
                    </p>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Nhập email quản trị viên"
                            size="large"
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu!" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Nhập mật khẩu"
                            size="large"
                            iconRender={(visible) =>
                                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                            }
                            disabled={loading}
                        />
                    </Form.Item>

                    <Button
                        htmlType="submit"
                        type="primary"
                        size="large"
                        block
                        loading={loading}
                        style={{ height: 44, marginTop: 8 }}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                </Form>

                <div className="bottom-text">
                    <a onClick={() => navigate(RoutePaths.LOGIN)}>
                        ← Quay lại trang đăng nhập người dùng
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
