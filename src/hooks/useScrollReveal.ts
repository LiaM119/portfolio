import { useEffect } from 'react'

function useScrollReveal(isEnabled: boolean) {
  useEffect(() => {
    if (!isEnabled) {
      return
    }

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-reveal]'))

    if (elements.length === 0) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => {
        element.dataset.scrollReveal = 'visible'
      })
      return
    }

    document.documentElement.classList.add('scroll-reveal-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement

          if (entry.isIntersecting) {
            element.dataset.scrollReveal = 'visible'
          } else {
            element.dataset.scrollReveal = ''
          }
        })
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.16 },
    )

    elements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('scroll-reveal-ready')
    }
  }, [isEnabled])
}

export default useScrollReveal
