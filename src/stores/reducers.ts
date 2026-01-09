import { combineReducers } from '@reduxjs/toolkit';

import { authReducer } from './auth';
import { categoryReducer } from './category';
import { brandReducer } from './brand';
import { productReducer } from './product';
import { cartReducer } from './cart';
import { orderReducer } from './order';
import { userReducer } from './user';
import { blogReducer } from './blog/slice';
import { reviewReducer } from './review';

const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  brand: brandReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
  user: userReducer,
  blog: blogReducer,
  review: reviewReducer,
});

export default rootReducer;
