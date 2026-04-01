import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
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
      } catch {}

      await signOut({ callbackUrl: "/login" });
    }

    return Promise.reject(error);
  }
);

export default api;