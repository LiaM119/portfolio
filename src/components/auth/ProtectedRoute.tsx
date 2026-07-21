import { useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabaseClient } from '../../lib/supabase'

type ProtectedRouteProps = {
  children: ReactNode
  onNavigate: (path: string) => void
}

type AccessState =
  | { status: 'checking' }
  | { status: 'allowed' }
  | { status: 'blocked'; message: string }

function getAdminEmail() {
  return import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase() ?? ''
}

export default function ProtectedRoute({ children, onNavigate }: ProtectedRouteProps) {
  const [accessState, setAccessState] = useState<AccessState>({ status: 'checking' })

  useEffect(() => {
    let isCurrent = true
    let isBlockingInvalidSession = false
    const supabase = getSupabaseClient()

    async function authorizeSession(session: Session | null) {
      try {
        if (!isCurrent) {
          return
        }

        if (!session) {
          if (!isBlockingInvalidSession) {
            onNavigate('/login')
          }
          return
        }

        const adminEmail = getAdminEmail()
        const userEmail = session.user.email?.trim().toLowerCase()

        if (!adminEmail) {
          isBlockingInvalidSession = true
          await supabase.auth.signOut()

          if (isCurrent) {
            setAccessState({ status: 'blocked', message: 'Admin login is not configured yet. Missing VITE_ADMIN_EMAIL.' })
          }

          return
        }

        if (userEmail !== adminEmail) {
          isBlockingInvalidSession = true
          await supabase.auth.signOut()

          if (isCurrent) {
            setAccessState({ status: 'blocked', message: 'This account is signed in, but it is not allowed to open the admin area.' })
          }

          return
        }

        setAccessState({ status: 'allowed' })
      } catch {
        if (isCurrent) {
          setAccessState({ status: 'blocked', message: 'Connection problem while checking your session. Please try again.' })
        }
      }
    }

    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (!isCurrent) {
          return
        }

        if (error) {
          setAccessState({ status: 'blocked', message: 'We could not check your session. Please try signing in again.' })
          return
        }

        await authorizeSession(data.session)
      } catch {
        if (isCurrent) {
          setAccessState({ status: 'blocked', message: 'Connection problem while checking your session. Please try again.' })
        }
      }
    }

    checkSession()
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      void authorizeSession(session)
    })

    return () => {
      isCurrent = false
      authListener.subscription.unsubscribe()
    }
  }, [onNavigate])

  if (accessState.status === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0c0d0f] px-4 text-zinc-200">
        <p className="rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-4 text-sm text-zinc-300">Checking your admin session...</p>
      </main>
    )
  }

  if (accessState.status === 'blocked') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0c0d0f] px-4 text-zinc-200">
        <section className="w-full max-w-md rounded-3xl border border-red-400/20 bg-red-950/20 p-6 shadow-2xl shadow-black/30">
          <p className="text-xs uppercase tracking-[0.16em] text-red-300/80">Admin blocked</p>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-100">You cannot access this area.</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-300">{accessState.message}</p>
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="mt-6 min-h-11 rounded-full bg-zinc-100 px-5 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c0e]"
          >
            Back to login
          </button>
        </section>
      </main>
    )
  }

  return children
}
