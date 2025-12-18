import { createSlice } from '@reduxjs/toolkit';
import { deleteBlogAction, getListBlogAction } from './actions';
import { BlogDetail } from '@/services/blog-service';

export type TBlogState = {
  blogs: BlogDetail[];
  total: number;
  loading: boolean;
  error: string | null;
};

const initialState: TBlogState = {
  blogs: [],
  total: 0,
  loading: false,
  error: null,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Blogs
    builder.addCase(getListBlogAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getListBlogAction.fulfilled, (state, action) => {
      state.loading = false;
      state.blogs = action.payload.data.blogs;
      state.total = action.payload.data.pagination.total;
    });
    builder.addCase(getListBlogAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch blogs';
    });
    // Delete Blog
    builder.addCase(deleteBlogAction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteBlogAction.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteBlogAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to delete blog';
    });
  },
});

export const blogReducer = blogSlice.reducer;
