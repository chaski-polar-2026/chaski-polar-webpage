import { useId } from 'react'
import { useExplorer } from '../ExplorerContext'
import type { IdZona } from '../lib/tipos'

// Approximate outline for orientation only; the selected point uses the loaded zone coordinates.
const PENINSULA = [[-68, -69], [-66, -67], [-64.5, -65], [-62, -63.4], [-58, -63], [-57, -64], [-60, -65], [-62, -67], [-63, -69]]
const ISLA = [[-59.2, -62.3], [-58.6, -61.9], [-57.7, -61.8], [-57.5, -62.1], [-58.4, -62.4]]
// Grietas finas dentro de la península y témpanos pequeños en el mar (coordenadas del viewBox)
const GRIETAS = ['M96 196 L120 180 L138 186', 'M168 160 L190 138 L212 134', 'M112 246 L134 226 L150 232', 'M72 228 L92 214']
const TEMPANOS: [number, number, number][] = [[290, 150, 1], [304, 196, 0.8], [280, 242, 0.65], [24, 226, 0.6]]
const temp = (cx: number, cy: number, s: number) => [[-6, 2], [-3, -3], [2, -4.5], [6, 0], [3, 4]].map(([a, b]) => `${(cx + a * s).toFixed(1)},${(cy + b * s).toFixed(1)}`).join(' ')
export default function MapaAntartico({ zona }: { zona: IdZona }) {
  const { modelo } = useExplorer()
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = `zm-ant-${uid}`
  const z = modelo.zona(zona)
  const x = (lon: number) => (lon + 70) * 20
  const y = (lat: number) => (-60 - lat) * 30
  const points = (p: number[][]) => p.map(([lon, lat]) => `${x(lon!)},${y(lat!)}`).join(' ')
  return <figure className="zona-mapa">
    <svg viewBox="0 0 320 310" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Schematic map of the Antarctic Peninsula and King George Island, with ice shadows, crevasses and small icebergs in the sea. The marker shows ${z.nombre}. Not to scale.`}>
      <defs>
        <linearGradient id={`${id}-mar`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b6f8e" />
          <stop offset="1" stopColor="#062640" />
        </linearGradient>
        <linearGradient id={`${id}-hielo`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".55" stopColor="#e4f3f9" />
          <stop offset="1" stopColor="#bfe0ee" />
        </linearGradient>
      </defs>
      <rect x="-300" y="-300" width="920" height="910" fill={`url(#${id}-mar)`} />
      {/* Sombras azul pálido y halo de espuma bajo cada masa de hielo */}
      <polygon points={points(PENINSULA)} transform="translate(4 5)" fill="#6fa6c0" fillOpacity=".45" />
      <polygon points={points(PENINSULA)} fill="none" stroke="#ffffff" strokeOpacity=".35" strokeWidth="3" />
      <polygon points={points(PENINSULA)} fill={`url(#${id}-hielo)`} stroke="#f3fafd" strokeWidth=".8" />
      <polygon points={points(ISLA)} transform="translate(2 3)" fill="#6fa6c0" fillOpacity=".45" />
      <polygon points={points(ISLA)} fill={`url(#${id}-hielo)`} stroke="#f3fafd" strokeWidth=".8" />
      <path d={GRIETAS.join(' ')} fill="none" stroke="#7fb2c8" strokeWidth=".7" strokeLinecap="round" strokeLinejoin="round" />
      {TEMPANOS.map(([cx, cy, s]) => <g key={`${cx}-${cy}`}>
        <polygon points={temp(cx, cy, s)} fill="#f4fbfd" stroke="#9cc8dc" strokeWidth=".6" />
        <polygon points={temp(cx, cy, s * 0.5)} fill="#cfe8f2" />
      </g>)}
      <text x="100" y="28" fill="#eaf3f5" fontSize="12">King George Island</text>
      <path d="M205 34 230 57" stroke="#8fe3f2" />
      <text x="155" y="265" fill="#eaf3f5" fontSize="12">Antarctic Peninsula</text>
      <circle className="zm-anillo" cx={x(z.lon)} cy={y(z.lat)} r="13" fill="none" stroke="#f08a4b" strokeWidth="2" />
      <circle cx={x(z.lon)} cy={y(z.lat)} r="5" fill="#f08a4b" stroke="#071e33" strokeWidth="2" />
      <text x="16" y="24" fill="#eaf3f5" fontSize="12">N ↑</text>
    </svg>
    <figcaption>Schematic map, not to scale</figcaption>
  </figure>
}
