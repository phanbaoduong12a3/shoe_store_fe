import Footer from './Footer';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <div className="max-w-container mx-auto min-h-screen px-10">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
