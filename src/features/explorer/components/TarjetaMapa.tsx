import { useEffect, useRef } from 'react'
import MapaCosta, { COSTA, LON0, ZONAS, px, py } from '../../pescadores/MapaCosta'
import { iconoPez } from '../../pescadores/iconosPez'
import especies from '../data/especies.json'
import { useExplorer } from '../ExplorerContext'
import { useExplorerStore } from '../store'
import type { IdZona } from '../lib/tipos'
import { esPeru } from '../lib/modelo'
import MapaAntartico from './MapaAntartico'
import DatosZona from './DatosZona'
import './tarjeta-mapa.css'

const ZONAS_MAPA = ['paita', 'chimbote', 'callao', 'pisco', 'ilo']
const PECES_DOCUMENTADOS = ['anchoveta', 'jurel', 'caballa', 'perico', 'bonito', 'merluza']
type Especie = { id: string; common_name_en: string; group: string }

/** Puntos pseudoaleatorios estables (mismo resultado en cada dibujo). */
const pseudo = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }

/** Vista ampliada y centrada de una zona: mapa acercado, datos del mes y especies documentadas en la costa peruana. */
function VistaZona({ zona, idMapa, cerrar }: { zona: IdZona; idMapa?: string; cerrar: () => void }) {
  const { modelo } = useExplorer()
  const month = useExplorerStore((s) => s.month)
  const section = useExplorerStore(s => s.section)
  const phase = useExplorerStore(s => s.zonePhase)
  const dialogo = useRef<HTMLDivElement>(null)
  const boton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const anterior = document.activeElement instanceof HTMLElement ? document.activeElement : null
    boton.current?.focus({ preventScroll: true })
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); cerrar() }
      if (e.key === 'Tab') {
        const nodes = [...(dialogo.current?.querySelectorAll<HTMLElement>('button,a[href],summary,select') ?? [])]
        const first = nodes[0], last = nodes.at(-1)
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', tecla)
    return () => { document.removeEventListener('keydown', tecla); if (anterior?.isConnected) anterior.focus({ preventScroll: true }) }
  }, [cerrar])

  const detalle = modelo.zona(zona)
  const peru = esPeru(zona)
  const z = ZONAS.find((x) => x.id === idMapa) ?? { lon: detalle.lon, lat: detalle.lat, nombre: detalle.nombre }
  const chl = modelo.valorSerie(zona, 'clorofila_mg_m3', month)
  const fecha = modelo.mes(month)
  const mes = new Date(Date.UTC(fecha.anio, fecha.mes, 1)).toLocaleDateString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })

  // Recorte del mapa alrededor de la zona
  const ancho = 5.2 * 26, alto = 6.6 * 26
  const x0 = px(z.lon) - ancho * 0.62, y0 = py(z.lat) - alto / 2
  const costa = COSTA.map(([lo, la]) => `${px(lo).toFixed(1)},${py(la).toFixed(1)}`).join(' ')
  const tierra = `${costa} ${px(LON0 + 30)},${py(-18.35)} ${px(LON0 + 30)},${py(-3.2)}`
  // Fitoplancton: más puntos cuanto mayor la clorofila (escala logarítmica suave)
  const n = chl == null ? 0 : Math.max(5, Math.min(36, Math.round(8 + 30 * Math.log10(Math.max(chl, 0.05) / 0.3 + 1))))
  const puntos = Array.from({ length: n }, (_, i) => ({ x: px(z.lon) - 18 - pseudo(i) * 90, y: py(z.lat) - 60 + pseudo(i + 50) * 120, r: 2 + pseudo(i + 100) * 2.6 }))
  const peces = (especies as unknown as Especie[]).filter((e) => PECES_DOCUMENTADOS.includes(e.id))

  return (
    <div ref={dialogo} className={`vista-zona${phase === 'returning' ? ' saliendo' : ''}${section === 'anchoveta' ? ' vista-zona-biologia' : ''}`} role="dialog" aria-modal="false" aria-label={`Zone view: ${detalle.nombre}`}>
      <div className="vista-zona-barra">
        <button ref={boton} type="button" className="vista-zona-volver" onClick={cerrar}>← Back to globe</button>
        <div><h3>{detalle.nombre}</h3><p className="zona-region">{detalle.region}</p></div>
        <span>{mes}</span>
      </div>
      <div className="vista-zona-cuerpo">
        {peru ? <figure className="zona-mapa"><svg viewBox={`${x0} ${y0} ${ancho} ${alto}`} role="img" aria-label={`Schematic close-up of the coast near ${z.nombre}, with plankton dots whose number reflects the chlorophyll value of the selected month.`}>
          <rect x={x0 - 5} y={y0 - 5} width={ancho + 10} height={alto + 10} fill="#0a3350" />
          <polygon points={tierra} fill="#b9a077" fillOpacity=".9" />
          <polyline points={costa} fill="none" stroke="#eaf3f5" strokeOpacity=".7" strokeWidth="1.6" />
          {puntos.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#3fc28c" fillOpacity=".8" />)}
          <path d={`M ${px(z.lon) - 80} ${py(z.lat) + 60} L ${px(z.lon) - 80} ${py(z.lat) - 50}`} stroke="#8fe3f2" strokeWidth="2" strokeDasharray="5 4" fill="none" />
          <path d={`M ${px(z.lon) - 86} ${py(z.lat) - 44} L ${px(z.lon) - 80} ${py(z.lat) - 54} L ${px(z.lon) - 74} ${py(z.lat) - 44}Z`} fill="#8fe3f2" />
          <circle cx={px(z.lon)} cy={py(z.lat)} r="9" fill="#63cde8" stroke="#071e33" strokeWidth="2.5" />
          <circle cx={px(z.lon)} cy={py(z.lat)} r="17" fill="none" stroke="#8fe3f2" strokeOpacity=".7" strokeWidth="2" />
        </svg><figcaption>Schematic map, not to scale. Arrow: Humboldt Current, flowing north.</figcaption></figure> : <MapaAntartico zona={zona} />}
        <div className="vista-zona-datos">
          {section !== 'anchoveta' && <DatosZona zona={zona} />}
          {peru && <section className="zona-biologia" aria-label="Coast-wide biological context">
          <p className="vista-zona-nota">{chl == null ? 'Phytoplankton: no data for this zone this month.' : 'Green dots reflect the selected month’s chlorophyll pigment, not a count of organisms or fish.'}</p>
          <p className="vista-zona-sub">Species documented off the Peruvian coast</p>
          <ul className="vista-zona-peces">
            {peces.map((e) => <li key={e.id}><span aria-hidden="true">{iconoPez(e.id, e.group)}</span><span>{e.common_name_en}</span></li>)}
          </ul>
          <p className="vista-zona-nota">The species list is for the whole Peruvian coast and does not say what lives in this zone today.</p>
          {section === 'anchoveta' && <a className="zona-pescadores" href="/fishers">For fishers →</a>}
          </section>}
          {section === 'anchoveta' && <DatosZona zona={zona} />}
          <p className="vista-zona-nota">Zone characteristics: no data for this zone.</p>
        </div>
      </div>
    </div>
  )
}

