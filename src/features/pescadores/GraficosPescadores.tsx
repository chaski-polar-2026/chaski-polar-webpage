import { Bar, BarChart, CartesianGrid, Cell, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import datos from '../prediccion/perspectiva_acierto.json'
import especies from '../explorer/data/especies.json'
import MapaCosta from './MapaCosta'
import './pescadores.css'

const ZONAS: Record<string, string> = { paita: 'Paita', chimbote: 'Chimbote', callao: 'Callao', pisco: 'Pisco', ilo: 'Ilo' }
const COLORES = { 1: '#3fc28c', 2: '#9fe0f2', 3: '#f08a4b' } as const
const TOOLTIP = { background: '#0c2c4a', border: '1px solid #24507a', color: '#eaf3f5', fontSize: 13 }

type Profundidad = { min: number | null; max: number | null }
type Pez = { id: string; common_name_es: string; recorded_depth?: Profundidad }

/** Gráficos simples para lectores no técnicos. Describen registros pasados; no son pronósticos de pesca. */
export default function GraficosPescadores() {
  const filas = datos.results.filter((f) => f.variable === 'SST' && f.model === 'nino')
  const barras = Object.keys(ZONAS).map((z) => {
    const fila: Record<string, number | string | boolean> = { zona: ZONAS[z]! }
    for (const h of [1, 2, 3] as const) {
      const f = filas.find((x) => x.zone === z && x.horizon_months === h)
      if (f) { fila[`h${h}`] = Math.round(f.mae_improvement * 1000) / 10; fila[`c${h}`] = f.status.startsWith('clear') }
    }
    return fila
  })
  const lista = (especies as unknown as Pez[]).filter((e) => e.recorded_depth && (e.recorded_depth.min != null || e.recorded_depth.max != null))
  const MAX = 1250, ancho = 560, alto = lista.length * 30 + 38, izq = 130
  const x = (m: number) => izq + (Math.sqrt(m) / Math.sqrt(MAX)) * (ancho - izq - 14)
  const marcas = [0, 50, 100, 300, 800]

  return (
    <section className="seccion pescadores" id="fishers-charts" aria-labelledby="t-graficos">
      <p className="puente-kicker">Two pictures to start with</p>
      <h2 id="t-graficos">The same information, as pictures</h2>

      <h3>Where the five coastal zones are</h3>
      <MapaCosta />
      <h3>How much better is the temperature outlook than guessing a normal month?</h3>
      <p className="nota">Taller bars mean the outlook was closer to what happened. Faded bars mean the improvement is not clear. One month ahead it works well everywhere; farther ahead it fades.</p>
      <div className="pesc-grafico" role="img" aria-label="Bar chart: error reduction of the sea temperature outlook by coastal zone, at one, two and three months ahead. One month ahead is clearly better in every zone; the gain shrinks at two and three months.">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barras} margin={{ top: 10, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="rgba(163,188,203,.16)" />
            <XAxis dataKey="zona" tick={{ fill: '#a3bccb', fontSize: 12 }} />
            <YAxis tick={{ fill: '#a3bccb', fontSize: 12 }} tickFormatter={(v: number) => `${v}%`} />
            <ReferenceLine y={0} stroke="#a3bccb" />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => [`${Number(v) >= 0 ? '+' : '−'}${Math.abs(Number(v)).toFixed(0)}% smaller errors`, undefined]} />
            <Legend />
            {([1, 2, 3] as const).map((h) => (
              <Bar key={h} dataKey={`h${h}`} name={h === 1 ? '1 month ahead' : `${h} months ahead`} fill={COLORES[h]} radius={[3, 3, 0, 0]}>
                {barras.map((b) => <Cell key={String(b.zona)} fill={COLORES[h]} fillOpacity={b[`c${h}`] ? 1 : 0.35} />)}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Where in the water each species has been recorded</h3>
      <p className="nota">Each bar shows the depths reported in the cited sources, in metres below the surface. These are records from certain places and times. They are not limits and do not say where a species is today. The scale is stretched near the surface so shallow species are easy to compare.</p>
      <div className="pesc-grafico" role="img" aria-label={`Depth ranges recorded for ${lista.length} species, from the surface down to as deep as ${Math.max(...lista.map((e) => e.recorded_depth!.max ?? 0))} metres.`}>
        <svg viewBox={`0 0 ${ancho} ${alto}`} width="100%" aria-hidden="true" className="pesc-prof">
          {marcas.map((m) => <g key={m}><line x1={x(m)} x2={x(m)} y1={6} y2={alto - 24} stroke="rgba(163,188,203,.2)" /><text x={x(m)} y={alto - 8} textAnchor="middle" fill="#a3bccb" fontSize="11">{m} m</text></g>)}
          {lista.map((e, i) => {
            const a = e.recorded_depth!.min ?? 0, b = e.recorded_depth!.max ?? a, y = 10 + i * 30
            return <g key={e.id}>
              <text x={izq - 8} y={y + 12} textAnchor="end" fill="#eaf3f5" fontSize="12">{e.common_name_es.split(' o ')[0]}</text>
              <rect x={x(a)} y={y} width={Math.max(4, x(b) - x(a))} height={16} rx={3} fill="#63cde8" fillOpacity={0.8} />
              <text x={x(b) > ancho - 90 ? x(b) - 6 : x(b) + 5} y={y + 12} textAnchor={x(b) > ancho - 90 ? "end" : "start"} fill={x(b) > ancho - 90 ? "#071e33" : "#a3bccb"} fontSize="11" fontWeight={x(b) > ancho - 90 ? 700 : 400}>{a}–{b} m</text>
            </g>
          })}
        </svg>
      </div>
      <p className="tend-nota">Species without a verified depth record are not shown. Sources for each value are listed in the species cards below.</p>
    </section>
  )
}
