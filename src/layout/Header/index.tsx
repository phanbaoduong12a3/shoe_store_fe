import { RoutePaths } from '@/routers/routes-constants';
import { authTokenService } from '@/services/auth-token-service';
import { useAppSelector } from '@/stores';
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { MessageSquareText, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './hot_fix.css';

const Header = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const cartData = useAppSelector((state) => state.cart);
  const { categories } = useAppSelector((state) => state.category);
  const { brands, loading: brandsLoading } = useAppSelector((state) => state.brand);
  const handleLogout = () => {
    // localStorage.removeItem(EAuthToken.ACCESS_TOKEN);
    authTokenService.clearAuthTokens();
    navigate(RoutePaths.HOME);
    window.location.reload();
  };

  return (
    <div>
      <div className="w-full bg-[#1f2125] text-white text-sm h-15 flex items-center justify-center mb-4">
        <div className="max-w-container w-full mx-auto flex justify-between items-center px-10">
          {/* Left menu */}
          <div className="flex items-center gap-2">
            <a href="#" className="hover:text-yellow-400">
              Blog
            </a>
            <span>|</span>
            <a href="#" className="hover:text-yellow-400">
              Tải App
            </a>
            <span>|</span>
            <a href="#" className="hover:text-yellow-400">
              Hàng hiệu giảm đến 50%
            </a>
          </div>

          {/* Right menu */}
          <div className="flex items-center gap-4">
            <a href="#" className="text-yellow-400! font-semibold">
              TẠO SHOP
            </a>

            {user ? (
              // <Dropdown
              //   menu={{
              //     items: [
              //       {
              //         key: 'user_infor',
              //         label: <div onClick={() => navigate('/profile')}>Thông tin cá nhân</div>,
              //       },
              //       {
              //         key: 'logout',
              //         label: <div onClick={handleLogout}>Đăng xuất</div>,
              //       },
              //     ],
              //   }}
              //   trigger={['hover']}
              // >
              //   {/* WRAP trong 1 div duy nhất */}
              //   <div className="flex items-center gap-2 cursor-pointer">
              //     <Avatar src={user.avatar} size={36} icon={<UserOutlined />} />
              //     <p className="text-white font-semibold">{user.fullName}</p>
              //   </div>
              // </Dropdown>
              <div className="dropdown-fix">
                <div className="flex items-center gap-2 cursor-pointer">
                  <Avatar src={user.avatar} size={36} icon={<UserOutlined />} />
                </div>
                <div className="dropdown-content-fix">
                  <div onClick={() => navigate('/profile')}>Thông tin cá nhân</div>
                  <a onClick={() => navigate(RoutePaths.MY_ORDER)}>Đơn hàng</a>
                  <a onClick={handleLogout}>Đăng xuất</a>
                </div>
              </div>
            ) : (
              <div className="dropdown-fix">
                <div>TÀI KHOẢN</div>
                <div className="dropdown-content-fix">
                  <a onClick={() => navigate(RoutePaths.LOGIN)}>Đăng nhập</a>
                  <a onClick={() => navigate(RoutePaths.REGISTER)}>Đăng ký</a>
                </div>
              </div>
              // <Dropdown
              //   menu={{
              //     items: [
              //       {
              //         key: '1',
              //         label: <div onClick={() => navigate(RoutePaths.LOGIN)}>Đăng nhập</div>,
              //       },
              //       {
              //         key: '2',
              //         label: <div onClick={() => navigate(RoutePaths.REGISTER)}>Đăng ký</div>,
              //       },
              //     ],
              //   }}
              //   trigger={['hover']}
              // >
              //   <a href="#" className="hover:text-yellow-400">
              //     TÀI KHOẢN
              //   </a>
              // </Dropdown>
            )}
            <div
              onClick={() => navigate(RoutePaths.CART)}
              className="flex items-center hover:text-yellow-400 cursor-pointer gap-2"
            >
              GIỎ HÀNG ({cartData.cart?.items.length || 0})
              <ShoppingBag className="ml-1" size={18} />
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-200 mx-auto ">
        {/* TOP BAR */}
        <div className="max-w-container mx-auto flex items-center justify-between py-4 px-10">
          {/* Logo */}
          <div
            onClick={() => navigate(RoutePaths.HOME)}
            className="text-[3rem] flex items-center gap-2 text-2xl font-bold cursor-pointer"
          >
            Chung Shoe
          </div>

          {/* Search bar */}
          <div className="flex w-[40%] border border-gray-300 rounded overflow-hidden">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, thương hiệu..."
              className="flex-1 px-4 py-2 outline-none"
            />
            <button className="bg-black text-white w-12 flex items-center justify-center">
              🔍
            </button>
          </div>

          {/* Hotline */}
          <div className="flex items-center gap-4 text-gray-600">
            <MessageSquareText />
            <div className="flex flex-col">
              <div className="flex items-start gap-4">
                Hotline: <span className="font-bold">093.934.8888</span>
              </div>
              <div className="flex items-start gap-4">
                Tổng đài: <span className="font-bold">1900 232322</span>
              </div>
            </div>
          </div>
        </div>

        {/* MENU */}
        <nav className="mt-4 mb-2 max-w-container mx-auto bg-white px-10">
          <ul className="flex px-10 py-3 gap-6 font-semibold">
            <li className="hover:text-yellow-600 cursor-pointer relative group">
              THƯƠNG HIỆU
              <div
                className="absolute left-0 top-full min-w-[200px] bg-white shadow-lg rounded mt-2 py-2 z-10 hidden group-hover:block"
                style={{ border: '1px solid #eee' }}
              >
                {brandsLoading ? (
                  <div className="px-4 py-2 text-gray-500">Đang tải...</div>
                ) : (
                  brands.map((brand) => (
                    <a
                      key={brand._id}
                      href={`/brands/${brand._id}`}
                      className="block px-4 py-2 hover:bg-yellow-100 text-black"
                    >
                      {brand.name}
                    </a>
                  ))
                )}
                {brands.length === 0 && !brandsLoading && (
                  <div className="px-4 py-2 text-gray-500">Không có thương hiệu</div>
                )}
              </div>
            </li>
            {/* <li className="hover:text-yellow-600 cursor-pointer">ĐỒNG HỒ</li>
            <li className="hover:text-yellow-600 cursor-pointer">TÚI XÁCH</li>
            <li className="hover:text-yellow-600 cursor-pointer">NƯỚC HOA</li>
            <li className="hover:text-yellow-600 cursor-pointer">MỸ PHẨM</li>
            <li className="hover:text-yellow-600 cursor-pointer">GIÀY</li>
            <li className="hover:text-yellow-600 cursor-pointer">THỜI TRANG</li>
            <li className="hover:text-yellow-600 cursor-pointer">MŨ NÓN</li>
            <li className="hover:text-yellow-600 cursor-pointer">KÍNH MẮT</li>
            <li className="hover:text-yellow-600 cursor-pointer">SON MÔI</li>
            <li className="hover:text-yellow-600 cursor-pointer">TRANG SỨC</li>
            <li className="hover:text-yellow-600 cursor-pointer">TRANG ĐIỂM</li> */}
            {categories.slice(0, 10).map((category) => (
              <li className="hover:text-yellow-600 cursor-pointer" key={category._id}>
                {category.name.toUpperCase()}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
