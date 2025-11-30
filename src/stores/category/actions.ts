/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { ECategoryActions } from './constants';
import {
  getCategories,
  GetCategoriesParams,
  GetCategoriesResponse,
  createCategory,
  CreateCategoryRequest,
  CreateCategoryResponse,
  updateCategory,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from '@/services/category-service';

interface GetCategoriesPayload extends GetCategoriesParams {
  onSuccess?: (data: GetCategoriesResponse) => void;
  onError?: (error: any) => void;
}

const getCategoriesAction = createAsyncThunk(
  ECategoryActions.GET_CATEGORIES,

  async (payload: GetCategoriesPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...params } = payload;
      const response = await getCategories(params);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (error: any) {
      // Call onError callback if provided
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

interface CreateCategoryPayload extends CreateCategoryRequest {
  onSuccess?: (data: CreateCategoryResponse) => void;
  onError?: (error: any) => void;
}

const createCategoryAction = createAsyncThunk(
  ECategoryActions.CREATE_CATEGORY,
  async (payload: CreateCategoryPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await createCategory(data);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (error: any) {
      // Call onError callback if provided
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

interface UpdateCategoryPayload extends UpdateCategoryRequest {
  onSuccess?: (data: UpdateCategoryResponse) => void;
  onError?: (error: any) => void;
}

const updateCategoryAction = createAsyncThunk(
  ECategoryActions.UPDATE_CATEGORY,
  async (payload: UpdateCategoryPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await updateCategory(data);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (error: any) {
      // Call onError callback if provided
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

export { getCategoriesAction, createCategoryAction, updateCategoryAction };
