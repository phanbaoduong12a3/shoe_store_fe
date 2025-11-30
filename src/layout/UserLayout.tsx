import { Layout } from 'antd';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const { Content } = Layout;

interface IProps {
  children?: React.ReactNode;
}

const UserLayout = ({ children }: IProps) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Layout>
        <Content style={{ minHeight: 'calc(100vh - 64px - 325px)' }}>
          {children}
          <Outlet />
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default UserLayout;
