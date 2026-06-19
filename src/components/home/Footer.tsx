import type { Profile } from '../../types/supabase'

type FooterProps = {
  profile: Profile | null
}

function Footer({ profile }: FooterProps) {
  const displayName = profile?.full_name ?? 'Liameromero'

  return (
    <footer className="border-t border-white/5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 text-sm text-zinc-400" aria-label="Pie de pagina">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>&copy; {new Date().getFullYear()} {displayName}. Portfolio.</p>
        <nav aria-label="Enlaces del pie de pagina">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            <li>
              <a href="#inicio" className="inline-flex min-h-11 items-center rounded-full transition hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e]">
                Inicio
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
