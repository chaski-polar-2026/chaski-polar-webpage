import { SectionArt } from '../../components/ui/SectionArt'
import { useSectionReveal } from '../../components/ui/useSectionReveal'
import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import '../tendencias/tendencias.css'
import InfoTip from '../../components/ui/InfoTip'
import './prediccion.css'

type Horizonte = { zona: string; h: number; habilidad: number; habilidad_persistencia: number; r: number; n: number }
type Mes = { mes: string; nino12: number; obs: number; pred: number }
type Validacion = { horizontes: Horizonte[]; meses_2026: Record<string, Mes[]> }

const ZONAS: { id: string; nombre: string }[] = [
  { id: 'paita', nombre: 'Paita' },
  { id: 'chimbote', nombre: 'Chimbote' },
  { id: 'callao', nombre: 'Callao' },
  { id: 'pisco', nombre: 'Pisco' },
  { id: 'ilo', nombre: 'Ilo' },
]
const MESES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const nf = (d: number) => new Intl.NumberFormat('en', { maximumFractionDigits: d, minimumFractionDigits: d })
const signo = (x: number) => (x > 0 ? '+' : x < 0 ? '−' : '')
const etiquetaMes = (m: string) => MESES[Number(m.slice(5, 7)) - 1] ?? m
const TOOLTIP = { background: 'var(--profundo)', border: '1px solid var(--frio)', borderRadius: 6, color: 'var(--hielo)' }

/** Cuánto se puede anticipar la clorofila: validación con origen móvil (2010–2025) y comprobación con los meses observados de 2026 */
export default function PrediccionSection() {
  const [datos, setDatos] = useState<Validacion | null>(null)
  const reveal = useSectionReveal(Boolean(datos))
  const [zona, setZona] = useState('chimbote')
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let vivo = true
    setError(false)
    fetch('/assets/data/validacion-prediccion.json').then((r) => { if (!r.ok) throw new Error('data'); return r.json() }).then((d: Validacion) => { if (vivo) setDatos(d) }).catch(() => { if (vivo) setError(true) })
    return () => { vivo = false }
  }, [attempt])

  if (!datos) return <section className="seccion prediccion" id="prediction" aria-labelledby="t-prediccion"><h2 id="t-prediccion">Can we anticipate chlorophyll?</h2><div className="prediction-loading" role="status" aria-busy={!error}>{error ? <>Chlorophyll results could not be loaded. <button className="btn" onClick={() => setAttempt(attempt + 1)}>Try again</button></> : 'Loading chlorophyll results...'}</div></section>
  const barras = ZONAS.map((z) => {
    const f: Record<string, number | string> = { zona: z.nombre }
    for (const h of datos.horizontes.filter((x) => x.zona === z.id)) f[`h${h.h}`] = h.habilidad
    return f
  })
  const meses = datos.meses_2026[zona] ?? []
  const grafico = meses.map((m) => ({ mes: etiquetaMes(m.mes), observada: m.obs, predicha: m.pred }))
  const media = (k: 'obs' | 'pred') => (meses.length ? meses.reduce((a, m) => a + m[k], 0) / meses.length : 0)
  const falla = zona === 'ilo'

  return (
    <section ref={reveal} className="seccion prediccion" id="prediction" aria-labelledby="t-prediccion">
      <header className="lab-heading" data-reveal><SectionArt kind="outlook" /><div><p className="puente-kicker">How far ahead can we see?</p>
      <h2 id="t-prediccion">Can we anticipate chlorophyll?</h2></div></header>
      <p className="nota">We tested a simple model that predicts the chlorophyll anomaly<InfoTip term="Anomaly">Difference from what is normal for that month.</InfoTip> of a month from El Niño 1+2<InfoTip term="El Niño 1+2">Sea temperature in the coastal area off Peru and Ecuador.</InfoTip> and from last month&apos;s chlorophyll. To be fair, each year from 2010 to 2025 was predicted using only data from before that year.</p>

      <h3>Skill over doing nothing, by months ahead</h3>
      <p className="tend-nota">A positive value means the model made smaller errors than simply predicting a normal month. Higher is better.</p>
      <div className="tend-grafico" data-reveal role="group" aria-label="Forecast skill by zone and months ahead">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barras} margin={{ top: 10, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="var(--linea)" strokeOpacity={0.4} strokeDasharray="2 5" vertical={false} />
            <XAxis dataKey="zona" tick={{ fill: 'var(--niebla)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'var(--niebla)', fontSize: 12 }} tickFormatter={(v: number) => `${v}%`} />
            <ReferenceLine y={0} stroke="var(--niebla)" />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => [`${signo(Number(v))}${nf(1).format(Math.abs(Number(v)))}%`, undefined]} />
            <Legend />
            <Bar isAnimationActive={false} dataKey="h1" name="1 month ahead" fill="var(--fito)" radius={[3, 3, 0, 0]} />
            <Bar isAnimationActive={false} dataKey="h2" name="2 months" fill="var(--cp-oxygen)" radius={[3, 3, 0, 0]} />
            <Bar isAnimationActive={false} dataKey="h3" name="3 months" fill="var(--nino)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="tend-nota">The skill is modest: useful one month ahead (about +5% to +17%) and almost gone at three months. The model always beat simply repeating last month&apos;s anomaly, by 9% to 31%.</p>

      <h3>A check with 2026</h3>
      <p className="tend-nota">With the model fitted on 1998–2025, we compared its estimate with the chlorophyll observed from January to July 2026, knowing El Niño 1+2 each month. This is not a forecast: it checks whether the relationship holds in a new El Niño year.</p>
      <div className="tend-controles">
        <label>Zone
          <select value={zona} onChange={(ev) => setZona(ev.target.value)}>
            {ZONAS.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
          </select>
        </label>
      </div>
      <div className={`tend-veredicto ${falla ? 'no' : 'si'}`} role="status">
        <b>{falla ? 'The model fails here' : 'The model follows the observation'}</b>
        <span>Observed average {signo(media('obs'))}{nf(1).format(Math.abs(media('obs')))}% · predicted {signo(media('pred'))}{nf(1).format(Math.abs(media('pred')))}% · {meses.length} months</span>
      </div>
      <div className="tend-grafico" data-reveal role="group" aria-label="Observed and predicted chlorophyll anomaly in 2026">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={grafico} margin={{ top: 10, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid stroke="var(--linea)" strokeOpacity={0.4} strokeDasharray="2 5" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: 'var(--niebla)', fontSize: 12 }} />
            <YAxis tick={{ fill: 'var(--niebla)', fontSize: 12 }} tickFormatter={(v: number) => `${v}%`} />
            <ReferenceLine y={0} stroke="var(--niebla)" />
            <Tooltip contentStyle={TOOLTIP} formatter={(v) => [`${signo(Number(v))}${nf(1).format(Math.abs(Number(v)))}%`, undefined]} />
            <Legend />
            <Line dataKey="observada" name="Observed" stroke="var(--fito)" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
            <Line dataKey="predicha" name="Predicted" stroke="var(--hielo)" strokeDasharray="6 4" strokeWidth={1.8} dot={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <p className="monitor-aviso"><strong>Limits:</strong> the model predicts monthly anomalies of chlorophyll, not El Niño itself. The 2026 check has only seven months and uses the El Niño 1+2 value of each month. In Ilo the model misses the drop (observed about −45%, predicted about −8%). Chlorophyll comes from OC-CCI (ESA) and El Niño 1+2 from NOAA PSL.</p>
    </section>
  )
}
