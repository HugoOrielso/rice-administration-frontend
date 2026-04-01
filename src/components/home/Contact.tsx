export function CTASection() {
  const phone = "573138557993";
  const message = encodeURIComponent(
    "Hola, quiero información sobre el Arroz Zulia 👋"
  );

  return (
    <section id="contacto" className="bg-emerald-800 py-20">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-yellow-300">
          Contáctanos
        </span>
        <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
          Lleva Arroz Zulia a tu negocio o a tu hogar
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-emerald-50">
          Estamos listos para atender pedidos, resolver dudas y brindarte información sobre nuestras presentaciones y disponibilidad.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={`https://wa.me/${phone}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-yellow-400 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-yellow-300"
          >
            Pedir por WhatsApp
          </a>

          <a
            href="mailto:andinagroup.comercial@gmail.com"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Escribir al correo
          </a>
        </div>
      </div>
    </section>
  );
}