import client from './api-clients';

export interface CreatePaymentRequest {
  newTotal: number;
}

export interface CreatePaymentResponse {
  vnpUrl: string;
}

export const createPaymentOrder = async (
  data: CreatePaymentRequest
): Promise<CreatePaymentResponse> => {
  const response = await client.post('/api/v1/vnpay/create_order_v2', data);
  return response.data;
};
