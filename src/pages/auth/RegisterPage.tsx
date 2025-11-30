import { RoutePaths } from '@/routers/routes-constants';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Form, Input, App } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/stores';
import { postSignupAction } from '@/stores/auth';

interface RegisterFormValues {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  confirmPassword: string;
}

const RegisterPage = () => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const onFinish = (values: RegisterFormValues) => {
    dispatch(
      postSignupAction({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
        onSuccess: (data) => {
          message.success({
            content: data.data.message || 'Đăng ký tài khoản thành công! 🎉',
            duration: 3,
          });

          // Reset form
          form.resetFields();

          // Chuyển đến trang đăng nhập sau 1.5s
          setTimeout(() => {
            navigate(RoutePaths.LOGIN);
          }, 1500);
        },
        onError: (error) => {
          message.error({
            content: error?.response?.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.',
            duration: 3,
          });
        },
      })
    );
  };

  return (
    <div className="register-page login-page">
      <div className="login-card">
        <h2 className="title">Đăng ký tài khoản</h2>
        <p className="sub-title">Hãy đăng ký tài khoản của bạn</p>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input placeholder="Nhập họ và tên của bạn" size="large" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="Nhập email của bạn" size="large" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              {
                pattern: /^[0-9]{10,11}$/,
                message: 'Số điện thoại phải có 10-11 chữ số!',
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại của bạn" size="large" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu của bạn"
              size="large"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu của bạn"
              size="large"
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            size="large"
            block
            loading={loading}
            style={{ height: 44 }}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
          </Button>
        </Form>
        <div className="bottom-text">
          Đã có tài khoản? <Link to={RoutePaths.LOGIN}>Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
