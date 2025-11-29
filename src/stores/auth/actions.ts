/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { EAuthActions } from './constants';
import {
    postSignin,
    postSignup,
    SigninRequest,
    SignupRequest,
    AuthResponse,
    SignupResponse
} from '@/services/auth-service';

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
        try {
            const { onSuccess, onError, ...data } = payload;
            const response = await postSignin(data);

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

const postSignupAction = createAsyncThunk(
    EAuthActions.POST_SIGNUP,
    async (payload: PostSignupPayload, { rejectWithValue }) => {
        try {
            const { onSuccess, onError, ...data } = payload;
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

export { postSigninAction, postSignupAction };
