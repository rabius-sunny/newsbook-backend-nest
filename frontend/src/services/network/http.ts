import axiosinstance from '@/lib/axiosinstance';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

// Inject token into all requests
axiosinstance.interceptors.request.use(
  (config) => {
    const isAdmin = config.url?.startsWith('/admin');
    const token = Cookies.get(isAdmin ? 'adminToken' : 'token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Type-safe generic client
const requests = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosinstance.get<T>(url, config).then(responseBody),

  post: <T = any>(
    url: string,
    body: object,
    config?: AxiosRequestConfig,
  ): Promise<T> => axiosinstance.post<T>(url, body, config).then(responseBody),

  patch: <T = any>(
    url: string,
    body: object,
    config?: AxiosRequestConfig,
  ): Promise<T> => axiosinstance.patch<T>(url, body, config).then(responseBody),

  put: <T = any>(
    url: string,
    body: object,
    config?: AxiosRequestConfig,
  ): Promise<T> => axiosinstance.put<T>(url, body, config).then(responseBody),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosinstance.delete<T>(url, config).then(responseBody),
};

export default requests;
