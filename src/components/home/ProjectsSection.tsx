import heroImage from '../../assets/hero.png'

const tabs = ['Todos', 'Full Stack', 'Frontend', 'Backend']
const stack = ['Angular', 'Java', 'Spring Boot', 'Spring Security', 'MySQL']

function ProjectsSection() {
  return (
    <section id="proyectos" className="py-10" aria-labelledby="proyectos-title">
      <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">Proyectos</p>
      <h2 id="proyectos-title" className="mt-3 text-4xl font-semibold text-zinc-100">
        Mis proyectos destacados
      </h2>

      <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/[0.08] p-1" aria-label="Categorias de proyectos">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            aria-pressed={index === 0}
            className={`rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
              index === 0 ? 'bg-white/14 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <article className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center" aria-label="Proyecto principal Organizer">
        <div className="lg:pt-8">
          <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">Fullstack</p>
          <h3 className="mt-3 text-5xl font-medium text-zinc-100">Organizer</h3>
          <p className="mt-4 max-w-xl text-2xl leading-relaxed text-zinc-300">
            Organizer es una aplicacion de gestion y organizacion de tareas y notas.
          </p>
          <p className="mt-4 max-w-xl text-2xl leading-relaxed text-zinc-300">
            Te permite crear carpetas y notas personalizadas para organizarte de manera eficiente.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/20 bg-white/[0.09] px-3 py-1 text-sm text-zinc-200">Frontend</span>
            <span className="rounded-full border border-white/20 bg-white/[0.09] px-3 py-1 text-sm text-zinc-200">Backend</span>
          </div>

          <ul className="mt-5 flex flex-wrap gap-2">
            {stack.map((item) => (
              <li key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-zinc-400">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl shadow-black/45">
          <img src={heroImage} alt="Vista previa del proyecto Organizer" className="h-full w-full rounded-xl object-cover" />
        </div>
      </article>
    </section>
  )
}

export default ProjectsSection
