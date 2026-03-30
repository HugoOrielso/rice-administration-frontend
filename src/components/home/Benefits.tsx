export function BenefitsSection() {
  return (
    <section id="beneficios" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-700">
            ¿Por qué elegirnos?
          </span>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Un producto pensado para vender y satisfacer
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'Selección experta',
              text: 'Granos seleccionados para garantizar mejor apariencia, cocción uniforme y excelente presentación.',
            },
            {
              title: 'Calidad confiable',
              text: 'Procesos orientados a mantener estabilidad en cada empaque y responder a estándares de consumo.',
            },
            {
              title: 'Rendimiento en cocina',
              text: 'Ideal para hogares, restaurantes, tiendas y distribuidores que necesitan buen desempeño.',
            },
            {
              title: 'Marca con presencia',
              text: 'Empaques llamativos y una identidad visual fuerte para destacar mejor el producto en venta.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-7 shadow-sm"
            >
              <h3 className="text-xl font-extrabold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

