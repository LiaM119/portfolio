const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Sobre mi', href: '#sobre-mi' },
  { label: 'Certificaciones', href: '#certificaciones' },
  { label: 'Skills', href: '#habilidades' },
]

function Navbar() {
  return (
    <header className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 backdrop-blur md:flex-row md:items-center md:justify-between">
        <a href="#inicio" className="inline-flex items-center gap-3" aria-label="Ir al inicio">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-lg font-semibold text-zinc-100">
            L
          </span>
          <span>
            <strong className="block text-base text-zinc-100">Liameromero</strong>
            <span className="block text-xs text-zinc-500">Software Developer</span>
          </span>
        </a>

        <nav aria-label="Navegacion principal">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-300">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="transition hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
