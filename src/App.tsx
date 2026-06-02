import { useEffect, useState } from 'react'
import AboutSection from './components/home/AboutSection'
import CertificationsSection from './components/home/CertificationsSection'
import Hero from './components/home/Hero'
import Navbar from './components/home/Navbar'
import ProjectsSection from './components/home/ProjectsSection'
import SkillsSection from './components/home/SkillsSection'
import { supabase } from './lib/supabase'

type SupabaseCheckStatus =
  | { state: 'loading' }
  | { state: 'success'; count: number }
  | { state: 'error'; message: string }

function App() {
  const [supabaseCheck, setSupabaseCheck] = useState<SupabaseCheckStatus>({ state: 'loading' })

  useEffect(() => {
    let isCurrent = true

    async function checkSupabaseConnection() {
      const { data, error } = await supabase.from('HTML').select('*').limit(5)

      if (!isCurrent) {
        return
      }

      if (error) {
        setSupabaseCheck({ state: 'error', message: error.message })
        return
      }

      setSupabaseCheck({ state: 'success', count: data.length })
    }

    checkSupabaseConnection()

    return () => {
      isCurrent = false
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0d0f] text-zinc-200">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(1200px_680px_at_55%_-8%,rgba(245,245,245,0.05),transparent_68%),repeating-linear-gradient(90deg,rgba(255,255,255,0.018)_0px,rgba(255,255,255,0.018)_40px,transparent_40px,transparent_92px),linear-gradient(180deg,#0b0c0e_0%,#090a0c_100%)]"
        aria-hidden="true"
      />

      <Navbar />

      <main id="inicio">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
          <Hero />
          <ProjectsSection />
        </div>

        <AboutSection />

        <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
          <CertificationsSection />
          <SkillsSection />
        </div>
      </main>

      <div className="fixed bottom-4 right-4 rounded-full border border-white/10 bg-zinc-950/80 px-4 py-2 text-xs text-zinc-300 shadow-xl backdrop-blur">
        {supabaseCheck.state === 'loading' && 'Checking Supabase...'}
        {supabaseCheck.state === 'success' && `Supabase connected: ${supabaseCheck.count} HTML rows read`}
        {supabaseCheck.state === 'error' && `Supabase error: ${supabaseCheck.message}`}
      </div>
    </div>
  )
}

export default App
