/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { EOrderActions } from './constants';
import {
  createOrder,
  CreateOrderRequest,
  CreateOrderResponse,
  getOrders,
  GetOrdersParams,
  GetOrdersResponse,
  getUserOrders,
  cancelOrder,
} from '@/services/order-service';

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

const userOrderAction = createAsyncThunk(
  EOrderActions.USER_ORDER,
  async (payload: GetOrdersPayload, { rejectWithValue }) => {
    const { onSuccess, onError, ...params } = payload;
    try {
      const response = await getUserOrders(params);

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
    const { onSuccess, onError, ...data } = payload;
    try {
      const response = await createOrder(data);

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

interface CancelOrderPayload {
  orderId: string;
  reason: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const cancelOrderAction = createAsyncThunk(
  EOrderActions.CANCEL_ORDER,
  async (payload: CancelOrderPayload, { rejectWithValue }) => {
    const { orderId, reason, onSuccess, onError } = payload;
    try {
      const response = await cancelOrder(orderId, reason);

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

export { createOrderAction, getOrdersAction, userOrderAction, cancelOrderAction };
