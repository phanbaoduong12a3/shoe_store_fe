import { createSlice } from '@reduxjs/toolkit';
import { createOrderAction } from './actions';
import type { Order } from '@/services/order-service';

export type TOrderState = {
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Create order
    builder
      .addCase(createOrderAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.data.order;
      })
      .addCase(createOrderAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create order';
      });
  },
});

export const { clearError, clearCurrentOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
