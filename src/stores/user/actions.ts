import { createAsyncThunk } from '@reduxjs/toolkit';
import { EUserActions } from './constants';
import { getListUsers, GetUsersParams, GetUsersResponse } from '@/services/user-service';

interface GetUsersPayload extends GetUsersParams {
  onSuccess?: (data: GetUsersResponse) => void;
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

export { getListUserAction };
