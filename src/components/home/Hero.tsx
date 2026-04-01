"use client";

import Image from "next/image";

const heroHighlights: string[] = [
  "Calidad seleccionada",
  "Excelente rendimiento",
  "Presentaciones comerciales",
];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative scroll-mt-24 overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-800 to-lime-700"
    >
      {/* ✨ Efecto luz */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,white,transparent_35%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        
        {/* 🟢 TEXTO */}
        <div className="text-center lg:text-left">
          <h1 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            El arroz que acompaña cada comida con{" "}
            <span className="text-(--color-brand-orange)">
              calidad y sabor
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base md:text-lg">
            En Arroz Zulia trabajamos para ofrecer un producto confiable, bien
            seleccionado y pensado para hogares, negocios y distribuidores que
            buscan rendimiento y excelente presentación.
          </p>

          {/* 🔘 BOTONES */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
            <a
              href="#productos"
              className="rounded-full bg-(--color-brand-orange) px-5 py-2.5 text-sm font-bold text-white transition hover:bg-(--color-brand-orange-dark)"
            >
              Conocer productos
            </a>

            <a
              href="#contacto"
              className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Solicitar pedido
            </a>
          </div>

          {/* ⭐ BENEFICIOS */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-xl mx-auto lg:mx-0">
            {heroHighlights.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm text-center"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* 🟢 IMAGEN */}
        <div className="flex flex-col items-center gap-4 lg:items-end">

          {/* CARD PRODUCTO */}
          <div className="w-full max-w-65 sm:max-w-75 lg:max-w-95 rounded-3xl bg-white/10 p-3 sm:p-4 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm">
            
            <div className="relative w-full aspect-3/4">
              <Image
                src="/assets/product-1.png"
                alt="Producto Arroz Zulia"
                fill
                priority
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 380px"
                className="object-contain drop-shadow-2xl"
              />
            </div>

          </div>

          {/* TEXTO VENTAS */}
          <div className="w-full max-w-65 sm:max-w-75 lg:max-w-95 rounded-full bg-white/10 px-4 py-2.5 shadow-xl ring-1 ring-white/20 backdrop-blur-sm text-center">
            <p className="text-xs sm:text-sm font-semibold text-(--color-brand-orange)">
              VENTAS PARA SUDAMÉRICA Y CENTRO AMÉRICA
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}