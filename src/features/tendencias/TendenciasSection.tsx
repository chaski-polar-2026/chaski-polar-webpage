import { crearEvidencia } from './evidencia'
import { Robustez, FichaEvidencia } from './FichaEvidencia'
import { useEffect, useMemo, useState, useRef } from 'react'
import { CartesianGrid, ComposedChart, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useData } from '../../contexts/DataContext'
import { promediosAnuales, sensibilidadInicio, tendencia, type Estacion } from '../../lib/tendencias'
import { leerRonda, mesesRonda, sinExtremos, VARIABLES_RONDA, type Ronda, type VariableRonda } from './ronda'
import './tendencias.css'
import InfoTip from '../../components/ui/InfoTip'

type Variable = 'chl' | 'sst' | VariableRonda
type Fuente = 'occci' | 'modis' | 'crw'
type Largas = {
  sst_crw: { inicio: string; zonas: Record<string, (number | null)[]> }
  chl_modis: Record<string, { inicio: string; valores: (number | null)[] }>
}

const ZONAS: { id: string; nombre: string }[] = [
  { id: 'paita', nombre: 'Paita–Sechura (north Peru)' },
  { id: 'chimbote', nombre: 'Chimbote (north-central Peru)' },
  { id: 'callao', nombre: 'Callao (central Peru)' },
  { id: 'pisco', nombre: 'Pisco (south-central Peru)' },
  { id: 'ilo', nombre: 'Ilo (south Peru)' },
  { id: 'rey_jorge', nombre: 'King George Island (Antarctica)' },
  { id: 'peninsula_antartica', nombre: 'Antarctic Peninsula' },
]
const FUENTES: Record<Fuente, string> = {
  occci: 'OC-CCI v6 (ESA), 1998–2025',
  modis: 'MODIS-Aqua (NASA, via Giovanni), 2002–2025',
  crw: 'Coral Reef Watch v3.1 (NOAA), 1986–2025',
}
const ESTACIONES: Record<Estacion, string> = { year: 'Whole year', summer: 'Summer (Dec–Mar)', winter: 'Winter (Jun–Sep)' }
const ZONAS_LARGAS = [{ id: 'norte_centro', nombre: 'North-central Peru' }, { id: 'costa_sur', nombre: 'South Peru' }]
const NOMBRES: Record<Variable, string> = {
  chl: 'Chlorophyll-a (phytoplankton)', sst: 'Sea surface temperature',
  temp100: 'Temperature at 100–200 m', sealevel: 'Sea level anomaly', oxy100: 'Dissolved oxygen at 100–200 m',
  seaice: 'Antarctic sea-ice extent', sst_long: 'Sea surface temperature, long record (ERSST)',
}
const PRIMER_ANIO: Record<Variable, number> = { chl: 1998, sst: 1986, temp100: 1998, sealevel: 1998, oxy100: 1998, seaice: 1979, sst_long: 1900 }
const UNIDAD: Record<Variable, string> = { chl: 'mg/m³', sst: '°C', temp100: '°C', sealevel: 'm', oxy100: 'mmol/m³', seaice: 'million km²', sst_long: '°C' }
const DEFINICION: Record<Variable, string> = {
  chl: 'Chlorophyll-a is the pigment of phytoplankton. Satellites estimate it from the color of the water: more chlorophyll means more microscopic algae.',
  sst: 'Sea surface temperature measured from space. A warmer surface can change currents, nutrients and the life that depends on them.',
  temp100: 'The average water temperature between 100 and 200 metres below the surface. It describes conditions deeper than satellites can see directly.',
  sealevel: 'Sea level anomaly is how high or low the sea surface is compared with a reference level. It can vary with warming, winds and ocean circulation.',
  oxy100: 'The oxygen dissolved in seawater between 100 and 200 metres deep. Marine animals need this oxygen to breathe.',
  seaice: 'The area of ocean around Antarctica with at least 15% sea-ice cover. It describes floating sea ice, not ice resting on land.',
  sst_long: 'A long record of sea surface temperature built from observations, with gaps filled using a statistical reconstruction. It lets you compare recent warming with changes over more than a century.',
}
const ANIO_FINAL = 2025

