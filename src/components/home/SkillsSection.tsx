const skills = [
  'Angular',
  'TypeScript',
  'HTML',
  'CSS',
  'Java',
  'Spring',
  'Spring Boot',
  'Spring Security',
  'MySQL',
  'Git',
  'Tailwind CSS',
  'Postman',
]

function SkillsSection() {
  return (
    <section id="habilidades" className="pb-12 pt-8" aria-labelledby="skills-title">
      <p className="text-sm uppercase tracking-[0.16em] text-zinc-500">Skills</p>
      <h2 id="skills-title" className="sr-only">
        Skills
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill) => (
          <li key={skill} className="rounded-xl border border-white/10 bg-white/[0.025] px-5 py-6 text-center text-2xl text-zinc-200">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default SkillsSection
