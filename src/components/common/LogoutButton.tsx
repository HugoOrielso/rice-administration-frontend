"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function LogoutButton() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    const toastId = toast.loading("Cerrando sesión...");

    try {
      // 1. Revocar refresh token en el backend
      if (session?.refreshToken) {
        await api.post("/auth/logout", {}, {
          headers: { "x-refresh-token": session.refreshToken },
        })
      }

      // 2. Destruir sesión de NextAuth + redirigir
      await signOut({ callbackUrl: "/login" })
    } catch {
      toast.error("Error al cerrar sesión. Intenta de nuevo.", { id: toastId })
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition font-medium"
    >
      <LogOut className="w-4 h-4" />
      Cerrar sesión
    </button>
  );
}