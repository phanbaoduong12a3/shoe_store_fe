/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { EExampleActions } from './constants';

const getExampleAction = createAsyncThunk(EExampleActions.GET_EXAMPLE, async (id: number, { rejectWithValue }) => {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    const jsonData = await response.json();
    console.log('jsonData', jsonData);
    return jsonData;
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return rejectWithValue(error.response);
  }
});

export { getExampleAction };
