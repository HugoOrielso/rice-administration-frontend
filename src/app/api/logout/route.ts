// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const refreshToken = req.headers.get("x-refresh-token");

  if (refreshToken) {
    await fetch(`${process.env.API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-refresh-token": refreshToken,
      },
    });
  }

  return NextResponse.json({ ok: true });
}