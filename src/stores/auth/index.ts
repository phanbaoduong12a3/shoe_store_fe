import authSlice from './slice';

export * from './actions';
export const authReducer = authSlice.reducer;

// Selectors
import { TRootState } from '../index';

export const isAuthenticated = (state: TRootState) => state.auth.user !== null;
export const isAdmin = (state: TRootState) => state.auth.user?.role === 'admin';
