// stores/blog/index.ts
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppDispatch } from 'recharts/types/state/store';

interface BlogState {
  blogs: any[];
  loading: boolean;
}

const initialState: BlogState = {
  blogs: [],
  loading: false,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    getBlogsSuccess(state, action) {
      state.blogs = action.payload;
      state.loading = false;
    },
    getBlogsFail(state) {
      state.loading = false;
    },
  },
});

export const { startLoading, getBlogsSuccess, getBlogsFail } = blogSlice.actions;

export const blogReducer = blogSlice.reducer;

/* ACTION */
export const getBlogsAction =
  ({ tag }: { tag?: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(startLoading());
      const res = await axios.get('http://localhost:8080/api/v1/blogs', {
        params: { tag },
      });
      dispatch(getBlogsSuccess(res.data.data.blogs));
    } catch (e) {
      dispatch(getBlogsFail());
    }
  };
