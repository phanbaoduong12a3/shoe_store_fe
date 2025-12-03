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
}
export interface GetOrdersParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  brandId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: 'male' | 'female' | 'unisex' | 'kids';
  sortBy?: string;
  order?: 'asc' | 'desc';
  isFeatured?: boolean;
  isNew?: boolean;
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
  orderStatus: string;
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

export const getOrders = async (params: GetOrdersParams = {}): Promise<GetOrdersResponse> => {
  const response = await client.get('/api/v1/admin/orders', { params });
  return response.data;
};

export const createOrder = async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
  const response = await client.post('/api/v1/orders', data);
  return response.data;
};
