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
      className="relative overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-800 to-lime-700"
    >
      {/* efecto luz */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,white,transparent_35%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        {/* TEXTO */}
        <div>
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-medium text-white/90">
            Seleccionado por expertos arroceros del Norte de Santander
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
            El arroz que acompaña cada comida con{" "}
            <span className="text-(--color-brand-orange)">
              calidad y sabor
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-emerald-50 md:text-lg">
            En Arroz Zulia trabajamos para ofrecer un producto confiable, bien
            seleccionado y pensado para hogares, negocios y distribuidores que
            buscan rendimiento y excelente presentación.
          </p>

          {/* BOTONES */}
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#productos"
              className="rounded-full bg-(--color-brand-orange) px-6 py-3 text-sm font-bold text-white transition hover:bg-(--color-brand-orange-dark)"
            >
              Conocer productos
            </a>

            <a
              href="#contacto"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Solicitar pedido
            </a>
          </div>

          {/* BENEFICIOS */}
          <div className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
            {heroHighlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm font-semibold text-white backdrop-blur-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* IMAGEN */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative rounded-4xl bg-white/10 p-4 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm">
            
            {/* Badge */}
            <div className="absolute -left-6 top-4 z-10 rounded-2xl bg-(--color-brand-orange) px-4 py-2 text-sm font-extrabold text-white shadow-lg">
              Calidad premium
            </div>

            {/* Contenedor correcto para next/image */}
            <div className="relative h-105 w-75 sm:h-115 sm:w-85">
              <Image
                src="/assets/product-1.png"
                alt="Producto Arroz Zulia"
                fill
                priority
                sizes="(max-width: 640px) 300px, 340px"
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}