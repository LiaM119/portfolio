import type { Profile, Skill } from '../../types/supabase'

type HeroProps = {
  profile: Profile | null
  skills: Skill[]
}

function Hero({ profile, skills }: HeroProps) {
  const techStack = skills.slice(0, 8)
  const emailHref = profile?.email ? `mailto:${profile.email}` : '#sobre-mi'

  return (
    <section className="px-1 pb-12 pt-12 text-center sm:px-2 sm:pb-16 sm:pt-16 md:pb-20 md:pt-20" aria-labelledby="hero-title">
      <h1 id="hero-title" className="text-balance text-4xl font-semibold leading-tight text-zinc-100 sm:text-5xl md:text-6xl lg:text-7xl">
        {profile?.role_title ?? 'Software Developer'}
        <span className="mt-2 block sm:mt-3">{profile?.full_name ?? 'Liameromero'}</span>
      </h1>
      <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-300 sm:mt-6 sm:text-lg lg:text-xl">{profile?.headline ?? 'Full Stack Angular & Spring Boot'}</p>

      <div className="mx-auto mt-7 flex max-w-sm flex-col justify-center gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap" aria-label="Acciones principales">
        {profile?.linkedin_url && (
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-[#0A66C2] bg-[#0A66C2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0857a5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e] sm:min-h-0 sm:min-w-36 sm:w-auto"
          >
            Linkedin -&gt;
          </a>
        )}
        {profile?.github_url && (
          <a
            href={profile.github_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e] sm:min-h-0 sm:min-w-36 sm:w-auto"
          >
            Github -&gt;
          </a>
        )}
        <a
          href={profile?.resume_url ?? emailHref}
          target={profile?.resume_url ? '_blank' : undefined}
          rel={profile?.resume_url ? 'noreferrer' : undefined}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e] sm:min-h-0 sm:min-w-36 sm:w-auto"
        >
          {profile?.resume_url ? 'Descargar CV' : 'Contactar'}
        </a>
      </div>

      <ul className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-x-3 gap-y-2 sm:mt-9 sm:gap-x-4 sm:gap-y-3" aria-label="Tecnologias principales">
        {techStack.map((tech) => (
          <li key={tech.id} className="text-xs font-medium text-zinc-400 sm:text-sm">
            {tech.name}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Hero
