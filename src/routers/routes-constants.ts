export const RoutePaths = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_BRANDS: '/admin/brands',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',

  PRODUCT_DETAIL: '/product-detail/:id',
  PRODUCT_DETAIL_LINK: (id: string) => `/product-detail/${id}`,

  CART: '/cart',
  MY_ORDER: '/my-order',
  PAYMENT: '/payment',
  PAYMENT_CONFIRM: '/payment-confirm',
};
