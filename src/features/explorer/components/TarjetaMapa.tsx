import { useEffect, useId, useRef } from 'react'
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
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
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
  const id = `zm-${uid}`
  const cx0 = px(z.lon), cy0 = py(z.lat)
  // Eje perpendicular a la costa (aprox. tramo Paita–Ilo): u apunta al mar
  const ux = -0.79, uy = 0.62
  // Abscisa de la costa a una altura dada, para colocar plancton y olas en el mar
  const xCosta = (y: number) => {
    let mejor = COSTA[0]
    for (const p of COSTA) if (Math.abs(py(p[1]) - y) < Math.abs(py(mejor[1]) - y)) mejor = p
    return px(mejor[0])
  }
  // Fitoplancton: más puntos cuanto mayor la clorofila (escala logarítmica suave)
  const n = chl == null ? 0 : Math.max(5, Math.min(36, Math.round(8 + 30 * Math.log10(Math.max(chl, 0.05) / 0.3 + 1))))
  // Franja a lo largo de la costa (sentido norte-sur), regularmente espaciada y cerca de la orilla
  const puntos = Array.from({ length: n }, (_, i) => {
    const y = y0 + 14 + ((i + 0.5) / n) * (alto - 28) + (pseudo(i + 50) - 0.5) * 10
    const d = 8 + 46 * Math.pow(pseudo(i + 100), 1.6)
    const r = 3 + pseudo(i + 200) * 6.5
    return { x: xCosta(y) - d, y, r, ry: r * (0.62 + 0.38 * pseudo(i + 300)), brillo: r > 5.5 }
  })
  // Olas suaves en el mar, en la misma franja que el plancton
  const olas = Array.from({ length: 6 }, (_, i) => {
    const y = y0 + 30 + (i * (alto - 60)) / 5
    const x = xCosta(y) - 22 - pseudo(i + 500) * 20
    return `M${x.toFixed(1)} ${y.toFixed(1)} q3 -2.2 6 0 t6 0 t6 0`
  }).join(' ')
  // Bandas de profundidad: copias de la costa desplazadas hacia el mar
  const bandas = [14, 28, 42, 58]
  const peces = (especies as unknown as Especie[]).filter((e) => PECES_DOCUMENTADOS.includes(e.id))

  return (
    <div ref={dialogo} className={`vista-zona${phase === 'returning' ? ' saliendo' : ''}${section === 'anchoveta' ? ' vista-zona-biologia' : ''}`} role="dialog" aria-modal="false" aria-label={`Zone view: ${detalle.nombre}`}>
      <div className="vista-zona-barra">
        <button ref={boton} type="button" className="vista-zona-volver" onClick={cerrar}>← Back to globe</button>
        <div><h3>{detalle.nombre}</h3><p className="zona-region">{detalle.region}</p></div>
        <span>{mes}</span>
      </div>
      <div className="vista-zona-cuerpo">
        {peru ? <figure className="zona-mapa"><svg viewBox={`${x0} ${y0} ${ancho} ${alto}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Schematic close-up of the coast near ${z.nombre}: sea shaded by depth with wave lines, sand and mountain relief on land, and plankton dots whose number reflects the chlorophyll value of the selected month. Arrow: Humboldt Current flowing north.`}>
          <defs>
            <linearGradient id={`${id}-mar`} gradientUnits="userSpaceOnUse" x1={cx0 - ux * 4} y1={cy0 - uy * 4} x2={cx0 + ux * 100} y2={cy0 + uy * 100}>
              <stop offset="0" stopColor="#3cc6c4" />
              <stop offset=".22" stopColor="#1d86a0" />
              <stop offset=".6" stopColor="#0f4f73" />
              <stop offset="1" stopColor="#072a48" />
            </linearGradient>
            <linearGradient id={`${id}-suelo`} gradientUnits="userSpaceOnUse" x1={cx0 - ux * 2} y1={cy0 - uy * 2} x2={cx0 - ux * 110} y2={cy0 - uy * 110}>
              <stop offset="0" stopColor="#ecdcb2" />
              <stop offset=".35" stopColor="#cdae78" />
              <stop offset=".7" stopColor="#a17d4d" />
              <stop offset="1" stopColor="#6d5030" />
            </linearGradient>
            <pattern id={`${id}-textura`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
              <circle cx="1" cy="1" r=".45" fill="#4a3418" fillOpacity=".3" /><circle cx="3.2" cy="3.4" r=".35" fill="#4a3418" fillOpacity=".24" />
            </pattern>
            <radialGradient id={`${id}-plancton`}>
              <stop offset="0" stopColor="#9bf5b8" stopOpacity=".95" />
              <stop offset=".45" stopColor="#3fc28c" stopOpacity=".6" />
              <stop offset="1" stopColor="#3fc28c" stopOpacity="0" />
            </radialGradient>
            <clipPath id={`${id}-recorte`}><polygon points={tierra} /></clipPath>
          </defs>
          {/* Mar: degradado perpendicular a la costa, bandas de profundidad y olas */}
          <rect x={x0 - 300} y={y0 - 300} width={ancho + 600} height={alto + 600} fill={`url(#${id}-mar)`} />
          {bandas.map((dx, i) => <polyline key={dx} points={costa} transform={`translate(${-dx} 0)`} fill="none" stroke="#bfe9f2" strokeOpacity={[.22, .17, .13, .09][i]} strokeWidth=".9" />)}
          <path d={olas} fill="none" stroke="#8fe3f2" strokeOpacity=".18" strokeWidth=".6" strokeLinecap="round" />
          {/* Tierra: arena cerca de la costa, ocre y pardo hacia el interior, sierras y sombra */}
          <polygon points={tierra} fill={`url(#${id}-suelo)`} />
          <polygon points={tierra} fill={`url(#${id}-textura)`} />
          {[9, 20, 33, 49, 68, 90].map((dx, i) => <g key={dx}><polygon points={tierra} transform={`translate(${dx} 0)`} fill="#5b3f1f" fillOpacity=".15" /><polyline points={costa} transform={`translate(${dx} 0)`} fill="none" stroke="#4a3418" strokeOpacity={0.45 - i * 0.04} strokeWidth=".7" strokeLinejoin="round" /></g>)}
          {Array.from({ length: 9 }, (_, i) => { const y = y0 + 16 + (i + pseudo(i + 700) * 0.6) * ((alto - 30) / 9), x = xCosta(y) + 34 + pseudo(i + 800) * 60, t = 3.2 + pseudo(i + 900) * 2.6; return <path key={i} d={`M${(x - t).toFixed(1)} ${(y + t * 0.7).toFixed(1)} L${x.toFixed(1)} ${(y - t).toFixed(1)} L${(x + t).toFixed(1)} ${(y + t * 0.7).toFixed(1)} M${x.toFixed(1)} ${(y - t).toFixed(1)} L${(x + t * 0.2).toFixed(1)} ${(y + t * 0.7).toFixed(1)}`} fill="none" stroke="#3b2812" strokeOpacity=".55" strokeWidth=".8" strokeLinejoin="round" strokeLinecap="round" /> })}
          <g clipPath={`url(#${id}-recorte)`}>
            <polyline points={costa} transform="translate(6 3)" fill="none" stroke="#3b2812" strokeOpacity=".3" strokeWidth="9" strokeLinejoin="round" />
          </g>
          {/* Línea de costa: espuma tenue y contorno */}
          <polyline points={costa} fill="none" stroke="#ffffff" strokeOpacity=".3" strokeWidth="3.6" strokeLinejoin="round" strokeLinecap="round" />
          <polyline points={costa} fill="none" stroke="#eaf3f5" strokeOpacity=".7" strokeWidth="1.6" />
          {/* Fitoplancton: manchas degradadas y destellos sobre las grandes */}
          {puntos.map((p, i) => <g key={i}>
            {[0, 1, 2].map((k) => { const a = pseudo(i * 7 + k + 900) * 6.28, d = k === 0 ? 0 : 1.6 + pseudo(i * 3 + k) * 2.6, rr = k === 0 ? 1.5 + p.r * 0.22 : 0.8 + pseudo(i + k * 11) * 0.9, cx = p.x + Math.cos(a) * d, cy = p.y + Math.sin(a) * d; return <g key={k}><circle cx={cx} cy={cy} r={rr} fill="#46c98f" stroke="#0b5a43" strokeWidth=".35" /><circle cx={cx - rr * 0.3} cy={cy - rr * 0.3} r={rr * 0.35} fill="#c9ffe0" /></g> })}
          </g>)}
          {/* Corriente de Humboldt: trazo discontinuo con punta suave (animado salvo reduced-motion) */}
          <path className="zm-flecha" d={`M ${cx0 - 74} ${cy0 + 60} L ${cx0 - 74} ${cy0 - 48}`} stroke="#8fe3f2" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 4" fill="none" />
          <path d={`M ${cx0 - 79} ${cy0 - 37} L ${cx0 - 74} ${cy0 - 49} L ${cx0 - 69} ${cy0 - 37}`} stroke="#8fe3f2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* Marcador de la zona: punto, anillo que pulsa y etiqueta sobre el mar */}
          <circle cx={cx0} cy={cy0} r="3.6" fill="#63cde8" stroke="#071e33" strokeWidth="1.6" />
          <circle className="zm-anillo" cx={cx0} cy={cy0} r="7" fill="none" stroke="#8fe3f2" strokeOpacity=".75" strokeWidth="1.1" />
          <text x={cx0 - 11} y={cy0 + 3} textAnchor="end" fontSize="8" fontWeight="600" fill="#eaf3f5" stroke="#071e33" strokeWidth="2.5" paintOrder="stroke">{z.nombre}</text>
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
