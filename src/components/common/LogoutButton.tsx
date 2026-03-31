"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition font-medium"
    >
      <LogOut className="w-4 h-4" />
      Cerrar sesión
    </button>
  );
}