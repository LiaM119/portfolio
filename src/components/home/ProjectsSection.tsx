import heroImage from '../../assets/hero.png'
import type { ProjectWithTech } from '../../lib/portfolioData'

const tabs = ['Todos', 'Full Stack', 'Frontend', 'Backend']

type ProjectsSectionProps = {
  projects: ProjectWithTech[]
}

function ProjectsSection({ projects }: ProjectsSectionProps) {
  const featuredProject = projects.find((project) => project.is_featured) ?? projects[0]

  if (!featuredProject) {
    return null
  }

  return (
    <section id="proyectos" className="py-8 text-center sm:py-10 lg:text-left" aria-labelledby="proyectos-title">
      <p className="text-xs uppercase tracking-[0.16em] text-zinc-400 sm:text-sm">Proyectos</p>
      <h2 id="proyectos-title" className="mt-3 text-2xl font-semibold text-zinc-100 sm:text-3xl lg:text-4xl">
        Mis proyectos destacados
      </h2>

      <div className="mx-auto mt-5 grid w-full grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.08] p-1 sm:inline-grid sm:w-auto sm:grid-cols-4 sm:rounded-full lg:mx-0" aria-label="Categorias de proyectos">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            aria-pressed={index === 0}
            className={`min-h-11 rounded-full px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e] sm:px-4 ${
              index === 0 ? 'bg-white/[0.14] text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <article className="mt-8 grid gap-8 md:gap-10 lg:mt-10 lg:grid-cols-[0.95fr_1.15fr] lg:items-center" aria-label={`Proyecto principal ${featuredProject.title}`}>
        <div className="lg:pt-8">
          <p className="text-xs uppercase tracking-[0.16em] text-zinc-400 sm:text-sm">Fullstack</p>
          <h3 className="mt-3 text-2xl font-medium text-zinc-100 sm:text-3xl lg:text-4xl">{featuredProject.title}</h3>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg lg:mx-0 lg:text-xl">
            {featuredProject.summary}
          </p>
          {featuredProject.description && <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg lg:mx-0 lg:text-xl">{featuredProject.description}</p>}

          <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
            <span className="rounded-full border border-white/20 bg-white/[0.09] px-3 py-1 text-sm text-zinc-200">Frontend</span>
            <span className="rounded-full border border-white/20 bg-white/[0.09] px-3 py-1 text-sm text-zinc-200">Backend</span>
          </div>

          <ul className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
            {featuredProject.tech.map((item) => (
              <li key={item.id} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400 sm:text-sm">
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl shadow-black/45 sm:p-3">
          <img src={featuredProject.image_url ?? heroImage} alt={`Vista previa del proyecto ${featuredProject.title}`} width="343" height="361" loading="lazy" decoding="async" className="aspect-[16/10] w-full rounded-xl object-contain" />
        </div>
      </article>
    </section>
  )
}

export default ProjectsSection
