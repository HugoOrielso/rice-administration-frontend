import axios from "axios";
import { getSession, signOut } from "next-auth/react";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

axiosClient.interceptors.request.use(async (config) => {
  const session = await getSession()

  if ((session)?.error?.includes("RefreshFailed")) {
    await signOut({ callbackUrl: "/login" })
    return Promise.reject(new Error("Session expired"))
  }

  const token = (session)?.accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  
  return config
})

axiosClient.interceptors.response.use(
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
      } catch { }

      await signOut({ callbackUrl: "/login" });
    }

    return Promise.reject(error);
  }
);



const publicRoutes = ["/auth/register", "/login", "/", "/auth/reset", "/auth/forgot-password"]

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = error.config?.url ?? ""
    const isPublicRoute = publicRoutes.some((route) => requestUrl.includes(route))
    const status = error.response?.status

    if (status === 401 && !isPublicRoute) {
      if (typeof window !== "undefined") {
        localStorage.clear()
        sessionStorage.clear()
        document.cookie.split(";").forEach((cookie) => {
          const name = cookie.split("=")[0].trim()
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
        })
      }
      await signOut({ callbackUrl: "/login" })
    }

    return Promise.reject(error)
  }
)

export default axiosClient;