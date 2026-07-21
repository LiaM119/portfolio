import type { Profile } from '../../types/supabase'

type AboutSectionProps = {
  profile: Profile | null
}

function AboutSection({ profile }: AboutSectionProps) {
  const name = profile ? profile.full_name : 'About'
  const summary = profile ? profile.summary : 'Profile summary will appear here when published.'

  return (
    <section id="sobre-mi" data-scroll-reveal className="border-y border-white/5 bg-white/[0.018] py-12 sm:py-16 lg:py-20" aria-labelledby="sobre-mi-title">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[1fr_0.95fr] md:items-start lg:gap-10">
          <div data-scroll-reveal>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400 sm:text-sm">Sobre mi</p>
            <h2 id="sobre-mi-title" className="mt-3 text-2xl font-semibold text-zinc-100 sm:text-3xl lg:text-4xl">{name}</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:mt-6 sm:text-lg lg:text-xl">
              {summary}
            </p>
            {profile?.location && <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg lg:text-xl">{profile.location}</p>}
          </div>

          {profile?.email && (
            <aside data-scroll-reveal className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6 md:mt-10 lg:mt-14 lg:p-7" aria-label="Contacto">
              <h3 className="text-xl font-medium leading-snug text-zinc-100 sm:text-2xl lg:text-3xl">Contacto</h3>
              <a className="mt-4 inline-flex text-base leading-relaxed text-zinc-300 transition hover:text-zinc-100 sm:text-lg lg:text-xl" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}

export default AboutSection
