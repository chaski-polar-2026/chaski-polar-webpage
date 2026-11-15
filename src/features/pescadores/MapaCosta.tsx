
import costaPeru from './costaPeru.json'
import './pescadores.css'

/* Línea de costa real del Perú (Natural Earth, dominio público), simplificada a unos 150 puntos [lon, lat]. */
export const COSTA = costaPeru as [number, number][]
export const ZONAS = [
  { id: 'paita', nombre: 'Paita', lon: -81.11, lat: -5.09 },
  { id: 'chimbote', nombre: 'Chimbote', lon: -78.59, lat: -9.07 },
  { id: 'callao', nombre: 'Callao', lon: -77.15, lat: -12.05 },
  { id: 'pisco', nombre: 'Pisco', lon: -76.2, lat: -13.71 },
  { id: 'ilo', nombre: 'Ilo', lon: -71.34, lat: -17.64 },
]
export const K = 26, LON0 = -86, LAT0 = -3, W = 420, H = 410
export const px = (lon: number) => (lon - LON0) * K
export const py = (lat: number) => (LAT0 - lat) * K

/** Dónde están las zonas costeras del panel, con la mejora del pronóstico de temperatura a 1 mes. */
export default function MapaCosta({ resaltar, compacto = false }: { resaltar?: string; compacto?: boolean }) {
  const linea = COSTA.map(([lo, la]) => `${px(lo).toFixed(1)},${py(la).toFixed(1)}`).join(' ')
  const tierra = `${linea} ${W},${py(-18.35)} ${W},${py(-3.2)}`
  return (
    <figure className={compacto ? "pesc-mapa pesc-mapa--compacto" : "pesc-mapa"}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Schematic map of the Peruvian coast with the five coastal zones used in this page: Paita, Chimbote, Callao, Pisco and Ilo, from north to south. The Humboldt Current flows north along the coast." width="100%">
        <defs>
          <linearGradient id="mar-costa" x1="0" x2="1"><stop offset="0" stopColor="#0a3350" /><stop offset="1" stopColor="#0c2c4a" /></linearGradient>
          <marker id="flecha" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10Z" fill="#8fe3f2" /></marker>
        </defs>
        <rect width={W} height={H} fill="url(#mar-costa)" rx="8" />
        <polygon points={tierra} fill="#b9a077" fillOpacity="0.85" />
        <polyline points={linea} fill="none" stroke="#eaf3f5" strokeOpacity="0.7" strokeWidth="1.5" />
        <path d={`M ${px(-85.2)} ${py(-14)} L ${px(-85.2)} ${py(-7.5)}`} stroke="#8fe3f2" strokeWidth="2" strokeDasharray="5 4" markerEnd="url(#flecha)" fill="none" />
        <text x={px(-85.5)} y={py(-10.8)} fill="#8fe3f2" fontSize="16" transform={`rotate(-90 ${px(-85.5)} ${py(-10.8)})`} textAnchor="middle">Humboldt Current, flowing north</text>
        <text x={W - 10} y={py(-9)} fill="#4a3d27" fontSize="12" textAnchor="end" fontWeight="600">PERU</text>
        <text x={W - 10} y={14} fill="#a3bccb" fontSize="16" textAnchor="end">N ↑</text>
        {ZONAS.map((z) => (
          <g key={z.id} opacity={1}>
            {resaltar === z.id && <circle cx={px(z.lon)} cy={py(z.lat)} r="14" fill="none" stroke="#8fe3f2" strokeWidth="2" strokeOpacity="0.8" />}
            <circle cx={px(z.lon)} cy={py(z.lat)} r={resaltar === z.id ? 8 : 6} fill={resaltar && resaltar !== z.id ? "#4a7a92" : "#63cde8"} stroke="#071e33" strokeWidth="2" />
            <text x={px(z.lon) - 12} y={py(z.lat) + 4} textAnchor="end" fill="#eaf3f5" fontSize="20" fontWeight="600">{z.nombre}</text>
            <text x={px(z.lon) - 12} y={py(z.lat) + 18} textAnchor="end" fill="#8fe3f2" fontSize="16">{resaltar === z.id ? 'Selected zone' : ''}</text>
          </g>
        ))}
      </svg>
      {!compacto && <figcaption>Schematic map: the coastline is simplified (source: Natural Earth) and zone points are approximate. The ring marks your selected zone. The arrow shows the Humboldt Current flowing north.</figcaption>}
    </figure>
  )
}


