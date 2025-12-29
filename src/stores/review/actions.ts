import { createAsyncThunk } from '@reduxjs/toolkit';
import { EReviewActions } from './constants';
import { createReview, CreateReviewRequest, CreateReviewResponse } from '@/services/review-service';

interface CreateReviewPayload extends CreateReviewRequest {
  onSuccess?: (data: CreateReviewResponse) => void;
  onError?: (error: any) => void;
}

const createReviewAction = createAsyncThunk(
  EReviewActions.CREATE_REVIEW,
  async (payload: CreateReviewPayload, { rejectWithValue }) => {
    try {
      const { onSuccess, onError, ...data } = payload;
      const response = await createReview(data);

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

export { createReviewAction };
