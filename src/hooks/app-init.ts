import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '../stores';
import { getUserInfoAction } from '../stores/auth/actions';
import { authTokenService } from '../services/auth-token-service';
import { getCartAction } from '../stores/cart';
import { getOrCreateSessionId, isLogged } from '../utils/cart-utils';
import { useSelector } from 'react-redux';
import { User } from '../services/auth-service';
import { getCategoriesAction } from '../stores/category';
import { getBrandsAction } from '../stores/brand';
import { getProductsAction } from '../stores/product';

export function useAppInit() {
  const dispatch = useAppDispatch();
  const { user, authLoading } = useSelector(
    (state: { auth: { user: User; authLoading: boolean } }) => state.auth
  );
  const accessToken = authTokenService.getAccessToken();

  useEffect(() => {
    if (accessToken) {
      dispatch(getUserInfoAction());
    }
  }, [accessToken, dispatch]);

  useEffect(() => {
    dispatch(
      getCartAction({
        userId: user ? user._id : undefined,
        sessionId: !isLogged() ? getOrCreateSessionId() : undefined,
      })
    );
  }, [authLoading, dispatch, user]);

  const loadInitialData = useCallback(() => {
    dispatch(
      getCategoriesAction({
        isActive: true,
        onSuccess: (data) => console.log('Categories loaded:', data),
        onError: (err) => console.error('Error loading categories:', err),
      })
    );

    dispatch(
      getBrandsAction({
        onSuccess: (data) => console.log('Brands loaded:', data),
        onError: (err) => console.error('Error loading brands:', err),
      })
    );

    dispatch(
      getProductsAction({
        page: 1,
        limit: 30,
        onSuccess: (data) => console.log('Products loaded:', data),
        onError: (err) => console.error('Error loading products:', err),
      })
    );
  }, [dispatch]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
}
