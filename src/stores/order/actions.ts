/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { EOrderActions } from './constants';
import { createOrder, CreateOrderRequest, CreateOrderResponse, getOrders, GetOrdersParams, GetOrdersResponse } from '@/services/order-service';

interface CreateOrderPayload extends CreateOrderRequest {
  onSuccess?: (data: CreateOrderResponse) => void;
  onError?: (error: any) => void;
}
interface GetOrdersPayload extends GetOrdersParams {
  onSuccess?: (data: GetOrdersResponse) => void;
  onError?: (error: any) => void;
}
const getOrdersAction = createAsyncThunk(
  EOrderActions.GET_ORDER,
  async (payload: GetOrdersPayload, { rejectWithValue }) => {
    const { onSuccess, onError, ...params } = payload;
    try {
      const response = await getOrders(params);

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (error: any) {
      if (onError) {
        onError(error);
      }

      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);

const createOrderAction = createAsyncThunk(
  EOrderActions.CREATE_ORDER,
  async (payload: CreateOrderPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await createOrder(data);

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (error: any) {
      if (payload.onError) {
        payload.onError(error);
      }

      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);

export { createOrderAction, getOrdersAction };
