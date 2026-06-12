import type { ReactNode } from 'react'

type AdminLayoutProps = {
  children: ReactNode
  errorMessage: string
  isSigningOut: boolean
  onLogout: () => void
}

export default function AdminLayout({ children, errorMessage, isSigningOut, onLogout }: AdminLayoutProps) {
  return (
    <main className="min-h-screen bg-[#0c0d0f] px-4 py-8 text-zinc-200 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Admin area</p>
              <h1 className="mt-3 text-3xl font-semibold text-zinc-100">Portfolio admin</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">Edit the content used by the public portfolio. Keep it simple, save small changes, then check the home page.</p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              disabled={isSigningOut}
              className="rounded-full bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? 'Signing out...' : 'Logout'}
            </button>
          </div>

          {errorMessage && <p className="mt-6 rounded-2xl border border-red-400/20 bg-red-950/20 px-4 py-3 text-sm leading-6 text-red-100">{errorMessage}</p>}
        </section>

        {children}
      </div>
    </main>
  )
}
