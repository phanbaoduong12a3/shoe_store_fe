import { createSlice } from '@reduxjs/toolkit';

import { getExampleAction } from './actions';
import { TExampleRes } from '@/interfaces/example';

type TExampleState = {
  detail: TExampleRes;
};

const initialState: TExampleState = {
  detail: {
    id: 0,
    category: '',
    title: '',
    image: '',
    description: '',
    price: 0,
    rating: {
      count: 0,
      rate: 0,
    },
  },
};

export const exampleSlice = createSlice({
  name: 'example',
  initialState,
  reducers: {
    setExample: (state, action) => {
      state.detail = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(getExampleAction.fulfilled, (state, action) => {
      state.detail = action.payload;
    });
  },
});

export const { setExample } = exampleSlice.actions;

export default exampleSlice;
