import { UnknownAction, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  devTools: import.meta.env.DEV,
});

export type TRootState = ReturnType<typeof store.getState>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppThunkDispatch = ThunkDispatch<TRootState, any, UnknownAction>;

export const useAppDispatch: () => AppThunkDispatch = useDispatch;
export const useAppSelector = useSelector.withTypes<TRootState>();
export default store;
