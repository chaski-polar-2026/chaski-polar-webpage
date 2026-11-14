import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const LOGO = '/assets/logo/chaski-polar-wordmark.png'
const ICONO = '/assets/logo/chaski-polar-icon.png'

type Seccion = 'explore' | 'findings' | 'trends'

export default function Header() {
  const { pathname } = useLocation()
  const [seccion, setSeccion] = useState<Seccion>('explore')

  // la opción activa sigue al scroll: el globo es «Explore»; desde «What the data shows» hacia abajo, «Findings»
  useEffect(() => {
    if (pathname !== '/explorer') return
    const calcular = () => {
      const h = document.getElementById('hallazgos')
      const t = document.getElementById('trends')
      setSeccion(t && t.getBoundingClientRect().top <= window.innerHeight * .45 ? 'trends' : h && h.getBoundingClientRect().top <= window.innerHeight * 0.45 ? 'findings' : 'explore')
    }
    calcular()
    addEventListener('scroll', calcular, { passive: true })
    return () => removeEventListener('scroll', calcular)
  }, [pathname])

  const irAExplorar = (e: React.MouseEvent) => {
    // ya estamos en el explorador: se vuelve al globo sin recargar (así no se pierde el mes ni la zona elegidos)
    if (pathname !== '/explorer') return
    e.preventDefault()
    setSeccion('explore')
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  const irAHallazgos = (e: React.MouseEvent) => {
    const h = document.getElementById('hallazgos')
    if (!h) return
    e.preventDefault()
    setSeccion('findings')
    h.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  return <>
    <a className="saltar" href="#contenido">Skip to content</a>
    <header className="app-header chaski-header fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-4 py-2 pointer-events-none sm:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <Link className="app-brand pointer-events-auto flex shrink-0 items-center gap-3 no-underline" to="/" aria-label="Chaski Polar, return to home">
          <picture className="app-brand-logo">
            <source media="(max-width: 639px)" srcSet={ICONO} />
            <img src={LOGO} alt="Chaski Polar" width={144} height={40} decoding="async" />
          </picture>
        </Link>
        <div className="titulo-barra hidden truncate font-display text-[1.05rem] font-normal text-ice-300 lg:block" role="heading" aria-level={1}>
          From the Antarctic to the Peruvian sea
        </div>
      </div>
      <nav className="app-nav pointer-events-auto ml-auto flex gap-1 max-sm:[&>a]:px-2" aria-label="Sections">
        <Link className="rounded-pill px-3 py-1.5 no-underline transition-colors" to="/">Home</Link>
        <Link className="rounded-pill px-3 py-1.5 no-underline transition-colors" to="/explorer" onClick={irAExplorar} aria-current={seccion === 'explore' ? 'page' : undefined}>Explore</Link>
        <a className="rounded-pill px-3 py-1.5 no-underline transition-colors" href={pathname === '/explorer' ? '#hallazgos' : '/explorer#hallazgos'} onClick={irAHallazgos} aria-current={pathname === '/explorer' && seccion === 'findings' ? 'location' : undefined}>Findings</a>
        <a className="rounded-pill px-3 py-1.5 no-underline transition-colors" href={pathname === '/explorer' ? '#trends' : '/explorer#trends'} aria-current={pathname === '/explorer' && seccion === 'trends' ? 'location' : undefined}>Trends</a>
        <Link className="rounded-pill px-3 py-1.5 no-underline transition-colors" to="/juego">Game</Link>
      </nav>
    </header>
  </>
}
