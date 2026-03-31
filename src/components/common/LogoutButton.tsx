"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const toastId = toast.loading("Cerrando sesión...");

    try {
      const res = await signOut({
        redirect: false,
        redirectTo: "/login",
      });

      toast.success("Sesión cerrada correctamente.", { id: toastId });
      router.replace(res.url || "/login");
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