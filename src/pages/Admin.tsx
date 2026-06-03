import { useState } from 'react'
import { getSupabaseClient } from '../lib/supabase'

type AdminProps = {
  onNavigate: (path: string) => void
}

export default function Admin({ onNavigate }: AdminProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleLogout() {
    setIsSigningOut(true)
    setErrorMessage('')

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        setErrorMessage('We could not sign you out. Please try again.')
        return
      }

      onNavigate('/login')
    } catch {
      setErrorMessage('Connection problem while signing out. Please try again.')
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0c0d0f] px-4 py-12 text-zinc-200 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Admin area</p>
            <h1 className="mt-3 text-3xl font-semibold text-zinc-100">Portfolio admin</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300">You are signed in with the allowed admin account.</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isSigningOut}
            className="rounded-full bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? 'Signing out...' : 'Logout'}
          </button>
        </div>

        {errorMessage && <p className="mt-6 rounded-2xl border border-red-400/20 bg-red-950/20 px-4 py-3 text-sm leading-6 text-red-100">{errorMessage}</p>}
      </section>
    </main>
  )
}
