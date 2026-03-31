"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

export default function LogoutButton() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    const toastId = toast.loading("Cerrando sesión...");

    try {
      // revocar refresh token en backend
      if (session?.refreshToken) {
        await api.post(
          "/auth/logout",
          {},
          {
            headers: {
              "x-refresh-token": session.refreshToken,
            },
          }
        );
      }

      // cerrar sesión Auth.js sin redirección automática
      const result = await signOut({
        redirect: false,
        redirectTo: "/login",
      });

      toast.success("Sesión cerrada correctamente.", { id: toastId });
      router.replace(result.url);
    } catch (error) {
      console.error(error);
      toast.error("Error al cerrar sesión. Intenta de nuevo.", { id: toastId });
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