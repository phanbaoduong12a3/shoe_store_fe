import { createSlice } from '@reduxjs/toolkit';
import { addToCartAction, getCartAction, updateCartAction, removeFromCartAction } from './actions';
import type { Cart } from '@/services/cart-service';

export type TCartState = {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  cartCount: number;
  itemLoading: { [variantId: string]: boolean };
};

const initialState: TCartState = {
  cart: null,
  loading: false,
  error: null,
  cartCount: 0,
  itemLoading: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Add to cart
    builder
      .addCase(addToCartAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAction.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data.cart;
        state.cartCount = action.payload.data.cart.items.length;
      })
      .addCase(addToCartAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to cart';
      });

    // Get cart
    builder
      .addCase(getCartAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartAction.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data.cart;
        state.cartCount = action.payload.data.cart.items.length;
      })
      .addCase(getCartAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      });

    // Update cart
    builder
      .addCase(updateCartAction.pending, (state, action) => {
        // Lấy variantId từ meta.arg
        const variantId = action.meta?.arg?.variantId;
        if (variantId) {
          state.itemLoading[variantId] = true;
        }
        state.error = null;
      })
      .addCase(updateCartAction.fulfilled, (state, action) => {
        // Lấy variantId từ meta.arg
        const variantId = action.meta?.arg?.variantId;
        if (variantId) {
          state.itemLoading[variantId] = false;
        }
        state.cart = action.payload.data.cart;
        state.cartCount = action.payload.data.cart.items.length;
      })
      .addCase(updateCartAction.rejected, (state, action) => {
        // Lấy variantId từ meta.arg
        const variantId = action.meta?.arg?.variantId;
        if (variantId) {
          state.itemLoading[variantId] = false;
        }
        state.error = action.error.message || 'Failed to update cart';
      });

    // Remove from cart
    builder
      .addCase(removeFromCartAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCartAction.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.data.cart;
        state.cartCount = action.payload.data.cart.items.length;
      })
      .addCase(removeFromCartAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove from cart';
      });
  },
});

export const { clearError } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
