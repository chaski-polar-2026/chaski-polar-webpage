import { useEffect, useRef, useState } from 'react'
import MapaCosta, { COSTA, LON0, ZONAS, px, py } from '../../pescadores/MapaCosta'
import { iconoPez } from '../../pescadores/iconosPez'
import especies from '../data/especies.json'
import { useExplorer } from '../ExplorerContext'
import { useExplorerStore } from '../store'
import type { IdZona } from '../lib/tipos'
import './tarjeta-mapa.css'

const ZONAS_MAPA = ['paita', 'chimbote', 'callao', 'pisco', 'ilo']
const PECES_DOCUMENTADOS = ['anchoveta', 'jurel', 'caballa', 'perico', 'bonito', 'merluza']
type Especie = { id: string; common_name_es: string; group: string }

/** Puntos pseudoaleatorios estables (mismo resultado en cada dibujo). */
const pseudo = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s) }

/** Vista ampliada y centrada de una zona: mapa acercado, datos del mes y especies documentadas en la costa peruana. */
function VistaZona({ zona, idMapa, cerrar }: { zona: IdZona; idMapa: string; cerrar: () => void }) {
  const { modelo } = useExplorer()
  const month = useExplorerStore((s) => s.month)
  const boton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    boton.current?.focus()
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar() }
    document.addEventListener('keydown', tecla)
    return () => document.removeEventListener('keydown', tecla)
  }, [cerrar])

  const z = ZONAS.find((x) => x.id === idMapa)!
  const temp = modelo.valorSerie(zona, 'temperatura_superficial_C', month)
  const chl = modelo.valorSerie(zona, 'clorofila_mg_m3', month)
  const fecha = modelo.mes(month)
  const mes = new Date(Date.UTC(fecha.anio, fecha.mes, 1)).toLocaleDateString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })

  // Recorte del mapa alrededor de la zona
  const ancho = 5.2 * 26, alto = 6.6 * 26
  const x0 = px(z.lon) - ancho * 0.62, y0 = py(z.lat) - alto / 2
  const costa = COSTA.map(([lo, la]) => `${px(lo).toFixed(1)},${py(la).toFixed(1)}`).join(' ')
  const tierra = `${costa} ${px(LON0 + 30)},${py(-18.35)} ${px(LON0 + 30)},${py(-3.55)}`
  // Fitoplancton: más puntos cuanto mayor la clorofila (escala logarítmica suave)
  const n = chl == null ? 6 : Math.max(5, Math.min(36, Math.round(8 + 30 * Math.log10(Math.max(chl, 0.05) / 0.3 + 1))))
  const puntos = Array.from({ length: n }, (_, i) => ({ x: px(z.lon) - 18 - pseudo(i) * 90, y: py(z.lat) - 60 + pseudo(i + 50) * 120, r: 2 + pseudo(i + 100) * 2.6 }))
  const peces = (especies as unknown as Especie[]).filter((e) => PECES_DOCUMENTADOS.includes(e.id))

  return (
    <div className="vista-zona" role="dialog" aria-modal="false" aria-label={`Zone view: ${z.nombre}`}>
      <div className="vista-zona-barra">
        <button ref={boton} type="button" className="vista-zona-volver" onClick={cerrar}>← Back to globe</button>
        <h3>{z.nombre}</h3>
        <span>{mes}</span>
      </div>
      <div className="vista-zona-cuerpo">
        <svg viewBox={`${x0} ${y0} ${ancho} ${alto}`} role="img" aria-label={`Schematic close-up of the coast near ${z.nombre}, with plankton dots whose number reflects the chlorophyll value of the selected month.`}>
          <rect x={x0 - 5} y={y0 - 5} width={ancho + 10} height={alto + 10} fill="#0a3350" />
          <polygon points={tierra} fill="#b9a077" fillOpacity=".9" />
          <polyline points={costa} fill="none" stroke="#eaf3f5" strokeOpacity=".7" strokeWidth="1.6" />
          {puntos.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#3fc28c" fillOpacity=".8" />)}
          <path d={`M ${px(z.lon) - 80} ${py(z.lat) + 60} L ${px(z.lon) - 80} ${py(z.lat) - 50}`} stroke="#8fe3f2" strokeWidth="2" strokeDasharray="5 4" fill="none" />
          <path d={`M ${px(z.lon) - 86} ${py(z.lat) - 44} L ${px(z.lon) - 80} ${py(z.lat) - 54} L ${px(z.lon) - 74} ${py(z.lat) - 44}Z`} fill="#8fe3f2" />
          <circle cx={px(z.lon)} cy={py(z.lat)} r="9" fill="#63cde8" stroke="#071e33" strokeWidth="2.5" />
          <circle cx={px(z.lon)} cy={py(z.lat)} r="17" fill="none" stroke="#8fe3f2" strokeOpacity=".7" strokeWidth="2" />
        </svg>
        <div className="vista-zona-datos">
          <ul className="vista-zona-cifras">
            <li><b>{temp == null ? '–' : `${temp.toFixed(1)} °C`}</b><span>sea surface temperature</span></li>
            <li><b>{chl == null ? '–' : `${chl.toFixed(2)} mg/m³`}</b><span>chlorophyll (plankton). More green dots on the map = more plankton</span></li>
          </ul>
          <p className="vista-zona-sub">Species documented off the Peruvian coast</p>
          <ul className="vista-zona-peces">
            {peces.map((e) => <li key={e.id}>{iconoPez(e.id, e.group)}<span>{e.common_name_es}</span></li>)}
          </ul>
          <p className="vista-zona-nota">Schematic drawing. The species list is for the whole Peruvian coast and does not say what lives in this zone today. Arrow: Humboldt Current, flowing north.</p>
        </div>
      </div>
    </div>
  )
}

/** Mapa esquemático junto al globo; al hacer clic se abre la vista ampliada en el centro, con opción de volver. */
export default function TarjetaMapa() {
  const panel = useExplorerStore((s) => s.panel)
  const [abierta, setAbierta] = useState(false)
  const zonaId = panel.tipo === 'zona' ? panel.z : null
  useEffect(() => { setAbierta(false) }, [zonaId])

  let resaltar: string | undefined, titulo = ''
  const idMapa = panel.tipo === 'zona' ? ZONAS_MAPA.find((z) => panel.z.includes(z)) : undefined
  if (panel.tipo === 'zona') {
    if (!idMapa) return null
    resaltar = idMapa; titulo = 'Where this zone is'
  } else if (panel.tipo === 'corriente' && panel.id === 'humboldt') {
    titulo = 'The Humboldt Current along Peru'
  } else return null

  return (
    <>
      <aside className="tarjeta-mapa" aria-label={titulo}>
        <p className="tarjeta-mapa-titulo">{titulo}</p>
        <MapaCosta resaltar={resaltar} compacto />
        {idMapa && <button type="button" className="tarjeta-mapa-ampliar" onClick={() => setAbierta(true)}>Open zone view ⤢</button>}
      </aside>
      {abierta && zonaId && idMapa && <VistaZona zona={zonaId} idMapa={idMapa} cerrar={() => setAbierta(false)} />}
    </>
  )
}
