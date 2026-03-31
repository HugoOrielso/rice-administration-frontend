import axios from "axios"
import { getSession, signOut } from "next-auth/react"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

// Request: adjuntar accessToken a cada petición
api.interceptors.request.use(async (config) => {
  const session = await getSession()
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }
  return config
})

// Response: si el back responde 401 → logout completo
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const session = await getSession()

      // Invalidar token en el backend
      if (session?.refreshToken) {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
            {},
            { headers: { "x-refresh-token": session.refreshToken } }
          )
        } catch {
          // Si falla el backend igual limpiamos local
        }
      }

      // Cerrar sesión de NextAuth
      await signOut({ callbackUrl: "/login" })
    }

    return Promise.reject(error)
  }
)

export default api