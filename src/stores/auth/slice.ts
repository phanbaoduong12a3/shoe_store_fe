import { createSlice } from '@reduxjs/toolkit';

import {
  postSigninAction,
  postSignupAction,
  getUserInfoAction,
  refreshTokenAction,
} from './actions';
import { authTokenService } from '@/services/auth-token-service';
type TAuthState = {
  user: {
    _id: string;
    email: string;
    fullName: string;
    phone: string;
    avatar: string;
    role: string;
    loyaltyPoints: number;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // localStorage.removeItem(EAuthToken.ACCESS_TOKEN);
      authTokenService.clearAuthTokens();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Signin
      .addCase(postSigninAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postSigninAction.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.data.user.role === 'admin';
        state.error = null;
        // localStorage.setItem(EAuthToken.ACCESS_TOKEN, action.payload.data.token);
        authTokenService.setAuthTokens(
          action.payload.data.accessToken,
          action.payload.data.refreshToken || ''
        );
      })
      .addCase(postSigninAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
      })
      // Signup
      .addCase(postSignupAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postSignupAction.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(postSignupAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Signup failed';
      })
      // Get User Info
      .addCase(getUserInfoAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfoAction.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user.role === 'admin';
        state.error = null;
      })
      .addCase(getUserInfoAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fetch user info failed';
        state.isAuthenticated = false;
        state.user = null;
      })
      // Refresh Token
      .addCase(refreshTokenAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenAction.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.error = null;
        // localStorage.setItem(EAuthToken.ACCESS_TOKEN, action.payload.data.token);
        authTokenService.setAuthTokens(action.payload.data.token, action.payload.data.refreshToken);
      })
      .addCase(refreshTokenAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Refresh token failed';
        state.isAuthenticated = false;
        state.token = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice;