/** Mapa esquemático junto al globo; al hacer clic se abre la vista ampliada en el centro, con opción de volver. */
export default function TarjetaMapa() {
  const panel = useExplorerStore((s) => s.panel)
  const zonaId = panel.tipo === 'zona' ? panel.z : null
  const zoneView = useExplorerStore(s => s.zoneView)
  const phase = useExplorerStore(s => s.zonePhase)
  const openZone = useExplorerStore(s => s.openZone)
  const closeZone = useExplorerStore(s => s.closeZone)

  let resaltar: string | undefined, titulo = ''
  const idMapa = panel.tipo === 'zona' ? ZONAS_MAPA.find((z) => panel.z.includes(z)) : undefined
  if (panel.tipo === 'zona') {
    resaltar = idMapa; titulo = 'Where this zone is'
  } else if (panel.tipo === 'corriente' && panel.id === 'humboldt') {
    titulo = 'The Humboldt Current along Peru'
  } else return null

  return (
    <>
      <aside className="tarjeta-mapa" aria-label={titulo}>
        <p className="tarjeta-mapa-titulo">{titulo}</p>
        {zonaId && !esPeru(zonaId) ? <MapaAntartico zona={zonaId} /> : <MapaCosta resaltar={resaltar} compacto />}
        {zonaId && <button type="button" className="tarjeta-mapa-ampliar" onClick={() => openZone(zonaId)}>Open zone view ⤢</button>}
      </aside>
      {zoneView && (phase === 'map' || phase === 'returning') && <VistaZona key={zoneView} zona={zoneView} idMapa={idMapa} cerrar={closeZone} />}
    </>
  )
}
