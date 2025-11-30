// import { Avatar, Badge, Button, Dropdown, Input, Layout, List, Menu } from 'antd';
// import {
//   BellOutlined,
//   SearchOutlined,
//   ShoppingCartOutlined,
//   UserOutlined,
//   LogoutOutlined,
// } from '@ant-design/icons';
// import TextDefault from '@/components/Text/Text';
// import { useNavigate } from 'react-router-dom';
// import { RoutePaths } from '@/routers/routes-constants';
// import { useEffect, useState } from 'react';

// const HeaderAntd = Layout.Header;

// interface User {
//   id: string;
//   email: string;
//   fullName: string;
//   phone: string;
//   avatar: string;
//   role: string;
//   loyaltyPoints: number;
// }

// const Header = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState<User | null>(null);

//   useEffect(() => {
//     // Lấy thông tin user từ localStorage
//     const userStr = localStorage.getItem('user');
//     if (userStr) {
//       try {
//         setUser(JSON.parse(userStr));
//       } catch (error) {
//         console.error('Error parsing user data:', error);
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     // Xóa thông tin user và token
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//     setUser(null);
//     navigate(RoutePaths.HOME);
//     window.location.reload();
//   };

//   const onMenuClick = ({ key }: { key: string }) => {
//     navigate(`/${key}`);
//   };

//   const menuItems = [
//     { key: '', label: 'Trang chủ' },
//     { key: 'nam', label: 'Nam' },
//     { key: 'nu', label: 'Nữ' },
//     { key: 'tre-em', label: 'Trẻ em' },
//     { key: 'khuyen-mai', label: 'Khuyến mãi' },
//   ];

//   const notifications = [
//     {
//       id: 1,
//       title: 'Đơn hàng #1290 đã được giao',
//       time: '2 phút trước',
//       avatar: 'https://i.pravatar.cc/40?img=1',
//     },
//     {
//       id: 2,
//       title: 'Khuyến mãi -50% giày Nike',
//       time: '1 giờ trước',
//       avatar: 'https://i.pravatar.cc/40?img=2',
//     },
//   ];

//   const userMenuItems = [
//     {
//       key: 'profile',
//       label: 'Thông tin cá nhân',
//       icon: <UserOutlined />,
//       onClick: () => navigate('/profile'),
//     },
//     {
//       key: 'logout',
//       label: 'Đăng xuất',
//       icon: <LogoutOutlined />,
//       onClick: handleLogout,
//       danger: true,
//     },
//   ];

//   return (
//     <HeaderAntd className="header">
//       <div className="left-section">
//         <TextDefault fw="700" onClick={() => navigate(RoutePaths.HOME)}>
//           Chung Shoe
//         </TextDefault>
//         <Input
//           placeholder="Tìm kiếm sản phẩm..."
//           style={{ width: 260, borderRadius: 8 }}
//           prefix={<SearchOutlined />}
//         />
//       </div>
//       <div className="right-section">
//         <Menu mode="horizontal" onClick={onMenuClick} items={menuItems} />

//         <Badge count={0} onClick={() => navigate(RoutePaths.MY_ORDER)}>
//           <ShoppingCartOutlined style={{ fontSize: 22, cursor: 'pointer' }} />
//         </Badge>

//         <Dropdown
//           trigger={['click']}
//           dropdownRender={() => (
//             <div style={{ width: 280, padding: 12 }}>
//               <h4 style={{ marginBottom: 10 }}>Thông báo</h4>

//               {notifications.length > 0 ? (
//                 <List
//                   itemLayout="horizontal"
//                   dataSource={notifications}
//                   renderItem={(item) => (
//                     <List.Item style={{ cursor: 'pointer' }}>
//                       <List.Item.Meta title={item.title} description={item.time} />
//                     </List.Item>
//                   )}
//                 />
//               ) : (
//                 <div style={{ textAlign: 'center', padding: 20 }}>Không có thông báo mới.</div>
//               )}
//             </div>
//           )}
//         >
//           <Badge count={notifications.length} offset={[-4, 4]}>
//             <BellOutlined style={{ fontSize: 22, cursor: 'pointer' }} />
//           </Badge>
//         </Dropdown>

//         {user ? (
//           // Hiển thị khi đã đăng nhập
//           <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
//             <div className="user-info">
//               <Avatar src={user.avatar} size={36} icon={<UserOutlined />} />
//               <TextDefault fw="600" className="user-name">
//                 {user.fullName}
//               </TextDefault>
//             </div>
//           </Dropdown>
//         ) : (
//           // Hiển thị khi chưa đăng nhập
//           <>
//             <Button type="text" onClick={() => navigate(RoutePaths.LOGIN)}>
//               Đăng nhập
//             </Button>
//             <Button type="primary" onClick={() => navigate(RoutePaths.REGISTER)}>
//               Đăng ký
//             </Button>
//           </>
//         )}
//       </div>
//     </HeaderAntd>
//   );
// };

// export default Header;
