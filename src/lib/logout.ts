import axiosClient from "./axios";

// lib/logout.ts
export async function forceLogout() {
  try {
    await axiosClient.post("/auth/logout");
  } catch {
    // igual limpiamos aunque falle
  } finally {
    window.location.href = "/login";
  }
}