/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { EAuthActions } from './constants';
import {
  postSignin,
  postSignup,
  getUserInfo,
  SigninRequest,
  SignupRequest,
  AuthResponse,
  SignupResponse,
  User,
} from '@/services/auth-service';
import { postRefreshToken, RefreshTokenResponse } from '@/services/auth-service';

interface PostSigninPayload extends SigninRequest {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: any) => void;
}

interface PostSignupPayload extends SignupRequest {
  onSuccess?: (data: SignupResponse) => void;
  onError?: (error: any) => void;
}

const postSigninAction = createAsyncThunk(
  EAuthActions.POST_SIGNIN,
  async (payload: PostSigninPayload, { rejectWithValue }) => {
    const { onSuccess, onError, ...data } = payload;
    try {
      const response = await postSignin(data);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (error: any) {
      // Call onError callback if provided
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

const postSignupAction = createAsyncThunk(
  EAuthActions.POST_SIGNUP,
  async (payload: PostSignupPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, ...data } = payload;
      const response = await postSignup(data);

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

const getUserInfoAction = createAsyncThunk(
  EAuthActions.GET_USER_INFO,
  async (_, { rejectWithValue }) => {
    try {
      const user: User = await getUserInfo();
      return { user };
    } catch (error: any) {
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response);
    }
  }
);

interface RefreshTokenPayload {
  refreshToken: string;
  onSuccess?: (data: RefreshTokenResponse) => void;
  onError?: (error: any) => void;
}

const refreshTokenAction = createAsyncThunk(
  EAuthActions.REFRESH_TOKEN,
  async (payload: RefreshTokenPayload, { rejectWithValue }) => {
    const { refreshToken, onSuccess, onError } = payload;
    try {
      const response = await postRefreshToken(refreshToken);
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

export { postSigninAction, postSignupAction, getUserInfoAction, refreshTokenAction };
