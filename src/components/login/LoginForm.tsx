"use client";
import axiosClient from '@/lib/axios';
import { useRouter } from "next/navigation";
import React, { useState } from 'react'
import { toast } from 'sonner';
import Cookies from 'js-cookie'; 

const LoginForm = () => {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);

        const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
        const email = (data.email ?? "").trim();
        const password = (data.password ?? "").trim();

        if (!email) return toast.error("Enter your email");
        if (!password) return toast.error("Enter your password");

        try {
            await axiosClient.post("/auth/login", { email, password });

            // ✅ cookie ligera para el middleware — no contiene datos sensibles
            Cookies.set("isAuthenticated", "true", {
                expires: 7,
                sameSite: "lax",
                secure: true,
            });

            router.replace("/dashboard");
        } catch {
            toast.error("Ocurrió un error inesperado. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-green-800 text-[11px] font-semibold tracking-[0.08em] uppercase mb-2"
                    >
                        Correo electrónico
                    </label>
                    <div className="relative">
                        <span
                            className="absolute text-green-800 left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        >
                            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </span>
                        <input
                            id="email"
                            type="email"
                            placeholder="usuario@arrozzulia.com"
                            required
                            name='email'
                            autoComplete="email"
                            className="w-full h-13 text-black focus:shadow focus:shadow-green-600 pl-11 pr-12 rounded-xl text-sm bg-white outline-none transition-all border placeholder:text-gray-300"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="password"
                        className="block text-[11px] text-green-800 font-semibold tracking-[0.08em] uppercase mb-2"

                    >
                        Contraseña
                    </label>
                    <div className="relative">
                        <span
                            className="absolute text-green-800 left-4 top-1/2 -translate-y-1/2 pointer-events-none"

                        >
                            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </span>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            name='password'
                            required
                            autoComplete="current-password"
                            className="w-full h-13 text-black focus:shadow focus:shadow-green-600 pl-11 pr-12 rounded-xl text-sm bg-white outline-none transition-all border placeholder:text-gray-300"

                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80"
                            style={{ color: "#4a6b52" }}
                        >
                            {showPassword ? (
                                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>


                {/* Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-13 flex items-center justify-center gap-2.5 rounded-xl text-white text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-px active:translate-y-0"
                    style={{
                        background: "linear-gradient(135deg, #166534 0%, #1e7a3e 100%)",
                        boxShadow: "0 4px 20px rgba(22,101,52,0.35)",
                    }}
                    onMouseEnter={(e) => {
                        if (!isLoading)
                            e.currentTarget.style.boxShadow = "0 8px 28px rgba(22,101,52,0.45)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 4px 20px rgba(22,101,52,0.35)";
                    }}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Verificando...
                        </>
                    ) : (
                        "Iniciar sesión"
                    )}
                </button>
            </form>

        </div>
    )
}

export default LoginForm