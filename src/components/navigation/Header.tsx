import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const LOGO = '/assets/logo/chaski-polar-wordmark.png'
const ICONO = '/assets/logo/chaski-polar-icon.png'

type Seccion = 'explore' | 'findings' | 'trends'

export default function Header() {
  const { pathname } = useLocation()
  const [seccion, setSeccion] = useState<Seccion>('explore')
  const [menuAbierto, setMenuAbierto] = useState(false)

  // en pantallas angostas el menú se pliega; se cierra al cambiar de página o con Escape
  useEffect(() => { setMenuAbierto(false) }, [pathname])
  useEffect(() => {
    if (!menuAbierto) return
    const alTeclear = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuAbierto(false) }
    addEventListener('keydown', alTeclear)
    return () => removeEventListener('keydown', alTeclear)
  }, [menuAbierto])

  // la opción activa sigue al scroll: el globo es «Explore»; desde «What the data shows» hacia abajo, «Findings»
  useEffect(() => {
    if (pathname !== '/research') return
    const calcular = () => {
      const t = document.getElementById('trends')
      setSeccion(t && t.getBoundingClientRect().top <= window.innerHeight * .45 ? 'trends' : 'findings')
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
    if (pathname !== '/research') return
    e.preventDefault()
    setSeccion('findings')
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
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
        <div className="titulo-barra hidden truncate font-display text-[1.05rem] font-normal text-ice-300 lg:block" role={pathname === "/explorer" ? "heading" : undefined} aria-level={pathname === "/explorer" ? 1 : undefined}>
          Is the change real? Ocean trends off Peru, tested
        </div>
      </div>
      <button type="button" className="nav-toggle pointer-events-auto" aria-expanded={menuAbierto} aria-controls="menu-principal" onClick={() => setMenuAbierto(v => !v)}>
        <span className="nav-toggle-barras" aria-hidden="true" />
        <span className="nav-toggle-texto">{menuAbierto ? 'Close' : 'Menu'}</span>
      </button>
      <nav id="menu-principal" className="app-nav pointer-events-auto ml-auto flex gap-1" data-abierto={menuAbierto ? 'true' : 'false'} aria-label="Sections" onClick={() => setMenuAbierto(false)}>
        <Link className="rounded-pill px-3 py-1.5 no-underline transition-colors" to="/">Home</Link>
        <Link className="rounded-pill px-3 py-1.5 no-underline transition-colors" to="/explorer" onClick={irAExplorar} aria-current={pathname === '/explorer' ? 'page' : undefined}>Explore</Link>
        <a className="rounded-pill px-3 py-1.5 no-underline transition-colors" href="/research" onClick={irAHallazgos} aria-current={pathname === '/research' && seccion === 'findings' ? 'location' : undefined}>Research</a>
        <a className="rounded-pill px-3 py-1.5 no-underline transition-colors" href={pathname === '/research' ? '#trends' : '/research#trends'} aria-current={pathname === '/research' && seccion === 'trends' ? 'location' : undefined}>Trends</a>
        <Link className="rounded-pill px-3 py-1.5 no-underline transition-colors" to="/fishers" aria-current={pathname === "/fishers" ? "page" : undefined}>Fishers</Link>
        <Link className="rounded-pill px-3 py-1.5 no-underline transition-colors" to="/juego">Game</Link>
        <Link className="rounded-pill px-3 py-1.5 no-underline transition-colors" to="/about" aria-current={pathname === "/about" ? "page" : undefined}>About</Link>
        <Link className="rounded-pill px-3 py-1.5 no-underline transition-colors" to="/help" aria-current={pathname === "/help" ? "page" : undefined}>Help</Link>
      </nav>
    </header>
  </>
}
