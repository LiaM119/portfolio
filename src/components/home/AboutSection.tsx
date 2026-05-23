function AboutSection() {
  return (
    <section id="sobre-mi" className="border-y border-white/5 bg-white/[0.018] py-16" aria-labelledby="sobre-mi-title">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">Sobre mi</p>
            <h2 id="sobre-mi-title" className="mt-3 text-5xl font-semibold text-zinc-100">Liameromero</h2>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-zinc-300">
              Desarrollador de software especializado en aplicaciones web Full Stack con Angular, Spring Boot y MySQL.
            </p>
            <p className="mt-4 max-w-xl text-xl leading-relaxed text-zinc-300">
              Cuento con el titulo de Tecnico Superior en Programacion de la Universidad Tecnologica Nacional y estudio Ingles desde marzo de 2022 en el Instituto Forget Me Not.
            </p>
            <p className="mt-4 max-w-xl text-xl leading-relaxed text-zinc-300">
              Actualmente tengo 21 anos y resido en Mar del Plata, Buenos Aires, Argentina.
            </p>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 lg:mt-14" aria-label="Formacion academica">
            <h3 className="text-3xl font-medium text-zinc-100">Tecnico Superior en Programacion</h3>
            <p className="mt-4 text-xl leading-relaxed text-zinc-300">
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
