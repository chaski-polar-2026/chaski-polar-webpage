import { useExplorer } from '../ExplorerContext'
import type { IdZona } from '../lib/tipos'

// Approximate outline for orientation only; the selected point uses the loaded zone coordinates.
const PENINSULA = [[-68, -69], [-66, -67], [-64.5, -65], [-62, -63.4], [-58, -63], [-57, -64], [-60, -65], [-62, -67], [-63, -69]]
const ISLA = [[-59.2, -62.3], [-58.6, -61.9], [-57.7, -61.8], [-57.5, -62.1], [-58.4, -62.4]]
export default function MapaAntartico({ zona }: { zona: IdZona }) {
  const { modelo } = useExplorer()
  const z = modelo.zona(zona)
  const x = (lon: number) => (lon + 70) * 20
  const y = (lat: number) => (-60 - lat) * 30
  const points = (p: number[][]) => p.map(([lon, lat]) => `${x(lon!)},${y(lat!)}`).join(' ')
  return <figure className="zona-mapa">
    <svg viewBox="0 0 320 310" role="img" aria-label={`Schematic map of the Antarctic Peninsula and King George Island. The marker shows ${z.nombre}. Not to scale.`}>
      <rect width="320" height="310" fill="#0a3350" />
      <polygon points={points(PENINSULA)} fill="#bddeea" stroke="#eaf3f5" />
      <polygon points={points(ISLA)} fill="#bddeea" stroke="#eaf3f5" />
      <text x="100" y="28" fill="#eaf3f5" fontSize="12">King George Island</text>
      <path d="M205 34 230 57" stroke="#8fe3f2" />
      <text x="155" y="265" fill="#eaf3f5" fontSize="12">Antarctic Peninsula</text>
      <circle cx={x(z.lon)} cy={y(z.lat)} r="13" fill="none" stroke="#f08a4b" strokeWidth="2" />
      <circle cx={x(z.lon)} cy={y(z.lat)} r="5" fill="#f08a4b" stroke="#071e33" strokeWidth="2" />
      <text x="16" y="24" fill="#eaf3f5" fontSize="12">N ↑</text>
    </svg>
    <figcaption>Schematic map, not to scale</figcaption>
  </figure>
}
