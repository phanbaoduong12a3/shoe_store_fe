import { createAsyncThunk } from '@reduxjs/toolkit';
import { EBlogActions } from './constants';
import {
  DeleteBlogRequest,
  DeleteBlogResponse,
  getListBlogs,
  GetBlogsParams,
  GetBlogsResponse,
  deleteBLog,
  ToggleBlogStatusRequest,
  ToggleBlogStatusResponse,
  toggleBlogStatus,
  CreateBlogRequest,
  CreateBlogResponse,
  createBlog,
  UpdateBlogRequest,
  UpdateBlogResponse,
  updateBlog,
} from '@/services/blog-service';

interface GetBlogsPayload extends GetBlogsParams {
  onSuccess?: (data: GetBlogsResponse) => void;
  onError?: (error: any) => void;
}

interface DeleteBlogPayload extends DeleteBlogRequest {
  onSuccess?: (data: DeleteBlogResponse) => void;
  onError?: (error: any) => void;
}

const getListBlogAction = createAsyncThunk(
  EBlogActions.GET_BLOGS,
  async (payload: GetBlogsPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...params } = payload;
      const response = await getListBlogs(params);

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

const deleteBlogAction = createAsyncThunk(
  EBlogActions.DELETE_BLOG,
  async (payload: DeleteBlogPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await deleteBLog(data);

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

interface CreateBlogPayload extends CreateBlogRequest {
  onSuccess?: (data: CreateBlogResponse) => void;
  onError?: (error: any) => void;
}

const createBlogAction = createAsyncThunk(
  EBlogActions.CREATE_BLOG,
  async (payload: CreateBlogPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await createBlog(data);

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

interface UpdateBlogPayload extends UpdateBlogRequest {
  onSuccess?: (data: UpdateBlogResponse) => void;
  onError?: (error: any) => void;
}

const updateBlogAction = createAsyncThunk(
  EBlogActions.UPDATE_BLOG,
  async (payload: UpdateBlogPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await updateBlog(data);

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

interface ToggleBlogStatusPayload extends ToggleBlogStatusRequest {
  onSuccess?: (data: ToggleBlogStatusResponse) => void;
  onError?: (error: any) => void;
}

const toggleBlogStatusAction = createAsyncThunk(
  EBlogActions.TOGGLE_BLOG_STATUS,
  async (payload: ToggleBlogStatusPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await toggleBlogStatus(data);

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
  getListBlogAction,
  deleteBlogAction,
  toggleBlogStatusAction,
  createBlogAction,
  updateBlogAction,
};
