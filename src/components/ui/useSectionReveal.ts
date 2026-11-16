import { useEffect, useRef } from 'react'

/** One entrance per element; content remains visible if motion or JS is unavailable. */
export function useSectionReveal(ready = true) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const root = ref.current
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    if (!root || !ready || motion.matches) return
    const animations = new Set<Animation>()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        if (motion.matches) return
        const index = [...entry.target.parentElement!.children].indexOf(entry.target)
        const animation = entry.target.animate(
          [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 340, delay: (index % 3) * 20, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' },
        )
        animations.add(animation)
        void animation.finished.then(() => animations.delete(animation), () => animations.delete(animation))
      })
    }, { threshold: .08 })
    root.querySelectorAll('[data-reveal], [data-stagger] > *').forEach(el => observer.observe(el))
    const cancel = () => {
      if (motion.matches) { observer.disconnect(); animations.forEach(a => a.cancel()); animations.clear() }
    }
    motion.addEventListener('change', cancel)
    return () => { observer.disconnect(); animations.forEach(a => a.cancel()); motion.removeEventListener('change', cancel) }
  }, [ready])
  return ref
}
