import client from './api-clients';

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

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
export interface User {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
  avatar: string;
  role: string;
  loyaltyPoints: number;
}

export interface AuthResponse {
  status: number;
  data: {
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface SignoutResponse {
  status: number;
  data: {
    message: string;
  };
}

export interface SignupResponse {
  status: number;
  data: {
    message: string;
  };
}

export const postSignin = async (data: SigninRequest): Promise<AuthResponse> => {
  const response = await client.post('/api/v1/signin', data);
  return response.data;
};

export const postSignup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await client.post('/api/v1/signup', data);
  return response.data;
};

export const getUserInfo = async (): Promise<UserDetail> => {
  const response = await client.get('/api/v1/me');
  return response.data.data.user;
};

export interface RefreshTokenResponse {
  status: number;
  data: {
    token: string;
    refreshToken: string;
    message?: string;
  };
}

export const postRefreshToken = async (refreshToken: string): Promise<RefreshTokenResponse> => {
  const response = await client.post('/api/v1/refresh-token', { refreshToken });
  return response.data;
};

export const postSignout = async (): Promise<SignoutResponse> => {
  const response = await client.post('/api/v1/signOut');
  return response.data;
};
