import { Suspense, useMemo } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { RoutePaths } from './routes-constants';
import LoginPage from '@/pages/auth/LoginPage';
import UserLayout from '@/layout/UserLayout';
import RegisterPage from '@/pages/auth/RegisterPage';
import AdminLayout from '@/layout/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import CategoryPage from '@/pages/admin/CategoryPage';
import BrandPage from '@/pages/admin/BrandPage';
import ProductPage from '@/pages/admin/ProductPage';
import HomePage from '@/pages/home';
import ProductDetailPage from '@/pages/product-detail';
import Cart from '@/pages/cart';
import PaymentPage from '@/pages/payment';
import PaymentConfirmPage from '@/pages/payment-confirm';
import OrderPage from '@/pages/admin/OrderPage';
import OrdersPage from '@/pages/orders';
import BrandFilterProductPage from '@/pages/filter-product/brand';
import CategoryFilterProductPage from '@/pages/filter-product/category';
import UserPage from '@/pages/admin/UserPage';

const AppRoutes = () => {
  const routes = useMemo(
    () =>
      createBrowserRouter(
        createRoutesFromElements(
          <>
            {/* public route */}
            <Route element={<UserLayout />}>
              <Route element={<LoginPage />} path={RoutePaths.LOGIN} />
              <Route element={<RegisterPage />} path={RoutePaths.REGISTER} />
              <Route element={<HomePage />} path={RoutePaths.HOME} />
              <Route path={RoutePaths.PRODUCT_DETAIL} element={<ProductDetailPage />} />
              <Route path={RoutePaths.CATEGORY_DETAIL} element={<CategoryFilterProductPage />} />
              <Route path={RoutePaths.BRAND_DETAIL} element={<BrandFilterProductPage />} />
              <Route path={RoutePaths.CART} element={<Cart />} />
              <Route path={RoutePaths.MY_ORDER} element={<OrdersPage />} />
              <Route path={RoutePaths.PAYMENT} element={<PaymentPage />} />
              <Route path={RoutePaths.PAYMENT_CONFIRM} element={<PaymentConfirmPage />} />
            </Route>

            {/* admin login - no layout */}
            <Route element={<AdminLoginPage />} path={RoutePaths.ADMIN_LOGIN} />

            {/* admin route */}
            <Route element={<AdminLayout />}>
              <Route element={<DashboardPage />} path={RoutePaths.ADMIN_DASHBOARD} />
              <Route element={<CategoryPage />} path={RoutePaths.ADMIN_CATEGORIES} />
              <Route element={<BrandPage />} path={RoutePaths.ADMIN_BRANDS} />
              <Route element={<ProductPage />} path={RoutePaths.ADMIN_PRODUCTS} />
              <Route element={<OrderPage />} path={RoutePaths.ADMIN_ORDERS} />
              <Route element={<UserPage />} path={RoutePaths.ADMIN_USERS} />
            </Route>
          </>
        )
      ),
    []
  );

  return (
    <Suspense>
      <RouterProvider router={routes} />
    </Suspense>
  );
};

export default AppRoutes;
