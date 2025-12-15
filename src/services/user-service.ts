import client from './api-clients';

export interface UserAddress {
  _id: string;
  recipientName: string;
  phone: string;
  address: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface UserDetail {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  avatar: string;
  role: string;
  wishlist: string[];
  loyaltyPoints: number;
  addresses: UserAddress[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  refreshToken: string;
}
export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface GetUsersResponse {
  status: number;
  data: {
    users: UserDetail[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const getListUsers = async (params: GetUsersParams = {}): Promise<GetUsersResponse> => {
  const response = await client.get('/api/v1/admin/users', { params });
  return response.data;
};
