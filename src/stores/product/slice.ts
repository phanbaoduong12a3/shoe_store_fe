import { createSlice } from '@reduxjs/toolkit';
import { Product } from '@/services/product-service';
import {
  getProductsAction,
  getProductDetailAction,
  createProductAction,
  toggleProductStatusAction,
  deleteProductAction,
} from './actions';

export type TProductState = {
  products: Product[];
  productDetail: Product | null;
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: TProductState = {
  products: [],
  productDetail: null,
  total: 0,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Products
    builder.addCase(getProductsAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProductsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.data.products;
      state.total = action.payload.data.pagination.total;
    });
    builder.addCase(getProductsAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch products';
    });

    // Get Product Detail
    builder.addCase(getProductDetailAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getProductDetailAction.fulfilled, (state, action) => {
      state.loading = false;
      state.productDetail = action.payload.data.product;
    });
    builder.addCase(getProductDetailAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch product detail';
    });

    // Create Product
    builder.addCase(createProductAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProductAction.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createProductAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create product';
    });

    // Toggle Product Status
    builder.addCase(toggleProductStatusAction.pending, (state) => {
      state.error = null;
    });
    builder.addCase(toggleProductStatusAction.fulfilled, (state, action) => {
      const updatedProduct = action.payload.data.product;
      const index = state.products.findIndex((p) => p._id === updatedProduct._id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
    });
    builder.addCase(toggleProductStatusAction.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to toggle product status';
    });

    // Delete Product
    builder.addCase(deleteProductAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProductAction.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteProductAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete product';
    });
  },
});

export const productReducer = productSlice.reducer;
