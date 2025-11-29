/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios';

import { EAuthToken, EUserProfile } from '@/variables/storage';
import ResponseError from '@/interface/error-response-interface';
import { getItem, setItem } from '@/utils/storage';
import { STATUS_CODE } from '@/variables/constants';
import { RoutePaths } from '@/routers/routes-constants';

let isRefreshing = false;
const MAX_API_RETRY = 5;
const asyncDelay = (ms: number | undefined) => new Promise((resolve) => setTimeout(resolve, ms));
const requestHandler = async (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(EAuthToken.ACCESS_TOKEN);
  if (config.headers) {
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    config.params = {
      ...config.params,
      version: Date.now(),
    };
  }
  return config;
};

const responseErrorHandler = async (err: AxiosError) => {
  const config: AxiosRequestConfig<any> & { _retry?: number } = err?.config as AxiosRequestConfig;
  if (!config._retry) config._retry = 0;
  config._retry += 1;

  if (err?.response?.status === 401) {
    if (config._retry < MAX_API_RETRY) {
      return unAuthorizationRefreshHandler(err);
    }
    localStorage.clear();
    window.location.pathname = RoutePaths.LOGIN;
    return;
  }

  if (err?.response?.status === 403) {
    window.location.pathname = RoutePaths.HOME;
    return;
  }

  const data: any = err?.response?.data;
  const resp = err?.response;
  const defaultMessage = err.message;
  const detail = data?.detail;

  if (Number(err?.response?.status ?? 0) >= 500) {
    // prevent show message when internal server error
    throw new ResponseError('Something wrong', { response: resp, data });
  }

  if (detail && typeof detail === 'object' && detail.length) {
    throw new ResponseError(detail?.[0]?.msg ?? defaultMessage, { response: resp, data });
  }

  if (detail) throw new ResponseError(detail?.msg ?? detail ?? defaultMessage, { response: resp, data });
  return Promise.reject(err.response?.data);
};

const unAuthorizationRefreshHandler = async (err: AxiosError) => {
  const originalRequestConfig = err.config;
  const userId = getItem(EUserProfile.USER_ID);
  const refreshToken = getItem(EAuthToken.REFRESH_TOKEN);

  if (!originalRequestConfig) return;

  // check flag to prevent API be called simultaneously
  if (!isRefreshing) {
    // if didn't call refresh then do it
    try {
      isRefreshing = true;
      if (!refreshToken) throw new ResponseError('No refresh token', {});
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh-token`,
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );
      if (!response || response.data.status_code !== STATUS_CODE.SUCCESS)
        throw new ResponseError('No data from Fief', {});
      const tokens = response.data.data;

      setItem(EAuthToken.ACCESS_TOKEN, tokens.accessToken);
      if (tokens.refreshToken) {
        setItem(EAuthToken.REFRESH_TOKEN, tokens.refreshToken);
      }
    } catch (error) {
      if (error) {
        localStorage.clear();
        window.location.pathname = RoutePaths.LOGIN;
      }
      throw error;
    } finally {
      isRefreshing = false;
    }
  } else {
    // If refresh API is called,
    // then wait for a moment to get token
    // If after 500 millisecond, still don't have valid token
    // create new API call but increase _retry by 1
    await asyncDelay(500);
  }
  // After all, recall API with valid token
  delete originalRequestConfig?.headers?.['Authorization'];
  const response = await client(originalRequestConfig);
  return response;
};

const client = axios.create({ baseURL: import.meta.env.VITE_API_URL });

client.interceptors.request.use(requestHandler, (error) => Promise.reject(error));
client.interceptors.response.use((res) => res, responseErrorHandler);

export default client;
