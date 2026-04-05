// components/SessionInitializer.tsx
"use client";

import { useSessionStore } from "@/store/sessionStore";
import { useEffect } from "react";

export default function SessionInitializer() {
  const fetchSession = useSessionStore((s) => s.fetchSession);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return null;
}