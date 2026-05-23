function AboutSection() {
  return (
    <section id="sobre-mi" className="border-y border-white/5 bg-white/[0.018] py-12 sm:py-16 lg:py-20" aria-labelledby="sobre-mi-title">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1fr_0.95fr] md:items-start lg:gap-10">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 sm:text-sm">Sobre mi</p>
            <h2 id="sobre-mi-title" className="mt-3 text-2xl font-semibold text-zinc-100 sm:text-3xl lg:text-4xl">Liameromero</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:mt-6 sm:text-lg lg:text-xl">
              Desarrollador de software especializado en aplicaciones web Full Stack con Angular, Spring Boot y MySQL.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg lg:text-xl">
              Cuento con el titulo de Tecnico Superior en Programacion de la Universidad Tecnologica Nacional y estudio Ingles desde marzo de 2022 en el Instituto Forget Me Not.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg lg:text-xl">
              Actualmente tengo 21 anos y resido en Mar del Plata, Buenos Aires, Argentina.
            </p>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6 md:mt-10 lg:mt-14 lg:p-7" aria-label="Formacion academica">
            <h3 className="text-xl font-medium leading-snug text-zinc-100 sm:text-2xl lg:text-3xl">Tecnico Superior en Programacion</h3>
            <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg lg:text-xl">
              Titulo de Tecnico Superior en Programacion de la Universidad Tecnologica Nacional.
            </p>
            <p className="mt-6 text-sm text-zinc-500">- Graduado el 22 de febrero de 2024</p>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
