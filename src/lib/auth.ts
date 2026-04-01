import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: { signIn: "/login" },


  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-arrozzulia.session-token"
          : "arrozzulia.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-arrozzulia.callback-url"
          : "arrozzulia.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-arrozzulia.csrf-token"
          : "arrozzulia.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const API_URL = process.env.API_URL;
        if (!API_URL) return null;

        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "").trim();

        if (!email || !password) return null;

        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) return null;

          const result = await res.json();
          const payload = result?.data;

          if (!payload?.user?.id || !payload?.accessToken || !payload?.refreshToken) {
            return null;
          }

          return {
            id: payload.user.id,
            name: payload.user.name,
            email: payload.user.email,
            role: payload.user.role ?? "",
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
            accessTokenExpires: Date.now() + 15 * 60 * 1000,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as {
          id: string;
          name: string;
          email: string;
          role?: string;
          accessToken: string;
          refreshToken: string;
          accessTokenExpires: number;
        };

        return {
          ...token,
          user: {
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role ?? "",
          },
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          accessTokenExpires: u.accessTokenExpires,
          error: undefined,
        };
      }

      if (token.accessTokenExpires && Date.now() < Number(token.accessTokenExpires)) {
        return token;
      }

      const API_URL = process.env.API_URL;

      if (!API_URL || !token.refreshToken) {
        return { ...token, error: "RefreshFailed:missing_config_or_token" };
      }

      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-refresh-token": token.refreshToken as string,
          },
        });

        if (!res.ok) {
          return { ...token, error: `RefreshFailed:${res.status}` };
        }

        const result = await res.json();
        const refreshed = result?.data;

        if (!refreshed?.accessToken || !refreshed?.refreshToken) {
          return { ...token, error: "RefreshFailed:invalid_payload" };
        }

        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
          error: undefined,
        };
      } catch {
        return { ...token, error: "RefreshFailed:network" };
      }
    },

    async session({ session, token }) {
      if (token.user) {
        session.user.id = token.user.id as string;
        session.user.name = token.user.name as string;
        session.user.email = token.user.email as string;
        (session.user as { role?: string }).role = token.user.role as string;
      }

      session.accessToken = token.accessToken as string | undefined;
      session.refreshToken = token.refreshToken as string | undefined;
      session.error = token.error as string | undefined;

      return session;
    }
  },
});