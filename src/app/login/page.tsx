"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password: password.trim(),
        redirect: false,
      });

      if (result?.error) {
        setError("Correo o contraseña incorrectos.");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_460px]">

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-14 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #14532d 0%, #166534 55%, #0f3d1f 100%)" }}
      >
        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
          }}
        />
        {/* Radial glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 15% 85%, rgba(215,105,36,0.18) 0%, transparent 70%), radial-gradient(ellipse 45% 35% at 85% 5%, rgba(215,105,36,0.1) 0%, transparent 60%)",
          }}
        />
        {/* Decorative rings */}
        <div className="absolute -top-20 -right-24 w-80 h-80 rounded-full border border-white/[0.05] pointer-events-none" />
        <div className="absolute top-12 right-4 w-44 h-44 rounded-full border border-white/[0.05] pointer-events-none" />
        <div className="absolute -bottom-48 -left-36 w-[500px] h-[500px] rounded-full border border-white/[0.05] pointer-events-none" />

        {/* Brand logo */}
        <div className="relative z-10 flex items-center gap-4">
          <div
            className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
            style={{
              background: "#D76924",
              boxShadow: "0 4px 20px rgba(215,105,36,0.45)",
            }}
          >
            Z
          </div>
          <div>
            <p className="text-white font-bold text-[18px] leading-tight">Arroz Zulia</p>
            <p className="text-white/40 text-xs font-light tracking-wide">Andina Group · Portal Empresarial</p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-white/60 text-[11px] font-medium tracking-[0.08em] uppercase mb-8 border border-white/10"
            style={{ backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.06)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "#D76924", boxShadow: "0 0 0 3px rgba(215,105,36,0.25)" }}
            />
            Plataforma de gestión
          </div>

          <h2 className="text-white font-extrabold text-[48px] leading-[1.1] tracking-tight mb-5">
            Tradición, calidad<br />
            y{" "}
            <span style={{ color: "#D76924" }}>confianza</span>
          </h2>

          <p className="text-white/50 text-[15px] leading-relaxed max-w-sm font-light">
            Administra pedidos, distribuidores y producción
            desde un solo lugar. El norte de Santander
            en cada grano.
          </p>

          {/* Stats */}
          <div
            className="flex gap-10 mt-12 pt-10"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            {[
              { value: "25+",  label: "Años de experiencia" },
              { value: "500+", label: "Distribuidores activos" },
              { value: "100%", label: "Calidad certificada" },
            ].map((s) => (
              <div key={s.label}>
                <strong className="block text-white text-[26px] font-bold leading-tight">{s.value}</strong>
                <span className="text-white/40 text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="flex flex-col justify-center px-10 py-14 relative"
        style={{ background: "#fff7f2" }}
      >
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-none"
          style={{ background: "linear-gradient(90deg, #166534, #D76924)" }}
        />

        {/* Mobile brand */}
        <div className="flex items-center gap-3 mb-10 lg:hidden">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: "#D76924" }}
          >
            Z
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: "#14532d" }}>Arroz Zulia</p>
            <p className="text-xs text-gray-400">Andina Group</p>
          </div>
        </div>

        {/* Form header */}
        <div className="mb-9">
          <h3
            className="text-[30px] font-bold tracking-tight mb-1 leading-tight"
            style={{ color: "#14532d" }}
          >
            Bienvenido de nuevo
          </h3>
          <p className="text-sm" style={{ color: "#4a6b52" }}>
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] font-semibold tracking-[0.08em] uppercase mb-2"
              style={{ color: "#14532d" }}
            >
              Correo electrónico
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#4a6b52" }}
              >
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                placeholder="usuario@arrozzulia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full h-[52px] pl-11 pr-4 rounded-xl text-sm bg-white outline-none transition-all border placeholder:text-gray-300"
                style={{ borderColor: "rgba(22,101,52,0.18)", color: "#14532d" }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#166534";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,101,52,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(22,101,52,0.18)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-[11px] font-semibold tracking-[0.08em] uppercase mb-2"
              style={{ color: "#14532d" }}
            >
              Contraseña
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#4a6b52" }}
              >
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full h-[52px] pl-11 pr-12 rounded-xl text-sm bg-white outline-none transition-all border placeholder:text-gray-300"
                style={{ borderColor: "rgba(22,101,52,0.18)", color: "#14532d" }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#166534";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(22,101,52,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(22,101,52,0.18)";
                  e.currentTarget.style.boxShadow = "none";
                }}
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

            <a
              href="/forgot-password"
              className="block text-right text-xs font-medium mt-2 transition-colors"
              style={{ color: "#166534" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#D76924")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#166534")}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                background: "#fff0e8",
                border: "1px solid rgba(215,105,36,0.3)",
                color: "#b95517",
                animation: "shake 0.4s ease",
              }}
              role="alert"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-[52px] flex items-center justify-center gap-2.5 rounded-xl text-white text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-px active:translate-y-0"
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

        {/* Divider */}
        <div className="flex items-center gap-3 my-6 text-xs font-medium" style={{ color: "#c0cec3" }}>
          <div className="flex-1 h-px" style={{ background: "rgba(22,101,52,0.1)" }} />
          o
          <div className="flex-1 h-px" style={{ background: "rgba(22,101,52,0.1)" }} />
        </div>

        {/* Support */}
        <a
          href="mailto:soporte@arrozzulia.com"
          className="flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all border bg-white py-[14px]"
          style={{ borderColor: "rgba(22,101,52,0.14)", color: "#4a6b52" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#D76924";
            e.currentTarget.style.color = "#D76924";
            e.currentTarget.style.background = "#fff7f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(22,101,52,0.14)";
            e.currentTarget.style.color = "#4a6b52";
            e.currentTarget.style.background = "white";
          }}
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Contactar soporte
        </a>

        <p className="mt-8 text-center text-[11px] leading-relaxed" style={{ color: "#a8bab0" }}>
          © {new Date().getFullYear()} Arroz Zulia · Andina Group<br />
          Todos los derechos reservados
        </p>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25%       { transform: translateX(-5px); }
            75%       { transform: translateX(5px); }
          }
        `}</style>
      </div>
    </div>
  );
}