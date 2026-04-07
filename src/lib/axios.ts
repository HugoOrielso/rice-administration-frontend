import axios, { AxiosError } from "axios";
import { forceLogout } from "./logout";

const axiosClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: () => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

const AUTH_URLS = ["/auth/refresh", "/auth/login", "/auth/logout"];

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };


    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest?.url ?? "";
    if (AUTH_URLS.some((url) => requestUrl.includes(url))) {
      return Promise.reject(error);
    }

    if (originalRequest?._retry) {
      await forceLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(axiosClient(originalRequest!)),
          reject,
        });
      });
    }

    originalRequest!._retry = true;
    isRefreshing = true;

    try {
      await axiosClient.post("/auth/refresh");
      processQueue(null);
      return axiosClient(originalRequest!);
    } catch (refreshError) {
      processQueue(refreshError);
      await forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;