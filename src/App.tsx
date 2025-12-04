import AppRoutes from './routers';
import { useEffect } from 'react';
import { useAppDispatch } from './stores';
import { getUserInfoAction } from './stores/auth/actions';
import { authTokenService } from './services/auth-token-service';
import { getCartAction } from './stores/cart';
import { getOrCreateSessionId, isLogged } from './utils/cart-utils';
import { useSelector } from 'react-redux';
import { User } from './services/auth-service';
const App = () => {
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

  return <AppRoutes />;
};

export default App;
