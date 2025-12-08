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
  CATEGORY_DETAIL: '/category-detail/:id',
  BRAND_DETAIL: '/brand-detail/:id',
  BRAND_DETAIL_LINK: (id: string) => `/brand-detail/${id}`,
  CATEGORY_DETAIL_LINK: (id: string) => `/category-detail/${id}`,
  PRODUCT_DETAIL_LINK: (id: string) => `/product-detail/${id}`,

  CART: '/cart',
  MY_ORDER: '/my-order',
  PAYMENT: '/payment',
  PAYMENT_CONFIRM: '/payment-confirm',
};
