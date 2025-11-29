import { combineReducers } from '@reduxjs/toolkit';

import { authReducer } from './auth';
import { categoryReducer } from './category';
import { brandReducer } from './brand';
import { productReducer } from './product';
import { cartReducer } from './cart';
import { orderReducer } from './order';

const rootReducer = combineReducers({
  auth: authReducer,
  category: categoryReducer,
  brand: brandReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
});

export default rootReducer;
