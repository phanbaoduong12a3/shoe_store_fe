import { createSlice } from '@reduxjs/toolkit';

import { getCategoriesAction } from './actions';
import { Category } from '@/services/category-service';

type TCategoryState = {
  categories: Category[];
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: TCategoryState = {
  categories: [],
  total: 0,
  loading: false,
  error: null,
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCategoriesAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCategoriesAction.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data.categories;
        state.total = action.payload.data.total;
        state.error = null;
      })
      .addCase(getCategoriesAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
  },
});

export const { clearError } = categorySlice.actions;

export default categorySlice;
