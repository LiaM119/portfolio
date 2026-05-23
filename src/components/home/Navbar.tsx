const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Sobre mi', href: '#sobre-mi' },
  { label: 'Certificaciones', href: '#certificaciones' },
  { label: 'Skills', href: '#habilidades' },
]

function Navbar() {
  return (
    <header className="mx-auto w-full max-w-6xl px-3 pt-3 sm:px-6 sm:pt-6 lg:px-8">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-3 backdrop-blur sm:px-4 md:flex-row md:items-center md:justify-between">
        <a href="#inicio" className="inline-flex min-w-0 items-center gap-3" aria-label="Ir al inicio">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-base font-semibold text-zinc-100 sm:h-10 sm:w-10 sm:text-lg">
            L
          </span>
          <span className="min-w-0">
            <strong className="block truncate text-base text-zinc-100">Liameromero</strong>
            <span className="block text-xs text-zinc-500">Software Developer</span>
          </span>
        </a>

        <nav className="w-full md:w-auto" aria-label="Navegacion principal">
          <ul className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-zinc-300 sm:gap-x-4 md:justify-end">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-10 items-center rounded-full px-2 py-1 transition hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e] sm:min-h-0 sm:px-1"
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
