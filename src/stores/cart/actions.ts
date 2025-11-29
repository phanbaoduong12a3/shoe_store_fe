/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ECartActions } from './constants';
import {
    addToCart,
    AddToCartRequest,
    AddToCartResponse,
    getCart,
    GetCartResponse,
    updateCart,
    UpdateCartRequest,
    removeFromCart,
    RemoveFromCartRequest,
    clearCart
} from '@/services/cart-service';

interface AddToCartPayload extends AddToCartRequest {
    onSuccess?: (data: AddToCartResponse) => void;
    onError?: (error: any) => void;
}

const addToCartAction = createAsyncThunk(
    ECartActions.ADD_TO_CART,
    async (payload: AddToCartPayload, { rejectWithValue }) => {
        try {
            const { onSuccess, onError, ...data } = payload;
            const response = await addToCart(data);

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

interface GetCartPayload {
    sessionId?: string;
    onSuccess?: (data: GetCartResponse) => void;
    onError?: (error: any) => void;
}

const getCartAction = createAsyncThunk(
    ECartActions.GET_CART,
    async (payload: GetCartPayload, { rejectWithValue }) => {
        try {
            const { onSuccess, onError, sessionId } = payload;
            const response = await getCart(sessionId);

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

interface UpdateCartPayload extends UpdateCartRequest {
    onSuccess?: (data: AddToCartResponse) => void;
    onError?: (error: any) => void;
}

const updateCartAction = createAsyncThunk(
    ECartActions.UPDATE_CART,
    async (payload: UpdateCartPayload, { rejectWithValue }) => {
        try {
            const { onSuccess, onError, ...data } = payload;
            const response = await updateCart(data);

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

interface RemoveFromCartPayload extends RemoveFromCartRequest {
    onSuccess?: (data: AddToCartResponse) => void;
    onError?: (error: any) => void;
}

const removeFromCartAction = createAsyncThunk(
    ECartActions.REMOVE_FROM_CART,
    async (payload: RemoveFromCartPayload, { rejectWithValue }) => {
        try {
            const { onSuccess, onError, ...data } = payload;
            const response = await removeFromCart(data);

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

interface ClearCartPayload {
    sessionId?: string;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

const clearCartAction = createAsyncThunk(
    ECartActions.CLEAR_CART,
    async (payload: ClearCartPayload, { rejectWithValue }) => {
        try {
            const { onSuccess, onError, sessionId } = payload;
            const response = await clearCart(sessionId);

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

export { addToCartAction, getCartAction, updateCartAction, removeFromCartAction, clearCartAction };
