import { createSlice } from '@reduxjs/toolkit';
import { createReviewAction, getReviewsAction } from './actions';
import { ReviewDetail } from '@/services/review-service';

export type TReviewState = {
  reviews: ReviewDetail[];
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: TReviewState = {
  reviews: [],
  total: 0,
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Reviews
    builder.addCase(getReviewsAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getReviewsAction.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload.data.reviews;
      state.total = action.payload.data.pagination.total;
    });
    builder.addCase(getReviewsAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch reviews';
    });
    // Create Review
    builder.addCase(createReviewAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createReviewAction.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createReviewAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to create review';
    });
  },
});

export const reviewReducer = reviewSlice.reducer;
