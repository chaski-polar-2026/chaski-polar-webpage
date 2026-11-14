import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useExplorer } from '../../ExplorerContext'
import { APARTADOS } from '../../lib/regiones'
import { useExplorerStore } from '../../store'
import Relato from './Relato'

const media = '(max-width: 900px)'
const subscribe = (notify: () => void) => {
  const query = window.matchMedia(media)
  query.addEventListener('change', notify)
  return () => query.removeEventListener('change', notify)
}

/** En móvil la lectura vive en una bandeja; el documento y el mapa no se desplazan. */
export default function RelatoPanel() {
  const mobile = useSyncExternalStore(subscribe, () => window.matchMedia(media).matches, () => false)
  const { modelo } = useExplorer()
  const panel = useExplorerStore((s) => s.panel)
  const section = useExplorerStore((s) => s.section)
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const startY = useRef<number | null>(null)
  const swiped = useRef(false)

  useEffect(() => {
    content.current?.scrollTo({ top: 0 })
    if (panel.tipo !== 'general') setOpen(true)
  }, [panel, section])

  const title = panel.tipo === 'zona' ? modelo.zona(panel.z).nombre
    : panel.tipo === 'base' ? 'Base Machu Picchu'
      : panel.tipo === 'recorrido' ? `Ocean journey · ${panel.paso + 1}`
        : panel.tipo === 'punto' ? 'Selected ocean point'
          : panel.tipo === 'corriente' ? 'Ocean current'
            : panel.tipo === 'nino2026' ? 'El Niño 2026'
              : APARTADOS.find((a) => a.id === section)?.nombre ?? 'Explore the ocean'

  return <aside className={`relato${open ? ' relato-abierto' : ''}`} id="relato" aria-label="What the globe shows"
    onKeyDown={(event) => {
      if (mobile && open && event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        toggle.current?.focus({ preventScroll: true })
      }
    }}>
    <button className="relato-tirador" ref={toggle} type="button" aria-expanded={open} aria-controls="relato-scroll"
      onClick={() => { if (!swiped.current) setOpen(!open); swiped.current = false }}
      onPointerDown={(event) => { startY.current = event.clientY; swiped.current = false; event.currentTarget.setPointerCapture(event.pointerId) }}
      onPointerUp={(event) => {
        const delta = event.clientY - (startY.current ?? event.clientY)
        if (Math.abs(delta) > 30) { setOpen(delta < 0); swiped.current = true }
        startY.current = null
      }}
      onPointerCancel={() => { startY.current = null; swiped.current = false }}>
      <span className="relato-agarre" aria-hidden="true" />
      <span className="relato-titulo"><small>OCEAN EXPLORER</small><strong>{title}</strong></span>
      <span className="relato-accion">{open ? 'Map' : 'Data'}<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="m6 15 6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2" /></svg></span>
    </button>
    <div className="relato-scroll" id="relato-scroll" ref={content} inert={mobile && !open} tabIndex={mobile && open ? 0 : undefined}
      onClickCapture={(event) => {
        if (mobile && event.target instanceof Element && event.target.closest('[role="tab"]')) content.current?.scrollTo({ top: 0 })
      }}>
      <div className="relato-orientacion"><span>Explore the selected view below</span><a href="/research">Research <span aria-hidden="true">→</span></a></div>
      <Relato />
    </div>
  </aside>
}
