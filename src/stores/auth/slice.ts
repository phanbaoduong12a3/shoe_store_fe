import { createSlice } from '@reduxjs/toolkit';

import { postSigninAction, postSignupAction } from './actions';
import { EAuthToken } from '@/variables/storage';

type TAuthState = {
    user: {
        id: string;
        email: string;
        fullName: string;
        phone: string;
        avatar: string;
        role: string;
        loyaltyPoints: number;
    } | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
};

const initialState: TAuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
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
            localStorage.removeItem('token');
            localStorage.removeItem('user');
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
                state.token = action.payload.data.token;
                state.isAuthenticated = true;
                state.error = null;
                // Store in localStorage
                localStorage.setItem(EAuthToken.ACCESS_TOKEN, action.payload.data.token);
                localStorage.setItem('user', JSON.stringify(action.payload.data.user));
                localStorage.setItem('userId', action.payload.data.user.id);
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
            });
    },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice;
