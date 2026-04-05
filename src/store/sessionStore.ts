// stores/sessionStore.ts
import axiosClient from "@/lib/axios";
import { create } from "zustand";

export type UserRole = "ADMIN" | "OPERATOR";

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

interface SessionStore {
  user: SessionUser | null;
  isLoading: boolean;
  fetchSession: () => Promise<void>;
  clearSession: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  user: null,
  isLoading: true,

  fetchSession: async () => {
    try {
      const res = await axiosClient.get("/auth/me");
      set({ user: res.data.data.user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  clearSession: () => set({ user: null, isLoading: false }),
}));