// services/auth-token-service.ts
import { cookies } from '@/utils/cookies';
import { refreshTokenAction } from '@/stores/auth/actions';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY = 1; // 1 day
const REFRESH_TOKEN_EXPIRY = 30; // 30 days
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

interface TokenPayload {
  exp: number;
  userId: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DispatchType = (action: any) => Promise<any>;

class AuthTokenService {
  private accessToken: string | null;
  private refreshTimeout: number | null = null;
  private dispatch: DispatchType | null = null;

  constructor() {
    this.accessToken = cookies.get(ACCESS_TOKEN_KEY);
    this.setupAutoRefresh();
  }

  setDispatch(dispatch: DispatchType) {
    this.dispatch = dispatch;
  }

  private decodeToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  setAccessToken(token: string) {
    console.log('Setting access token:', token);
    cookies.set(ACCESS_TOKEN_KEY, token, {
      expires: TOKEN_EXPIRY,
      path: '/',
      sameSite: 'Strict',
    });
    this.accessToken = token;
    this.setupAutoRefresh();
  }

  setRefreshToken(token: string) {
    cookies.set(REFRESH_TOKEN_KEY, token, {
      expires: REFRESH_TOKEN_EXPIRY,
      path: '/',
      sameSite: 'Strict',
    });
  }

  setAuthTokens(accessToken: string, refreshToken: string) {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  clearAuthTokens() {
    cookies.remove(ACCESS_TOKEN_KEY, { path: '/' });
    cookies.remove(REFRESH_TOKEN_KEY, { path: '/' });
    this.accessToken = null;
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    console.log('Refreshing access token...');
    const refreshToken = cookies.get<string>(REFRESH_TOKEN_KEY);
    if (!refreshToken || !this.dispatch) {
      return false;
    }
    try {
      const response = await this.dispatch(refreshTokenAction({ refreshToken })).then((r) =>
        r.unwrap()
      );
      const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;
      this.setAuthTokens(newAccessToken, newRefreshToken ?? '');
      return true;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      this.clearAuthTokens();
      return false;
    }
  }

  private setupAutoRefresh() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
      this.refreshTimeout = null;
    }
    if (!this.accessToken) return;
    const payload = this.decodeToken(this.accessToken);
    if (!payload) return;
    const expiryTime = payload.exp * 1000;
    const now = Date.now();
    const timeUntilRefresh = expiryTime - now - REFRESH_THRESHOLD;
    console.log('Setting up token refresh in (ms):', timeUntilRefresh);
    if (timeUntilRefresh > 0) {
      this.refreshTimeout = window.setTimeout(() => {
        this.refreshAccessToken();
      }, timeUntilRefresh);
    } else {
      this.refreshAccessToken();
    }
  }

  getAccessToken() {
    return cookies.get(ACCESS_TOKEN_KEY);
  }

  getRefreshToken() {
    return cookies.get(REFRESH_TOKEN_KEY);
  }

  isAuthenticated() {
    return Boolean(this.getAccessToken());
  }
}

export const authTokenService = new AuthTokenService();
