"use client";

import axiosClient from "@/lib/axios";
import { useSessionStore } from "@/store/sessionStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const clearSession = useSessionStore((s) => s.clearSession);
  const router = useRouter();

  const handleLogout = async () => {
    await axiosClient.post("/auth/logout");
    clearSession();
    router.push("/login");
  };

  return (
    <button onClick={handleLogout} className="text-red-500 cursor-pointer flex items-center text-sm gap-2">
      <LogOut className="h-4 w-4"/> <span>Cerrar sesión</span>
    </button>
  );
}