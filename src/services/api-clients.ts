import axios, { InternalAxiosRequestConfig } from 'axios';

// import ResponseError from '@/interface/error-response-interface';
// import { RoutePaths } from '@/routers/routes-constants';
import { authTokenService } from '@/services/auth-token-service';
// let isRefreshing = false;
// const MAX_API_RETRY = 5;
// const asyncDelay = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));
const requestHandler = async (config: InternalAxiosRequestConfig) => {
  // const token = localStorage.getItem(EAuthToken.ACCESS_TOKEN);
  const accessToken = authTokenService.getAccessToken();
  if (config.headers) {
    config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : '';
    config.params = {
      ...config.params,
      version: Date.now(),
    };
  }
  return config;
};

// const responseErrorHandler = async (err: AxiosError) => {
//   const config: AxiosRequestConfig<any> & { _retry?: number } = err?.config as AxiosRequestConfig;
//   if (!config._retry) config._retry = 0;
//   config._retry += 1;

//   if (err?.response?.status === 401) {
//     if (config._retry < MAX_API_RETRY) {
//       return unAuthorizationRefreshHandler(err);
//     }
//     // localStorage.clear();
//     UseAuthToken().clearAuthTokens();
//     window.location.pathname = RoutePaths.LOGIN;
//     return;
//   }

//   if (err?.response?.status === 403) {
//     window.location.pathname = RoutePaths.HOME;
//     return;
//   }

//   const data: any = err?.response?.data;
//   const resp = err?.response;
//   const defaultMessage = err.message;
//   const detail = data?.detail;

//   if (Number(err?.response?.status ?? 0) >= 500) {
//     // prevent show message when internal server error
//     throw new ResponseError('Something wrong', { response: resp, data });
//   }

//   if (detail && typeof detail === 'object' && detail.length) {
//     throw new ResponseError(detail?.[0]?.msg ?? defaultMessage, { response: resp, data });
//   }

//   if (detail)
//     throw new ResponseError(detail?.msg ?? detail ?? defaultMessage, { response: resp, data });
//   return Promise.reject(err.response?.data);
// };

// const unAuthorizationRefreshHandler = async (err: AxiosError) => {
//   const originalRequestConfig = err.config;

//   if (!originalRequestConfig) return;

//   // After all, recall API with valid token
//   delete originalRequestConfig?.headers?.['Authorization'];
//   const response = await client(originalRequestConfig);
//   return response;
// };

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL });

client.interceptors.request.use(requestHandler, (error) => Promise.reject(error));
// client.interceptors.response.use((res) => res, responseErrorHandler);

export default client;
