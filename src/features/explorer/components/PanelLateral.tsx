import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useExplorerStore } from '../store'
import './panel-lateral.css'

/** El mismo contenido lateral se abre desde abajo en pantallas estrechas. */
export default function PanelLateral({ titulo, children }: { titulo: string; children: ReactNode }) {
  const abierto = useExplorerStore(s => s.sidebarOpen)
  const setAbierto = useExplorerStore(s => s.setSidebarOpen)
  const panel = useExplorerStore(s => s.panel)
  const section = useExplorerStore(s => s.section)
  const phase = useExplorerStore(s => s.zonePhase)
  const [movil, setMovil] = useState(() => window.matchMedia('(max-width: 1100px)').matches)
  const boton = useRef<HTMLButtonElement>(null)
  const cuerpo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1100px)')
    const cambiar = () => setMovil(media.matches)
    media.addEventListener('change', cambiar)
    return () => media.removeEventListener('change', cambiar)
  }, [])

  useEffect(() => {
    cuerpo.current?.scrollTo({ top: 0 })
    // Las zonas abren su propio mapa; el resto de selecciones abre su explicación.
    if (movil && panel.tipo !== 'zona' && panel.tipo !== 'general') setAbierto(true)
  }, [movil, panel, section, setAbierto])

  useEffect(() => {
    if (movil && abierto && phase === 'globe' && !document.querySelector('dialog[open]')) boton.current?.focus({ preventScroll: true })
  }, [abierto, movil, phase])

  const oculto = movil && (!abierto || phase !== 'globe')
  return <aside className="relato" id="relato" aria-label="What the globe shows" data-open={abierto} data-zone-active={phase !== 'globe'} onKeyDown={e => {
    if (movil && abierto && e.key === 'Escape' && !e.defaultPrevented) {
      e.preventDefault()
      e.stopPropagation()
      setAbierto(false)
      boton.current?.focus({ preventScroll: true })
    }
  }}>
    <button className="relato-movil-cabecera" type="button" ref={boton} aria-expanded={abierto} aria-controls="relato-cuerpo" onClick={() => setAbierto(!abierto)}>
      <span className="relato-movil-asa" aria-hidden="true" />
      <span className="relato-movil-titulo"><small>Data panel</small><strong>{titulo}</strong></span>
      <span className="relato-movil-accion">{abierto ? 'Close' : 'Open'}<span aria-hidden="true">{abierto ? ' ↓' : ' ↑'}</span></span>
    </button>
    <div className="relato-cuerpo" id="relato-cuerpo" ref={cuerpo} inert={oculto} aria-hidden={oculto || undefined}>
      {children}
    </div>
  </aside>
}