type Ejemplo = { titulo: string; resumen: string; variable: Variable; zona: string; fuente?: Fuente; inicio: number; fin: number; estacion: Estacion; alternativa?: { titulo: string; inicio: number } }
const EJEMPLOS: Ejemplo[] = [
  { titulo: 'Peruvian chlorophyll: not significant', resumen: 'Chimbote since 1998', variable: 'chl', zona: 'chimbote', fuente: 'occci', inicio: 1998, fin: ANIO_FINAL, estacion: 'year' },
  { titulo: 'Antarctic warming, 1998–2025', resumen: 'King George Island: a significant trend', variable: 'sst', zona: 'rey_jorge', fuente: 'crw', inicio: 1998, fin: ANIO_FINAL, estacion: 'year' },
  { titulo: 'The same series since 1986', resumen: 'The trend disappears with a longer record', variable: 'sst', zona: 'rey_jorge', fuente: 'crw', inicio: 1986, fin: ANIO_FINAL, estacion: 'year' },
  { titulo: 'Sea level rises in every period', resumen: 'Humboldt region, 1998–2025. Change the start year to check.', variable: 'sealevel', zona: '', inicio: 1998, fin: ANIO_FINAL, estacion: 'year' },
  { titulo: 'Antarctic sea ice: falling or flat?', resumen: 'A decline in 1998–2025; not significant over 1979–2025.', variable: 'seaice', zona: '', inicio: 1998, fin: ANIO_FINAL, estacion: 'year', alternativa: { titulo: 'Compare 1979–2025', inicio: 1979 } },
  { titulo: 'Warming since 1900 vs since 1979', resumen: 'North-central Peru: significant since 1900, not since 1979.', variable: 'sst_long', zona: 'norte_centro', inicio: 1900, fin: ANIO_FINAL, estacion: 'year', alternativa: { titulo: 'Compare 1979–2025', inicio: 1979 } },
]

const nf = (d: number) => new Intl.NumberFormat('en', { maximumFractionDigits: d, minimumFractionDigits: d })
const signo = (x: number) => (x > 0 ? '+' : x < 0 ? '−' : '')
const textoP = (p: number) => (p < 0.001 ? 'p < 0.001' : `p = ${nf(3).format(p)}`)

