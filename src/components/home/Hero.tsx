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
      className="relative  scroll-mt-24  overflow-hidden bg-linear-to-br from-emerald-950 via-emerald-800 to-lime-700"
    >
      {/* efecto luz */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,white,transparent_35%)]" />
      </div>

      <div className="relative fade-in mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
        {/* TEXTO */}
        <div>

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
        <div className="flex justify-center flex-col items-center gap-2 lg:justify-end fade-in">
          <div className="relative rounded-4xl bg-white/10 p-4 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm max-w-100">

            {/* Contenedor correcto para next/image */}
            <div className="relative h-105 w-full sm:h-115 sm:w-92">
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
          <div className="relative rounded-4xl bg-white/10 p-4 shadow-2xl ring-1 ring-white/20 backdrop-blur-sm max-w-100">
            <p className="text-(--color-brand-orange)">VENTAS PARA SUDAMÉRICA Y CENTRO AMERICA</p>
          </div>
        </div>
      </div>
    </section>
  );
}