import client from "./api-clients";

export interface AddToCartRequest {
  sessionId?: string;
  productId: string;
  variantId: string;
  quantity: number;
}

export interface CartItem {
  _id?: string;
  productId: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    images: Array<{
      url: string;
      alt?: string;
      isPrimary: boolean;
    }>;
    isActive: boolean;
  };
  variantId: string;
  productName: string;
  color: string;
  size: number;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  _id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  status: number;
  data: {
    message: string;
    cart: Cart;
  };
}

export interface AddToCartResponse {
  status: number;
  data: {
    message: string;
    cart: Cart;
  };
}

export interface GetCartResponse {
  status: number;
  data: {
    cart: Cart;
  };
}

export interface UpdateCartRequest {
  sessionId?: string;
  productId: string;
  variantId: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  sessionId?: string;
  productId: string;
  variantId: string;
}

export const addToCart = async (
  data: AddToCartRequest
): Promise<AddToCartResponse> => {
  const response = await client.post("/api/v1/cart/add", data);
  return response.data;
};

export const getCart = async (sessionId?: string): Promise<GetCartResponse> => {
  const params = sessionId ? { sessionId } : {};
  const response = await client.get("/api/v1/cart", { params });
  return response.data;
};

export const updateCart = async (
  productId: string,
  variantId: string,
  quantity: number,
  sessionId: string
): Promise<CartResponse> => {
  const response = await client.put(`/api/v1/cart/item`, {
    productId,
    variantId,
    quantity,
    sessionId,
  });
  return response.data;
};

export const removeFromCart = async (
  productId: string,
  variantId: string,
  sessionId: string
): Promise<CartResponse> => {
  const response = await client.delete(`/api/v1/cart/remove`, {
    params: { sessionId },
    data: { productId, variantId },
  });
  return response.data;
};

export const clearCart = async (sessionId: string): Promise<CartResponse> => {
  const response = await client.delete(`/api/v1/cart/clear`, {
    params: { sessionId },
  });
  return response.data;
};
