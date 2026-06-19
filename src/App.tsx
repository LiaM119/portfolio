import { useEffect, useState } from 'react'
import AboutSection from './components/home/AboutSection'
import CertificationsSection from './components/home/CertificationsSection'
import Footer from './components/home/Footer'
import Hero from './components/home/Hero'
import Navbar from './components/home/Navbar'
import ProjectsSection from './components/home/ProjectsSection'
import SkillsSection from './components/home/SkillsSection'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { getHomeData, type HomeData } from './lib/portfolioData'
import Admin from './pages/Admin'
import Login from './pages/Login'

type HomeDataStatus =
  | { state: 'loading' }
  | { state: 'success'; data: HomeData }
  | { state: 'error'; message: string }

function normalizePath(pathname: string) {
  return pathname === '/admin' || pathname === '/login' ? pathname : '/'
}

function navigateTo(path: string) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function App() {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    function handleNavigation() {
      setCurrentPath(normalizePath(window.location.pathname))
    }

    window.addEventListener('popstate', handleNavigation)

    return () => {
      window.removeEventListener('popstate', handleNavigation)
    }
  }, [])

  if (currentPath === '/login') {
    return <Login onNavigate={navigateTo} />
  }

  if (currentPath === '/admin') {
    return (
      <ProtectedRoute onNavigate={navigateTo}>
        <Admin onNavigate={navigateTo} />
      </ProtectedRoute>
    )
  }

  return <Home />
}

function Home() {
  const [homeData, setHomeData] = useState<HomeDataStatus>({ state: 'loading' })

  useEffect(() => {
    let isCurrent = true

    async function loadHomeData() {
      try {
        const data = await getHomeData()

        if (isCurrent) {
          setHomeData({ state: 'success', data })
        }
      } catch (error) {
        if (isCurrent) {
          setHomeData({ state: 'error', message: error instanceof Error ? error.message : 'Could not load portfolio content' })
        }
      }
    }

    loadHomeData()

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

      {homeData.state === 'loading' && (
        <main id="inicio" className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.025] px-5 py-12 text-center shadow-2xl shadow-black/30 sm:px-8 sm:py-16">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400 sm:text-sm">Loading portfolio</p>
            <h1 className="mt-4 text-3xl font-semibold text-zinc-100 sm:text-5xl">Preparing the latest content...</h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">Projects, skills, and certifications are loading from Supabase.</p>
          </div>
        </main>
      )}

      {homeData.state === 'error' && (
        <main id="inicio" className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <div className="w-full rounded-3xl border border-red-400/20 bg-red-950/20 px-5 py-12 text-center shadow-2xl shadow-black/30 sm:px-8 sm:py-16">
            <p className="text-xs uppercase tracking-[0.16em] text-red-300/80 sm:text-sm">Portfolio unavailable</p>
            <h1 className="mt-4 text-3xl font-semibold text-zinc-100 sm:text-5xl">Content could not be loaded.</h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">{homeData.message}</p>
          </div>
        </main>
      )}

      {homeData.state === 'success' && (
        <main id="inicio">
          <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
            <Hero profile={homeData.data.profile} skills={homeData.data.skills} />
            <ProjectsSection projects={homeData.data.projects} />
          </div>

          <AboutSection profile={homeData.data.profile} />

          <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
            <CertificationsSection certifications={homeData.data.certifications} />
            <SkillsSection skills={homeData.data.skills} />
          </div>
        </main>
      )}

      {homeData.state === 'success' && <Footer profile={homeData.data.profile} />}
    </div>
  )
}

export default App
