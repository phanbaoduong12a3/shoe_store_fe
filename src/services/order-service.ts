import client from './api-clients';

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  country?: string;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  productName: string;
  color: string;
  size: number;
  sku: string;
  quantity: number;
  price: number;
  subtotal: number;
  image?: string;
}
export interface GetOrdersParams {
  page?: number;
  limit?: number;

  search?: string;

  sortBy?: string;
  order?: 'asc' | 'desc';
  status?: string;
  paymentMethod?: string;
  paymentStatus?: string;
}

export interface CreateOrderRequest {
  userId?: string;
  customer: CustomerInfo;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount?: number;
  voucherCode?: string;
  loyaltyPointsUsed?: number;
  loyaltyPointsDiscount?: number;
  totalAmount: number;
  paymentMethod: string; // Changed to string to accept lowercase
  note?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId?: string;
  customer: CustomerInfo;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  voucherCode?: string;
  loyaltyPointsUsed: number;
  loyaltyPointsDiscount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}
export interface GetOrdersResponse {
  status: number;
  data: {
    orders: Order[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
export interface CreateOrderResponse {
  status: number;
  data: {
    message: string;
    order: Order;
  };
}

export interface OrderStatusRequest {
  id: string;
  status: string;
  note: string;
}

export interface OrderStatusResponse {
  status: number;
  data: {
    message: string;
    product: Order;
  };
}

export const getOrders = async (params: GetOrdersParams = {}): Promise<GetOrdersResponse> => {
  const response = await client.get('/api/v1/admin/orders', { params });
  return response.data;
};

export const getUserOrders = async (params: GetOrdersParams = {}): Promise<GetOrdersResponse> => {
  const response = await client.get('/api/v1/orders/my_orders', { params });
  return response.data;
};

export const createOrder = async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
  const response = await client.post('/api/v1/orders', data);
  return response.data;
};

export const cancelOrder = async (orderId: string, cancelReason: string) => {
  const response = await client.put(`/api/v1/orders/${orderId}/cancel`, { cancelReason });
  return response.data;
};

export const changeOrderStatus = async (data: OrderStatusRequest): Promise<OrderStatusResponse> => {
  const response = await client.put(`/api/v1/admin/orders/${data.id}/status`, data);
  return response.data;
};
