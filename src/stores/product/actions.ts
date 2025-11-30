/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { EProductActions } from './constants';
import {
  getProducts,
  GetProductsParams,
  GetProductsResponse,
  createProduct,
  CreateProductRequest,
  CreateProductResponse,
  toggleProductStatus,
  ToggleProductStatusRequest,
  ToggleProductStatusResponse,
  deleteProduct,
  DeleteProductRequest,
  DeleteProductResponse,
} from '@/services/product-service';

interface GetProductsPayload extends GetProductsParams {
  onSuccess?: (data: GetProductsResponse) => void;
  onError?: (error: any) => void;
}

const getProductsAction = createAsyncThunk(
  EProductActions.GET_PRODUCTS,
  async (payload: GetProductsPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...params } = payload;
      const response = await getProducts(params);

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

interface GetProductDetailPayload {
  id: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

const getProductDetailAction = createAsyncThunk(
  EProductActions.GET_PRODUCT_DETAIL,
  async (payload: GetProductDetailPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, id } = payload;
      const { getProductDetail } = await import('@/services/product-service');
      const response = await getProductDetail(id);

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

interface CreateProductPayload extends CreateProductRequest {
  onSuccess?: (data: CreateProductResponse) => void;
  onError?: (error: any) => void;
}

const createProductAction = createAsyncThunk(
  EProductActions.CREATE_PRODUCT,
  async (payload: CreateProductPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await createProduct(data);

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

interface ToggleProductStatusPayload extends ToggleProductStatusRequest {
  onSuccess?: (data: ToggleProductStatusResponse) => void;
  onError?: (error: any) => void;
}

const toggleProductStatusAction = createAsyncThunk(
  EProductActions.TOGGLE_PRODUCT_STATUS,
  async (payload: ToggleProductStatusPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await toggleProductStatus(data);

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

interface DeleteProductPayload extends DeleteProductRequest {
  onSuccess?: (data: DeleteProductResponse) => void;
  onError?: (error: any) => void;
}

const deleteProductAction = createAsyncThunk(
  EProductActions.DELETE_PRODUCT,
  async (payload: DeleteProductPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await deleteProduct(data);

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

export {
  getProductsAction,
  getProductDetailAction,
  createProductAction,
  toggleProductStatusAction,
  deleteProductAction,
};
