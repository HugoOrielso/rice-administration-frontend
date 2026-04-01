import Image from "next/image";

const navItems: { label: string; href: string }[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Productos", href: "#productos" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "Nosotros", href: "#nosotros" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-(--color-brand-soft) bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#inicio" className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0 sm:h-14 sm:w-14">
            <Image
              src="/assets/logo.png"
              alt="Logo Andina Group"
              fill
              priority
              sizes="56px"
              className="object-contain"
            />
          </div>

          <div>
            <p className="text-lg font-extrabold tracking-tight text-(--color-brand-green)">
              Andina group & Capital S.A.S
            </p>
            <p className="text-sm text-slate-500">
              Tradición, calidad y confianza
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-(--color-brand-orange)"
            >
              {item.label}
            </a>
          ))}

          <a  
            href="#contacto"
            className="rounded-full bg-(--color-brand-orange) px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-(--color-brand-orange-dark)"
          >
            Cotizar ahora
          </a>
          <a  
            href="/login"
            className="rounded-full bg-(--color-brand-orange) px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-(--color-brand-orange-dark)"
          >
            Iniciar sesión
          </a>
        </nav>
      </div>
    </header>
  );
}