import { createSlice } from '@reduxjs/toolkit';
import { UserDetail } from '@/services/auth-service';
import { deleteUserAction, getListUserAction } from './actions';

export type TUserState = {
  users: UserDetail[];
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  users: [],
  total: 0,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Users
    builder.addCase(getListUserAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getListUserAction.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.data.users;
      state.total = action.payload.data.pagination.total;
    });
    builder.addCase(getListUserAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch users';
    });
    // Delete User
    builder.addCase(deleteUserAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUserAction.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteUserAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete user';
    });
  },
});

export const userReducer = userSlice.reducer;
