export function AboutSection() {
  return (
    <section id="nosotros" className="py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            Nuestra marca
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Comprometidos con llevar un buen arroz a cada mesa
          </h2>
          <p className="mt-6 text-base leading-8 text-slate-600">
            Arroz Zulia representa calidad, tradición y cercanía. Nuestra propuesta está enfocada en brindar un producto que inspire confianza desde el empaque hasta el momento de servirlo.
          </p>
          <p className="mt-4 text-base leading-8 text-slate-600">
            Trabajamos para posicionar una marca sólida, con identidad regional, excelente presentación y una oferta que conecta con consumidores y canales comerciales.
          </p>
        </div>

        <div className="rounded-4xl bg-linear-to-br from-emerald-800 to-emerald-950 p-8 text-white shadow-xl">
          <h3 className="text-2xl font-black">Lo que nos distingue</h3>
          <div className="mt-6 space-y-4">
            {[
              'Producto con imagen comercial fuerte',
              'Empaque atractivo y profesional',
              'Variedad en presentaciones',
              'Enfoque en calidad y confianza',
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-white/90"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}