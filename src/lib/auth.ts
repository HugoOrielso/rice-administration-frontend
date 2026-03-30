import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

type LoginResponse = {
    ok: boolean;
    message?: string;
    data?: {
        user: {
            id: string;
            name: string;
            email: string;
            role?: string;
            isActive?: boolean;
        };
        accessToken: string;
        refreshToken: string;
    };
};

type RefreshResponse = {
    ok: boolean;
    message?: string;
    data?: {
        accessToken: string;
        refreshToken: string;
    };
};

export const { handlers, auth, signIn, signOut } = NextAuth({
    pages: { signIn: "/" },
    session: { strategy: "jwt" },
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

                console.log(email, password);

                try {
                    const res = await fetch(`${API_URL}/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    console.log("Login response status:", res.status);
                    console.log(res)

                    if (!res.ok) return null;

                    const result = (await res.json()) as LoginResponse;
                    const payload = result?.data;

                    if (
                        !payload?.user?.id ||
                        !payload?.accessToken ||
                        !payload?.refreshToken
                    ) {
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
    callbacks: {
        async jwt({ token, user }) {
            const API_URL = process.env.API_URL;

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

            if (
                token.accessTokenExpires &&
                Date.now() < Number(token.accessTokenExpires)
            ) {
                return token;
            }

            if (!API_URL || !token.refreshToken) {
                return {
                    ...token,
                    error: "RefreshFailed:missing_config_or_token",
                };
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
                    return {
                        ...token,
                        error: `RefreshFailed:${res.status}`,
                    };
                }

                const result = (await res.json()) as RefreshResponse;
                const refreshed = result?.data;

                if (!refreshed?.accessToken || !refreshed?.refreshToken) {
                    return {
                        ...token,
                        error: "RefreshFailed:invalid_payload",
                    };
                }

                return {
                    ...token,
                    accessToken: refreshed.accessToken,
                    refreshToken: refreshed.refreshToken,
                    accessTokenExpires: Date.now() + 15 * 60 * 1000,
                    error: undefined,
                };
            } catch {
                return {
                    ...token,
                    error: "RefreshFailed:network",
                };
            }
        },

        async session({ session, token }) {
            if (session.user && token.user) {
                session.user.id = token.user.id as string;
                session.user.name = token.user.name as string;
                session.user.email = token.user.email as string;
                session.user.role = token.user.role as string;
            }

            session.error = token.error as string | undefined;

            // ✅ Si el refresh falló, limpiar tokens para no exponerlos
            if (token.error?.startsWith("RefreshFailed")) {
                session.accessToken = undefined;
                session.refreshToken = undefined;
            } else {
                session.accessToken = token.accessToken as string | undefined;
                session.refreshToken = token.refreshToken as string | undefined;
            }

            return session;
        },
    },
});