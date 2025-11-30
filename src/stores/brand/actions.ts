/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { EBrandActions } from './constants';
import {
  getBrands,
  GetBrandsParams,
  GetBrandsResponse,
  createBrand,
  CreateBrandRequest,
  CreateBrandResponse,
  updateBrand,
  UpdateBrandRequest,
  UpdateBrandResponse,
  updateBrandLogo,
  UpdateBrandLogoRequest,
  UpdateBrandLogoResponse,
  toggleBrandStatus,
  ToggleBrandStatusRequest,
  ToggleBrandStatusResponse,
  deleteBrand,
  DeleteBrandRequest,
  DeleteBrandResponse,
} from '@/services/brand-service';

interface GetBrandsPayload extends GetBrandsParams {
  onSuccess?: (data: GetBrandsResponse) => void;
  onError?: (error: any) => void;
}

const getBrandsAction = createAsyncThunk(
  EBrandActions.GET_BRANDS,
  async (payload: GetBrandsPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...params } = payload;
      const response = await getBrands(params);

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

interface CreateBrandPayload extends CreateBrandRequest {
  onSuccess?: (data: CreateBrandResponse) => void;
  onError?: (error: any) => void;
}

const createBrandAction = createAsyncThunk(
  EBrandActions.CREATE_BRAND,
  async (payload: CreateBrandPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await createBrand(data);

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

interface UpdateBrandPayload extends UpdateBrandRequest {
  onSuccess?: (data: UpdateBrandResponse) => void;
  onError?: (error: any) => void;
}

const updateBrandAction = createAsyncThunk(
  EBrandActions.UPDATE_BRAND,
  async (payload: UpdateBrandPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await updateBrand(data);

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

interface UpdateBrandLogoPayload extends UpdateBrandLogoRequest {
  onSuccess?: (data: UpdateBrandLogoResponse) => void;
  onError?: (error: any) => void;
}

const updateBrandLogoAction = createAsyncThunk(
  EBrandActions.UPDATE_BRAND_LOGO,
  async (payload: UpdateBrandLogoPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await updateBrandLogo(data);

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

interface ToggleBrandStatusPayload extends ToggleBrandStatusRequest {
  onSuccess?: (data: ToggleBrandStatusResponse) => void;
  onError?: (error: any) => void;
}

const toggleBrandStatusAction = createAsyncThunk(
  EBrandActions.TOGGLE_BRAND_STATUS,
  async (payload: ToggleBrandStatusPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await toggleBrandStatus(data);

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

interface DeleteBrandPayload extends DeleteBrandRequest {
  onSuccess?: (data: DeleteBrandResponse) => void;
  onError?: (error: any) => void;
}

const deleteBrandAction = createAsyncThunk(
  EBrandActions.DELETE_BRAND,
  async (payload: DeleteBrandPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await deleteBrand(data);

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
  getBrandsAction,
  createBrandAction,
  updateBrandAction,
  updateBrandLogoAction,
  toggleBrandStatusAction,
  deleteBrandAction,
};
