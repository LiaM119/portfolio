import type { Profile } from '../../types/supabase'

const navLinks = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Sobre mi', href: '#sobre-mi' },
  { label: 'Certificaciones', href: '#certificaciones' },
  { label: 'Skills', href: '#habilidades' },
]

type NavbarProps = {
  profile: Profile | null
}

function Navbar({ profile }: NavbarProps) {
  const displayName = profile?.full_name ?? 'Portfolio'
  const displayRole = profile?.role_title ?? 'Content managed in Supabase'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'P'

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] px-3 py-3 backdrop-blur sm:px-4 md:flex-row md:items-center md:justify-between">
        <a href="#inicio" className="inline-flex min-h-11 min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e]" aria-label="Ir al inicio">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-base font-semibold text-zinc-100 sm:h-10 sm:w-10 sm:text-lg">
            {initials}
          </span>
          <span className="min-w-0">
            <strong className="block truncate text-base text-zinc-100">{displayName}</strong>
            <span className="block text-xs text-zinc-400">{displayRole}</span>
          </span>
        </a>

        <nav className="w-full md:w-auto" aria-label="Navegacion principal">
          <ul className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-zinc-300 sm:gap-x-4 md:justify-end">
            {navLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-11 items-center rounded-full px-2 py-1 transition hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e] sm:px-2"
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
