import { Button, Checkbox, Form, Input, App } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./loginPage.scss";
import TextDefault from "@/components/Text/Text";
import { RoutePaths } from "@/routers/routes-constants";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/stores";
import { postSigninAction } from "@/stores/auth";

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const LoginPage = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const onFinish = (values: LoginFormValues) => {
    dispatch(
      postSigninAction({
        email: values.email,
        password: values.password,
        onSuccess: (data) => {
          message.success({
            content: data.data.message || "Đăng nhập thành công! 🎉",
            duration: 2,
          });

          // Reset form
          form.resetFields();

          // Chuyển về trang chủ sau 1s
          setTimeout(() => {
            navigate(RoutePaths.HOME);
            // Reload để Header cập nhật
            window.location.reload();
          }, 1000);
        },
        onError: (error) => {
          message.error({
            content:
              error?.response?.data?.message ||
              "Đăng nhập thất bại! Vui lòng kiểm tra lại email và mật khẩu.",
            duration: 3,
          });
        },
      })
    );
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="title">Chào mừng trở lại</h2>
        <p className="sub-title">Hãy đăng nhập tài khoản của bạn</p>
        <p className="demo-note">
          <TextDefault fw="700">Demo Account:</TextDefault> email:
          demo@example.com, password: password
        </p>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input placeholder="Nhập tài khoản email của bạn" size="large" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu của bạn"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <Checkbox name="remember">Remember me</Checkbox>
            <a style={{ color: "#c83c3c" }}>Quên mật khẩu?</a>
          </div>

          <Button
            htmlType="submit"
            type="primary"
            size="large"
            block
            loading={loading}
            style={{ height: 44 }}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Form>
        <div className="bottom-text">
          Chưa có tài khoản?{" "}
          <Link to={RoutePaths.REGISTER}>Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