/** Panel de tendencias: elegir variable, región y periodo, y comprobar si el cambio es estadísticamente significativo */
export default function TendenciasSection() {
  const { monitor } = useData()
  const [largas, setLargas] = useState<Largas | null>(null)
  const [ronda, setRonda] = useState<Ronda | null>(null)
  const [estadoRonda, setEstadoRonda] = useState<'loading' | 'ready' | 'error'>('loading')
  const [intentoRonda, setIntentoRonda] = useState(0)
  const [variable, setVariable] = useState<Variable>('chl')
  const [zona, setZona] = useState('chimbote')
  const [fuente, setFuente] = useState<Fuente>('occci')
  const [inicio, setInicio] = useState(1998)
  const [fin, setFin] = useState(ANIO_FINAL)
  const [estacion, setEstacion] = useState<Estacion>('year')
  const [comparar, setComparar] = useState(false)
  const [excluirExtremos, setExcluirExtremos] = useState(false)
  const [guiado, setGuiado] = useState(false)
  const [paso, setPaso] = useState(0)
  const [error, setError] = useState(false)
  const [intento, setIntento] = useState(0)
  const pregunta = useRef<HTMLHeadingElement>(null)

  useEffect(() => { if (guiado) pregunta.current?.focus() }, [paso, guiado])
  useEffect(() => {
    const leer = () => {
      const q = new URLSearchParams(location.search)
      if (q.get('trend') === 'antarctic') aplicar(EJEMPLOS[1]!)
      if (q.get('trend') === 'long-record') aplicar(EJEMPLOS[2]!)
    }
    leer()
    addEventListener('popstate', leer)
    return () => removeEventListener('popstate', leer)
  }, [])

  useEffect(() => {
    let vivo = true
    fetch('/assets/data/tendencias-largas.json').then((r) => { if (!r.ok) throw new Error('data'); return r.json() }).then((d: Largas) => { if (vivo) { setLargas(d); setError(false) } }).catch(() => { if (vivo) setError(true) })
    return () => { vivo = false }
  }, [intento])

  useEffect(() => {
    let vivo = true
    setEstadoRonda('loading')
    fetch('/assets/data/tendencias-ronda.json')
      .then((r) => { if (!r.ok) throw new Error('data'); return r.json() })
      .then((d: unknown) => leerRonda(d))
      .then((d) => { if (vivo) { setRonda(d); setEstadoRonda('ready') } })
      .catch(() => { if (vivo) { setRonda(null); setEstadoRonda('error') } })
    return () => { vivo = false }
  }, [intentoRonda])

  const esRonda = variable !== 'chl' && variable !== 'sst'
  const serieRonda = esRonda ? ronda?.series[variable] : undefined
  const zonasDisponibles = variable === 'sst_long' ? ZONAS_LARGAS : ZONAS
  const zonaActiva = zonasDisponibles.some((z) => z.id === zona) ? zona : variable === 'sst_long' ? 'norte_centro' : 'chimbote'
  const tieneZonas = variable === 'chl' || variable === 'sst' || variable === 'sst_long'
  const alcance = variable === 'seaice' ? 'Antarctica' : serieRonda?.alcance ?? 'Humboldt region (Peru coast)'
  const fuentesDisponibles: Fuente[] = variable === 'sst' ? ['crw'] : variable !== 'chl' ? [] : ['chimbote', 'paita'].includes(zonaActiva) ? ['occci', 'modis'] : ['occci']
  const fuenteActiva: Fuente = fuentesDisponibles.includes(fuente) ? fuente : fuentesDisponibles[0] ?? 'occci'
  const fuenteTexto = esRonda ? serieRonda?.fuente ?? (estadoRonda === 'error' ? 'Data source unavailable' : 'Loading data source…') : FUENTES[fuenteActiva]
  const nombreVariable = serieRonda?.nombre ?? NOMBRES[variable]
  const unidad = serieRonda?.unidad ?? UNIDAD[variable]
  const datosListos = !esRonda || estadoRonda === 'ready'

  /** serie mensual completa de la fuente, antes de recortar el periodo */
  const mensual = useMemo(() => {
    if (esRonda) return serieRonda ? mesesRonda(serieRonda.inicio, variable === 'sst_long' ? serieRonda.zonas?.[zonaActiva] ?? [] : serieRonda.valores ?? []) : []
    if (fuenteActiva === 'occci') {
      return (monitor?.records ?? []).map((r) => ({ mes: r.date.slice(0, 7), valor: typeof r[`chl_${zonaActiva}_mg_m3`] === 'number' ? (r[`chl_${zonaActiva}_mg_m3`] as number) : null }))
    }
    if (!largas) return []
    const [serie, ini] = fuenteActiva === 'crw'
      ? [largas.sst_crw.zonas[zonaActiva] ?? [], largas.sst_crw.inicio]
      : [largas.chl_modis[zonaActiva]?.valores ?? [], largas.chl_modis[zonaActiva]?.inicio ?? '2002-07']
    let a = Number(ini.slice(0, 4)), m = Number(ini.slice(5, 7))
    return serie.map((valor) => {
      const mes = `${a}-${String(m).padStart(2, '0')}`
      if (++m > 12) { m = 1; a++ }
      return { mes, valor }
    })
  }, [monitor, largas, zonaActiva, fuenteActiva, esRonda, serieRonda, variable])

  const anuales = useMemo(() => promediosAnuales(mensual, estacion).filter((p) => p.x <= ANIO_FINAL), [mensual, estacion])
  const todos = useMemo(() => sinExtremos(anuales, excluirExtremos), [anuales, excluirExtremos])
  const primero = anuales[0]?.x ?? PRIMER_ANIO[variable]
  const ultimo = anuales[anuales.length - 1]?.x ?? ANIO_FINAL
  const ini = Math.max(primero, Math.min(inicio, ultimo))
  const fi = Math.min(ultimo, Math.max(fin, ini))
  const puntos = useMemo(() => todos.filter((p) => p.x >= ini && p.x <= fi), [todos, ini, fi])
  const res = useMemo(() => tendencia(puntos), [puntos])
  const nombreZona = tieneZonas ? zonasDisponibles.find(z => z.id === zonaActiva)!.nombre : alcance
  const cobertura = mensual.length ? `${mensual[0]!.mes} to ${mensual.at(-1)!.mes}` : 'Not available'
  const tipoDatos = serieRonda?.tipo === 'reanalysis' ? 'Reanalysis' : serieRonda?.tipo === 'observation-based reconstruction' ? 'Reconstruction from observations' : 'Satellite product'
  const evidencia = useMemo(() => crearEvidencia(anuales, {variable:nombreVariable,zone:nombreZona,unit:unidad,source:fuenteTexto,dataType:tipoDatos,coverage:cobertura,start:ini,end:fi,season:estacion,seasonLabel:ESTACIONES[estacion],exclude:excluirExtremos}), [anuales,nombreVariable,nombreZona,unidad,fuenteTexto,tipoDatos,cobertura,ini,fi,estacion,excluirExtremos])
  const puedeComparar = variable === 'chl' && fuentesDisponibles.length === 2
  const otraFuente: Fuente = fuenteActiva === 'occci' ? 'modis' : 'occci'
  const otros = useMemo(() => {
    if (!comparar || !puedeComparar || !largas) return []
    const datos = otraFuente === 'occci'
      ? (monitor?.records ?? []).map((r) => ({ mes: r.date.slice(0, 7), valor: typeof r[`chl_${zonaActiva}_mg_m3`] === 'number' ? r[`chl_${zonaActiva}_mg_m3`] as number : null }))
      : (largas.chl_modis[zonaActiva]?.valores ?? []).map((valor, i) => {
        const inicio = largas.chl_modis[zonaActiva]!.inicio
        const fecha = new Date(Date.UTC(Number(inicio.slice(0, 4)), Number(inicio.slice(5, 7)) - 1 + i, 1))
        return { mes: fecha.toISOString().slice(0, 7), valor }
      })
    return sinExtremos(promediosAnuales(datos, estacion), excluirExtremos).filter((p) => p.x >= ini && p.x <= fi)
  }, [comparar, puedeComparar, largas, otraFuente, monitor, zonaActiva, estacion, ini, fi, excluirExtremos])
  // Ambas fuentes se prueban en los mismos años con dato, sin interpolar huecos.
  const comunes = puntos.filter((p) => otros.some((o) => o.x === p.x))
  const resComun = tendencia(comunes)
  const resOtra = tendencia(otros.filter((p) => comunes.some((o) => o.x === p.x)))
  const sens = useMemo(() => sensibilidadInicio(todos.filter((p) => p.x <= fi)), [todos, fi])
  const anios = Array.from({ length: ultimo - primero + 1 }, (_, i) => primero + i)

  const media = puntos.length ? puntos.reduce((a, p) => a + p.y, 0) / puntos.length : 0
  const dec = esRonda ? 4 : variable === 'chl' ? 3 : 2
  const datosGrafico = puntos.map((p) => ({ x: p.x, valor: p.y, otra: otros.find((o) => o.x === p.x)?.y, sen: res ? res.intercepto + res.pendiente * p.x : undefined }))
  const significativa = res !== null && res.p < 0.05
  const nSig = sens.filter((s) => s.p < 0.05).length
  const cambiaSigno = res !== null && sens.some((s) => Math.sign(s.pendiente) !== Math.sign(res.pendiente))
  const frases: string[] = []
  if (res && sens.length) {
    if (significativa && nSig < sens.length) frases.push(`Starting in other years the result changes: the trend is significant in ${nSig} of ${sens.length} possible start years.`)
    if (!significativa && nSig > 0) frases.push(`Starting in other years the trend is significant in ${nSig} of ${sens.length} cases: the result depends on the period you choose.`)
    if (cambiaSigno) frases.push('For some start years the direction of the trend even reverses.')
    if (!frases.length) frases.push(significativa ? 'The trend stays significant whatever start year you choose.' : 'No start year makes the trend significant.')
  }

  const aplicar = (e: Ejemplo) => { setVariable(e.variable); setZona(e.zona); setFuente(e.fuente ?? 'occci'); setInicio(e.inicio); setFin(e.fin); setEstacion(e.estacion); setExcluirExtremos(false); if (e.variable !== 'chl' && e.variable !== 'sst') setComparar(false) }
  const cambiarVariable = (v: Variable) => { setVariable(v); setFuente(v === 'sst' ? 'crw' : 'occci'); setInicio(v === 'sst' ? 1998 : PRIMER_ANIO[v]); if (v !== 'chl' && v !== 'sst') setFin(ANIO_FINAL) }

  return (
    <section className="seccion tendencias" id="trends" aria-labelledby="t-tendencias" aria-busy={esRonda && estadoRonda === 'loading'}>
      <p className="puente-kicker">Be a trend detective</p>
      <h2 id="t-tendencias">Is the change real? Test a trend yourself</h2>
      <p className="nota">Pick a variable, a place and a period. The panel draws the yearly averages and runs the Mann-Kendall test<InfoTip term="Mann–Kendall">A test for whether a series tends to rise or fall.</InfoTip>, which asks whether the values tend to rise or fall consistently. A p-value below 0.05 is the usual standard for a significant trend.</p>
      <div className="tend-modos" role="group" aria-label="Exploration mode">
        <button className="btn" aria-pressed={!guiado} onClick={() => setGuiado(false)}>Explore freely</button>
        <button className="btn" aria-pressed={guiado} onClick={() => { setGuiado(true); setPaso(0) }}>Guide me with questions</button>
        <a href="#trend-glossary">What do these terms mean?</a>
      </div>
      {guiado && <div className="tend-asistente">
        <p className="tend-nota">Step {paso + 1} of 3</p>
        <h3 ref={pregunta} tabIndex={-1}>{['What do you want to look into?', 'Where?', 'Over which years?'][paso]}</h3>
        {paso === 0 && <div className="tend-modos">{(Object.keys(NOMBRES) as Variable[]).map((v) => <button className="btn" key={v} onClick={() => { cambiarVariable(v); setPaso(1) }}>{NOMBRES[v]}</button>)}</div>}
        {paso === 1 && <div className="tend-modos">{tieneZonas ? zonasDisponibles.map((z) => <button className="btn" key={z.id} onClick={() => { setZona(z.id); setPaso(2) }}>{z.nombre}</button>) : <button className="btn" onClick={() => setPaso(2)}>{alcance}</button>}</div>}
        {paso === 2 && <div className="tend-modos"><button className="btn" onClick={() => { setInicio(primero); setFin(2025); setEstacion('year'); setGuiado(false) }}>Full available record</button><button className="btn" onClick={() => { setInicio(1998); setFin(2025); setEstacion('year'); setGuiado(false) }}>1998–2025</button></div>}
        {paso > 0 && <button className="btn" onClick={() => setPaso(paso - 1)}>Back</button>}
      </div>}
      {error && !esRonda && <p role="alert">Long-record data could not be loaded. <button className="btn" onClick={() => setIntento(intento + 1)}>Retry data loading</button></p>}

      <div className="tend-ejemplos" role="group" aria-label="Guided examples">
        {EJEMPLOS.map((e) => (
          <div key={e.titulo} className="tend-ejemplo" role="group" aria-label={e.titulo}>
            <button type="button" className="btn" onClick={() => aplicar(e)}><b>{e.titulo}</b><span>{e.resumen}</span></button>
            {e.alternativa && <button type="button" className="btn tend-alternativa" onClick={() => aplicar({ ...e, inicio: e.alternativa!.inicio })}>{e.alternativa.titulo}</button>}
          </div>
        ))}
      </div>

      <div className="tend-controles">
        <label>Variable
          <select value={variable} onChange={(ev) => cambiarVariable(ev.target.value as Variable)}>
            {(Object.keys(NOMBRES) as Variable[]).map((v) => <option key={v} value={v}>{NOMBRES[v]}</option>)}
          </select>
        </label>
        {tieneZonas ? <label>Region
          <select value={zonaActiva} onChange={(ev) => setZona(ev.target.value)}>
            {zonasDisponibles.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
          </select>
        </label> : <div className="tend-campo"><span>Region</span><p>{alcance}</p></div>}
        {!esRonda ? <label>Data source
          <select value={fuenteActiva} onChange={(ev) => setFuente(ev.target.value as Fuente)} disabled={fuentesDisponibles.length < 2}>
            {fuentesDisponibles.map((f) => <option key={f} value={f}>{FUENTES[f]}</option>)}
          </select>
        </label> : <div className="tend-campo"><span>Data source</span><p>{fuenteTexto}</p></div>}
        <label>From
          <select value={ini} onChange={(ev) => { setInicio(Number(ev.target.value)); if (Number(ev.target.value) > fin) setFin(Number(ev.target.value)) }}>{anios.map((a) => <option key={a}>{a}</option>)}</select>
        </label>
        <label>To
          <select value={fi} onChange={(ev) => setFin(Number(ev.target.value))}>{anios.filter((a) => a >= ini).map((a) => <option key={a}>{a}</option>)}</select>
        </label>
        <label>Season
          <select value={estacion} onChange={(ev) => setEstacion(ev.target.value as Estacion)}>
            {(Object.keys(ESTACIONES) as Estacion[]).map((k) => <option key={k} value={k}>{ESTACIONES[k]}</option>)}
          </select>
        </label>
      </div>
      <h3 className="tend-variable">{nombreVariable} <span>({unidad})</span></h3>
      <p className="tend-def">{DEFINICION[variable]}</p>
      {serieRonda?.tipo === 'reanalysis' && <p className="tend-tipo">Reanalysis (model-based), not a direct observation</p>}
      {serieRonda?.tipo === 'observation-based reconstruction' && <p className="tend-tipo">Reconstruction from observations</p>}
      <label className="tend-comparar"><input type="checkbox" checked={excluirExtremos} onChange={(e) => setExcluirExtremos(e.target.checked)} /> Exclude extreme El Niño years (1998, 2016, 2023)</label>
      {puedeComparar && <label className="tend-comparar"><input type="checkbox" checked={comparar} onChange={(e) => setComparar(e.target.checked)} /> Compare ESA OC-CCI and NASA MODIS-Aqua</label>}
      {excluirExtremos && <p className="tend-nota tend-exclusion">Years 1998, 2016 and 2023 are excluded from the trend, source comparison and period sensitivity calculations.</p>}
      {esRonda && estadoRonda === 'loading' && <p role="status" className="tend-nota">Loading extended trend data…</p>}
      {esRonda && estadoRonda === 'error' && <p role="alert" className="tend-error">Extended trend data could not be loaded. <button type="button" className="btn" onClick={() => setIntentoRonda(intentoRonda + 1)}>Retry extended data loading</button></p>}

      {datosListos && (res === null ? <p className="monitor-aviso">Not enough years in this period: at least 8 yearly values are needed.</p> : <>
        <div className="tend-veredicto" role="status">
          <b>{significativa ? 'Significant trend' : 'Not significant'}</b>
          <span>
            {signo(res.pendiente)}{nf(dec).format(Math.abs(res.pendiente * 10))} {unidad} per decade
            {variable === 'chl' && media > 0 ? ` (${signo(res.pendiente)}${nf(1).format(Math.abs((res.pendiente * 10 * 100) / media))}% of the mean)` : ''}
            {' · '}Mann-Kendall {textoP(res.p)} · {res.n} years
          </span>
        </div>
        <dl className="tend-estadisticas">
          <div><dt>Sen slope · 95% confidence interval</dt><dd>{nf(dec).format(res.intervalo95[0] * 10)} to {nf(dec).format(res.intervalo95[1] * 10)} {unidad}/decade</dd></div>
          <div><dt>Linear regression · two-sided t-test</dt><dd>{textoP(res.pLineal)}</dd></div>
        </dl>
        {!significativa && <p className="tend-nota">The evidence is insufficient to establish a consistent trend in this period. This does not prove that no change exists.</p>}

        <Robustez e={evidencia} />
        <p className="tend-nota">{variable === 'chl' ? 'Green' : 'Orange'}: yearly mean · Dashed white: Sen trend line. {ini}–{fi}, {unidad}.</p>
        <div className="tend-grafico" role="group" aria-label={`Yearly averages of ${nombreVariable} with the trend line`}>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={datosGrafico} margin={{ top: 10, right: 16, bottom: 4, left: 0 }}>
              <CartesianGrid stroke="rgba(163,188,203,.16)" />
              <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} tick={{ fill: '#a3bccb', fontSize: 12 }} allowDecimals={false} />
              <YAxis tick={{ fill: '#a3bccb', fontSize: 12 }} domain={['auto', 'auto']} tickFormatter={(v: number) => nf(variable === 'chl' || variable === 'sealevel' ? 2 : 1).format(v)} label={{ value: unidad, angle: -90, position: 'insideLeft', fill: '#a3bccb', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#071e33', border: '1px solid #385367', borderRadius: 6, boxShadow: 'none' }} labelStyle={{ color: '#eaf3f5' }} formatter={(v, n) => [`${nf(dec).format(Number(v))} ${unidad}`, n === 'valor' ? fuenteTexto : n === 'otra' ? FUENTES[otraFuente] : 'Trend line (Sen)']} />
              <Line dataKey="valor" stroke={variable === 'chl' ? '#3fc28c' : '#f08a4b'} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
              <Line dataKey="sen" stroke="#eaf3f5" strokeDasharray="6 4" strokeWidth={1.6} dot={false} isAnimationActive={false} />
              {comparar && puedeComparar && <Line dataKey="otra" stroke="#63cde8" strokeDasharray="3 3" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} />}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <details className="tend-data-table"><summary>View chart values</summary><div className="tabla-envoltura"><table><caption>{fuenteTexto} · {unidad}</caption><thead><tr><th scope="col">Year</th><th scope="col">Yearly mean</th><th scope="col">Unit</th><th scope="col">Sen line</th>{comparar && puedeComparar && <th scope="col">{FUENTES[otraFuente]}</th>}</tr></thead><tbody>{datosGrafico.map((p) => <tr key={p.x}><th scope="row">{p.x}</th><td>{p.valor}</td><td>{unidad}</td><td>{p.sen == null ? 'Not available' : nf(dec).format(p.sen)}</td>{comparar && puedeComparar && <td>{p.otra == null ? 'Not available' : nf(dec).format(p.otra)}</td>}</tr>)}</tbody></table></div></details>
        <FichaEvidencia e={evidencia} />
        {comparar && puedeComparar && <div className="tend-comparacion">
          <p>Solid green: {FUENTES[fuenteActiva]}. Dotted blue: {FUENTES[otraFuente]}. Dashed white: selected source’s Sen line. Tests below use only shared years; the chart retains all available yearly means.</p>
          <div className="tend-estadisticas">{[[fuenteActiva, resComun], [otraFuente, resOtra]].map(([f, r]) => {
            const t = r as ReturnType<typeof tendencia>
            return <article key={String(f)}><h3>{FUENTES[f as Fuente]}</h3>{t ? <><p>{comunes[0]?.x}–{comunes.at(-1)?.x} · {t.n} shared years</p><p>{t.p < .05 ? 'Significant trend' : 'Not significant'} · {nf(dec).format(t.pendiente * 10)} {unidad}/decade</p><p>Mann-Kendall {textoP(t.p)}<br />Regression t-test {textoP(t.pLineal)}<br />95% CI: {nf(dec).format(t.intervalo95[0] * 10)} to {nf(dec).format(t.intervalo95[1] * 10)}</p></> : <p>At least 8 shared years are needed.</p>}</article>
          })}</div>
        </div>}

        {sens.length > 0 && <div className="tend-sens">
          <h3>How much does the result depend on the start year?</h3>
          {frases.map((f) => <p key={f} className="tend-nota">{f}</p>)}
          <p className="tend-nota"><a href="#hallazgos">Read the findings on period and source sensitivity</a>. Significance in one period does not establish a robust long-term change.</p>
          <p className="tend-nota">A trend is only credible if it holds up when the period changes.</p>
          <div className="tend-sens-graficos">
            <figure>
              <figcaption>Trend per decade, by start year</figcaption>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={sens.map((s) => ({ x: s.inicio, v: s.pendiente * 10 }))} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="rgba(163,188,203,.16)" />
                  <XAxis dataKey="x" tick={{ fill: '#a3bccb', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#a3bccb', fontSize: 11 }} tickFormatter={(v: number) => nf(2).format(v)} />
                  <ReferenceLine y={0} stroke="#a3bccb" />
                  <Tooltip contentStyle={{ background: '#071e33', border: '1px solid #385367', borderRadius: 6, boxShadow: 'none' }} formatter={(v) => [`${nf(dec).format(Number(v))} ${unidad}/decade`, 'Trend']} labelFormatter={(l) => `Start: ${l}`} />
                  <Line dataKey="v" stroke="#9fe0f2" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </figure>
            <figure>
              <figcaption>p-value, by start year (below the line = significant)</figcaption>
              <ResponsiveContainer width="100%" height={170}>
                <LineChart data={sens.map((s) => ({ x: s.inicio, v: s.p }))} margin={{ top: 6, right: 12, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="rgba(163,188,203,.16)" />
                  <XAxis dataKey="x" tick={{ fill: '#a3bccb', fontSize: 11 }} />
                  <YAxis domain={[0, 1]} tick={{ fill: '#a3bccb', fontSize: 11 }} />
                  <ReferenceLine y={0.05} stroke="#f08a4b" strokeDasharray="5 4" label={{ value: '0.05', fill: '#f08a4b', fontSize: 11, position: 'insideTopRight' }} />
                  <Tooltip contentStyle={{ background: '#071e33', border: '1px solid #385367', borderRadius: 6, boxShadow: 'none' }} formatter={(v) => [nf(3).format(Number(v)), 'p-value']} labelFormatter={(l) => `Start: ${l}`} />
                  <Line dataKey="v" stroke="#3fc28c" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </figure>
          </div>
          <details className="tend-data-table tend-sens-tabla"><summary>View period sensitivity as a table</summary><div className="tabla-envoltura"><table><caption>Start year sensitivity · ending in {fi}{excluirExtremos ? ' · extreme El Niño years excluded' : ''}</caption><thead><tr><th scope="col">From</th><th scope="col">Years</th><th scope="col">Sen slope / decade</th><th scope="col">p-value</th></tr></thead><tbody>{sens.map((s) => <tr key={s.inicio}><th scope="row">{s.inicio}</th><td>{s.n}</td><td>{nf(dec).format(s.pendiente * 10)} {unidad}</td><td>{textoP(s.p)}</td></tr>)}</tbody></table></div></details>
        </div>}
      </>)}
      {datosListos && res === null && <><Robustez e={evidencia} /><FichaEvidencia e={evidencia} /></>}
      <p className="monitor-aviso"><strong>How to read it:</strong> the test uses yearly averages (a year counts only with enough months of data) and looks for a consistent rise or fall, not a straight line. The trend is the Theil–Sen slope. Records differ in length, so a result can change with the period or a different data product. Source: {fuenteTexto}.</p>
      <p className="tend-nota">Whole-year averages require at least 6 valid months; seasonal averages require 3 of 4 months. December belongs to its calendar year. These exploratory tests assume independent yearly observations and are not corrected for multiple comparisons. The regression t-test assumes independent, normally distributed residuals. Neither test establishes causation.</p>
      <details className="tend-fuentes"><summary>Data sources for this panel</summary><dl>
        {(Object.entries(FUENTES)).map(([id, texto]) => <div key={id}><dt>{id === 'crw' ? 'Sea surface temperature' : 'Chlorophyll-a'}</dt><dd>{texto}</dd></div>)}
        {ronda ? VARIABLES_RONDA.map((id) => <div key={id}><dt>{ronda.series[id].nombre}</dt><dd>{ronda.series[id].fuente}</dd></div>) : <div><dt>Extended records</dt><dd>{estadoRonda === 'error' ? 'Extended trend data could not be loaded.' : 'Loading data sources…'}</dd></div>}
      </dl></details>
      <details className="tend-glosario" id="trend-glossary"><summary>Glossary · understand the result</summary><dl>
        <dt>Chlorophyll-a</dt><dd>The pigment used by phytoplankton to capture light. Satellite water color provides an estimate of its concentration.</dd>
        <dt>Sea surface temperature</dt><dd>The temperature of the ocean’s upper layer, measured here by satellite.</dd>
        <dt>Mann-Kendall</dt><dd>A test of whether values consistently rise or fall over time, without assuming a straight-line relationship.</dd>
        <dt>Sen slope</dt><dd>The median slope between all pairs of yearly observations. Its 95% confidence interval describes uncertainty under the test’s assumptions.</dd>
        <dt>p-value</dt><dd>The probability of a result at least as extreme as observed if the no-trend hypothesis and the test’s assumptions hold. It is not the probability that the hypothesis is true.</dd>
      </dl></details>
    </section>
  )
}
