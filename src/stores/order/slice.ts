import { createSlice } from '@reduxjs/toolkit';
import { getOrdersAction, createOrderAction, userOrderAction, cancelOrderAction } from './actions';
import { Order } from '@/services/order-service';

export type TOrderState = {
  orders: Order[];
  orderDetail: Order | null;
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orders: [],
  orderDetail: null,
  total: 0,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Products
    builder.addCase(getOrdersAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getOrdersAction.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload.data.orders;
      state.total = action.payload.data.pagination.total;
    });
    builder.addCase(getOrdersAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch products';
    });
    // Create Order
    builder.addCase(createOrderAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createOrderAction.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create order';
    });

    // User Order
    builder.addCase(userOrderAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(userOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload.data.orders;
      state.total = action.payload.data.pagination.total;
    });
    builder.addCase(userOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch user orders';
    });

    // Cancel Order
    builder.addCase(cancelOrderAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(cancelOrderAction.fulfilled, (state, action) => {
      state.loading = false;
      // Nếu API trả về order đã hủy, cập nhật lại orders
      const canceledOrder = action.payload?.data?.order;
      if (canceledOrder) {
        state.orders = state.orders.map((order) =>
          order._id === canceledOrder._id ? canceledOrder : order
        );
      }
    });
    builder.addCase(cancelOrderAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to cancel order';
    });
  },
});

export const orderReducer = orderSlice.reducer;
