import { createAsyncThunk } from '@reduxjs/toolkit';
import { EUserActions } from './constants';
import {
  deleteUser,
  DeleteUserRequest,
  DeleteUserResponse,
  getListUsers,
  GetUsersParams,
  GetUsersResponse,
} from '@/services/user-service';

interface GetUsersPayload extends GetUsersParams {
  onSuccess?: (data: GetUsersResponse) => void;
  onError?: (error: any) => void;
}

interface DeleteUserPayload extends DeleteUserRequest {
  onSuccess?: (data: DeleteUserResponse) => void;
  onError?: (error: any) => void;
}

const getListUserAction = createAsyncThunk(
  EUserActions.GET_USERS,
  async (payload: GetUsersPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...params } = payload;
      const response = await getListUsers(params);

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

const deleteUserAction = createAsyncThunk(
  EUserActions.DELETE_USER,
  async (payload: DeleteUserPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await deleteUser(data);

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

export { getListUserAction, deleteUserAction };
