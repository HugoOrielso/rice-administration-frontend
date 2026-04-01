import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
}); 

axiosClient.interceptors.request.use(
  async (config) => {
    const session = await getSession();

    if (session?.error?.includes("RefreshFailed")) {
      await signOut({ callbackUrl: "/login" });
      return Promise.reject(new Error("Session expired"));
    }

    const token = session?.accessToken;

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      try {
        const session = await getSession();

        if (session?.refreshToken) {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            {},
            {
              headers: {
                "x-refresh-token": session.refreshToken,
              },
            }
          );
        }
      } catch (logoutError) {
        console.error("Logout backend failed:", logoutError);
      }

      await signOut({ callbackUrl: "/login" });
    }

    return Promise.reject(error);
  }
);


export default axiosClient;


