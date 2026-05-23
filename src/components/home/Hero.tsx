const techStack = ['Angular', 'TypeScript', 'Spring', 'Java', 'HTML', 'CSS', 'MySQL', 'Git']

function Hero() {
  return (
    <section className="px-2 pb-20 pt-20 text-center" aria-labelledby="hero-title">
      <h1 id="hero-title" className="text-balance text-5xl font-semibold leading-tight text-zinc-100 sm:text-6xl lg:text-7xl">
        Software Developer
        <span className="mt-3 block">Liameromero</span>
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-xl text-zinc-300">Full Stack Angular &amp; Spring Boot</p>

      <div className="mt-8 flex flex-wrap justify-center gap-3" aria-label="Acciones principales">
        <a
          href="https://www.linkedin.com/in/liamromero"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-w-36 items-center justify-center rounded-full border border-[#0A66C2] bg-[#0A66C2] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0857a5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e]"
        >
          Linkedin -&gt;
        </a>
        <a
          href="https://github.com/LiaM119"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-w-36 items-center justify-center rounded-full border border-white bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e]"
        >
          Github -&gt;
        </a>
        <a
          href="mailto:liamnahuelromero.t@gmail.com"
          className="inline-flex min-w-36 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e]"
        >
          Descargar CV
        </a>
      </div>

      <ul className="mx-auto mt-9 flex max-w-2xl flex-wrap justify-center gap-x-4 gap-y-3" aria-label="Tecnologias principales">
        {techStack.map((tech) => (
          <li key={tech} className="text-sm font-medium text-zinc-400">
            {tech}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Hero
