import type { Skill } from '../../types/supabase'

type SkillsSectionProps = {
  skills: Skill[]
}

function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="habilidades" className="pb-10 pt-6 sm:pb-12 sm:pt-8" aria-labelledby="skills-title">
      <p className="text-xs uppercase tracking-[0.16em] text-zinc-500 sm:text-sm">Skills</p>
      <h2 id="skills-title" className="sr-only">
        Skills
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {skills.map((skill) => (
          <li key={skill.id} className="flex min-h-16 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] px-4 py-4 text-center text-base text-zinc-200 sm:min-h-20 sm:px-5 sm:text-lg lg:py-6 lg:text-xl">
            {skill.name}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SkillsSection
