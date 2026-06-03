import { useEffect, useState, type FormEvent } from 'react'
import { getSupabaseClient } from '../lib/supabase'

type LoginProps = {
  onNavigate: (path: string) => void
}

function getAdminEmail() {
  return import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase() ?? ''
}

function getLoginErrorMessage(message: string) {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('invalid login credentials')) {
    return 'The email or password is not correct. Check both fields and try again.'
  }

  return 'Something went wrong while signing in. Please check your connection and try again.'
}

export default function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let isCurrent = true

    async function checkExistingSession() {
      try {
        const supabase = getSupabaseClient()
        const { data } = await supabase.auth.getSession()
        const adminEmail = getAdminEmail()
        const userEmail = data.session?.user.email?.trim().toLowerCase()

        if (!isCurrent) {
          return
        }

        if (adminEmail && userEmail === adminEmail) {
          onNavigate('/admin')
          return
        }

        if (data.session) {
          await supabase.auth.signOut()
          setErrorMessage('You were signed in, but this account is not allowed to use the admin area.')
        }
      } catch {
        if (isCurrent) {
          setErrorMessage('We could not check your current session. You can still try signing in.')
        }
      } finally {
        if (isCurrent) {
          setIsCheckingSession(false)
        }
      }
    }

    checkExistingSession()

    return () => {
      isCurrent = false
    }
  }, [onNavigate])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cleanEmail = email.trim()
    const adminEmail = getAdminEmail()

    if (!cleanEmail || !password) {
      setErrorMessage('Please enter both your email and password.')
      return
    }

    if (!adminEmail) {
      setErrorMessage('Admin login is not configured yet. Missing VITE_ADMIN_EMAIL.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })

      if (error) {
        setErrorMessage(getLoginErrorMessage(error.message))
        return
      }

      const userEmail = data.user?.email?.trim().toLowerCase()

      if (userEmail !== adminEmail) {
        await supabase.auth.signOut()
        setErrorMessage('This login worked, but this email is not allowed to use the admin area.')
        return
      }

      onNavigate('/admin')
    } catch {
      setErrorMessage('Connection problem while signing in. Please try again in a moment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0c0d0f] px-4 py-12 text-zinc-200">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.025] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">Portfolio admin</p>
        <h1 className="mt-3 text-3xl font-semibold text-zinc-100">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-300">Use the admin email and password configured in Supabase Auth.</p>

        {isCheckingSession ? (
          <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">Checking for an existing session...</p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-zinc-200">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition focus:border-zinc-300"
              />
            </label>

            <label className="block text-sm font-medium text-zinc-200">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition focus:border-zinc-300"
              />
            </label>

            {errorMessage && <p className="rounded-2xl border border-red-400/20 bg-red-950/20 px-4 py-3 text-sm leading-6 text-red-100">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        )}

        <button type="button" onClick={() => onNavigate('/')} className="mt-6 text-sm text-zinc-400 transition hover:text-zinc-100">
          Back to public portfolio
        </button>
      </section>
    </main>
  )
}
