import { useEffect, useRef, useState } from 'react';
import { Layout, Menu, Avatar, Button, theme, message } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import './admin-layout.scss';
import { postSignoutAction } from '@/stores/auth/actions';
import { useAppDispatch } from '@/stores';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Menu items cho sidebar
  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'categories',
      icon: <TagsOutlined />,
      label: 'Danh mục',
    },
    {
      key: 'brands',
      icon: <ShopOutlined />,
      label: 'Thương hiệu',
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Sản phẩm',
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Đơn hàng',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Người dùng',
    },
  ];

  // Dropdown menu cho user avatar
  const userMenuItems: MenuProps['items'] = [
    // {
    //   key: 'profile',
    //   icon: <UserOutlined />,
    //   label: 'Thông tin cá nhân',
    // },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(`/admin/${key}`);
  };

  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      dispatch(
        postSignoutAction({
          onSuccess: () => {
            message.success({
              content: 'Đăng xuất thành công!',
              duration: 2,
            });
            navigate('/admin/login');
          },
          onError: () => {
            message.error({
              content: 'Đăng xuất thất bại!',
              duration: 3,
            });
          },
        })
      );
    } else {
      navigate(`/admin/${key}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Layout className="admin-layout">
      <Sider trigger={null} collapsible collapsed={collapsed} className="admin-sider" width={250}>
        <div className="logo">
          <ShoppingOutlined style={{ fontSize: 24 }} />
          {!collapsed && <span className="logo-text">Chung Shoe Admin</span>}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
          }}
          className="admin-header"
        >
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
          </div>
          <div className="header-right">
            <div className="relative" ref={menuRef}>
              {/* User info */}
              <div
                className="user-info"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((prev) => !prev);
                }}
              >
                <Avatar size="large" icon={<UserOutlined />} />
                <span className="user-name">Admin</span>
              </div>

              {/* Menu */}
              {open && (
                <div className="user-menu">
                  {userMenuItems.map((item, index) => {
                    if (item?.type === 'divider') {
                      return <div key={`divider-${index}`} className="menu-divider" />;
                    }

                    return (
                      <div
                        key={item?.key}
                        className={`menu-item ${item?.key === 'logout' ? 'danger' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserMenuClick({ key: item?.key as string });
                          setOpen(false);
                        }}
                      >
                        <span className="menu-icon">{(item as any)?.icon}</span>
                        <span>{item?.label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 'calc(100vh - 64px - 48px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
