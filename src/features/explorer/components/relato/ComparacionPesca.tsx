import { Frase, Guia } from '../../../lectura/PanelLectura'
import { leerComparacion } from '../../../lectura/lectura'
import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { media, pendiente } from '../../../../lib/estadistica'
import { nf } from '../../../../lib/formato'
import { useExplorer } from '../../ExplorerContext'
import { useAcciones } from '../../hooks/useAcciones'
import { esPeru } from '../../lib/modelo'
import type { IdZona } from '../../lib/tipos'
import { variablePorId } from '../../lib/variables'
import { useExplorerStore } from '../../store'

const MESES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const OPCIONES = [
  { id: 'temperatura_superficial_C', nombre: 'Sea surface temperature', ayuda: 'Shows warmer or cooler surface water, not conditions at fishing depth.' },
  { id: 'clorofila_mg_m3', nombre: 'Chlorophyll', ayuda: 'Phytoplankton pigment, at the base of the food web. More chlorophyll does not guarantee more fish.' },
  { id: 'salinidad_psu', nombre: 'Salinity', ayuda: 'How salty surface water is. Helps describe differences between water masses.' },
  { id: 'nivel_mar_anomalia_m', nombre: 'Sea level', ayuda: 'Anomaly relative to the product reference, not tide height or water depth for a boat.' },
] as const
const MODOS = [
  { id: 'anios', nombre: 'Across years', pregunta: 'What changed between years?', ayuda: 'Same zone and month, different years.' },
  { id: 'meses', nombre: 'Across months', pregunta: 'How does the year usually vary?', ayuda: 'Historical averages for two months.' },
  { id: 'zonas', nombre: 'Across zones', pregunta: 'How did two zones differ?', ayuda: 'Same date, different zones.' },
] as const
type Modo = typeof MODOS[number]['id']
type Seleccion = { zona: IdZona; anio: number; mes: number }

export default function ComparacionPesca() {
  const { modelo } = useExplorer()
  const acciones = useAcciones()
  const panel = useExplorerStore((s) => s.panel)
  const month = useExplorerStore((s) => s.month)
  const zonas = modelo.ids.filter(esPeru)
  const inicial = panel.tipo === 'zona' && esPeru(panel.z) ? panel.z : zonas[1] ?? zonas[0]!
  const [modo, setModo] = useState<Modo>('anios')
  const [zona, setZona] = useState<IdZona>(inicial)
  const [otraZona, setOtraZona] = useState<IdZona>(zonas.find((z) => z !== inicial) ?? inicial)
  const [parametro, setParametro] = useState<string>('temperatura_superficial_C')
  const [mes, setMes] = useState(modelo.mes(month).mes)
  const [otroMes, setOtroMes] = useState((modelo.mes(month).mes + 6) % 12)
  const ultimoAnio = modelo.mes(modelo.ultimoObservado).anio
  const [anioA, setAnioA] = useState(Math.min(2017, ultimoAnio))
  const [anioB, setAnioB] = useState(Math.min(2023, ultimoAnio))
  const opcion = OPCIONES.find((o) => o.id === parametro)!
  const recorrido = MODOS.find((m) => m.id === modo)!
  const anios = Array.from({ length: Math.max(0, ultimoAnio - 1998 + 1) }, (_, i) => 1998 + i)
  const historicos = anios.filter((y) => y <= 2025)
  const a: Seleccion = { zona, anio: modo === 'zonas' ? anioB : anioA, mes }
  const b: Seleccion = { zona: modo === 'zonas' ? otraZona : zona, anio: anioB, mes: modo === 'meses' ? otroMes : mes }
  const valor = (s: Seleccion, id = parametro) => {
    const v = variablePorId(id), i = modelo.idxMes(s.anio, s.mes)
    // Nunca utilizar escenarios ni rellenar huecos en una comparación histórica.
    if (i < modelo.i0 || i > modelo.ultimoObservado || modelo.esEscenario(i)) return null
    const x = modelo.valorZona(s.zona, v, i)
    return x == null || !Number.isFinite(x) ? null : x * (v.factor ?? 1)
  }
  const comparar = (id: string) => {
    const comunes = historicos.filter((anio) => valor({ ...a, anio }, id) != null && valor({ ...b, anio }, id) != null)
    return {
      a: modo === 'meses' ? media(comunes.map((anio) => valor({ ...a, anio }, id))) : valor(a, id),
      b: modo === 'meses' ? media(comunes.map((anio) => valor({ ...b, anio }, id))) : valor(b, id),
      comunes,
    }
  }
  const resultado = comparar(parametro)
  const variable = variablePorId(parametro)
  // Mantener el orden del calendario aunque A y B se intercambien.
  const inicio = modo === 'meses' ? Math.min(mes, otroMes) : Math.min(anioA, anioB)
  const fin = modo === 'meses' ? Math.max(mes, otroMes) : Math.max(anioA, anioB)
  const serieComparacion = modo === 'zonas' ? [] : Array.from({ length: fin - inicio + 1 }, (_, i) => {
    const punto = inicio + i
    const valores = modo === 'meses' ? resultado.comunes.map((anio) => valor({ zona, anio, mes: punto })) : []
    return {
      punto,
      etiqueta: modo === 'meses' ? MESES[punto]! : String(punto),
      valor: modo === 'meses' ? media(valores) : valor({ zona, anio: punto, mes }),
      n: modo === 'meses' ? valores.filter((x) => x != null).length : null,
    }
  })
  const diferencia = resultado.a == null || resultado.b == null ? null : resultado.b - resultado.a
  const fmt = (x: number | null, id = parametro) => {
    const v = variablePorId(id)
    return x == null ? 'No data' : `${nf(v.dec).format(x)} ${v.unidad}`
  }
  const cambio = (x: number | null, y: number | null, id = parametro) => {
    if (x == null || y == null) return 'A value is missing.'
    const d = y - x, dec = variablePorId(id).dec
    if (Math.abs(d) < 0.5 * 10 ** -dec) return 'No difference at the displayed precision.'
    return `B is ${fmt(Math.abs(d), id)} ${d > 0 ? 'higher' : 'lower'} than A.`
  }
  const etiqueta = (s: Seleccion) => modo === 'meses' ? MESES[s.mes] : `${MESES[s.mes]} ${s.anio}`
  const referencia = (s: Seleccion) => {
    const registros = historicos.map((anio) => ({ anio, valor: valor({ ...s, anio }) })).filter((r) => r.valor != null)
    return { registros, promedio: media(registros.map((r) => r.valor)) }
  }
  const refA = referencia(a), refB = referencia(b)
  const periodo = (ys: number[]) => ys.length ? `${ys[0]}–${ys[ys.length - 1]} · ${ys.length} years with data` : 'No years with data'
  const tendencia = pendiente(refA.registros.map((r) => r.anio), refA.registros.map((r) => r.valor))
  const iguales = modo === 'anios' ? anioA === anioB : modo === 'meses' ? mes === otroMes : zona === otraZona
  const disponible = anios.filter((anio) => valor({ ...a, anio }) != null && (modo !== 'zonas' || valor({ ...b, anio }) != null))
  const verGlobo = (s: Seleccion) => {
    const i = modelo.idxMes(s.anio, s.mes)
    if (valor(s) == null || i < modelo.i0 || i > modelo.ultimo) return
    const st = useExplorerStore.getState()
    st.setPlaying(false)
    st.setSection('humboldt')
    st.setVariable(parametro)
    acciones.fijarMes(i)
    acciones.irAZona(s.zona)
  }
  const opcionesMes = MESES.map((m, i) => <option key={m} value={i}>{m}</option>)
  const opcionesAnio = anios.map((y) => <option key={y} value={y}>{y}</option>)
  const opcionesZona = zonas.map((z) => <option key={z} value={z}>{modelo.zona(z).nombre}</option>)

  return <div className="comparacion-pesca">
    <div className="comparacion-modos" role="group" aria-label="Comparison mode">
      {MODOS.map((m) => <button key={m.id} type="button" aria-pressed={modo === m.id} onClick={() => setModo(m.id)}>{m.nombre}</button>)}
    </div>
    <p className="comparacion-ayuda">{recorrido.ayuda}</p>
    <div className="comparacion-controles">
      <div className="comparacion-zonas comparacion-ancho">
        <label>{modo === 'zonas' ? 'Zone A' : 'Your zone'}<select value={zona} onChange={(e) => setZona(e.target.value as IdZona)}>{opcionesZona}</select></label>
        {modo === 'zonas' && <label>Zone B<select value={otraZona} onChange={(e) => setOtraZona(e.target.value as IdZona)}>{opcionesZona}</select></label>}
      </div>
      <label className="comparacion-ancho">Parameter<select value={parametro} aria-describedby="comparacion-parametro-ayuda" onChange={(e) => setParametro(e.target.value)}>{OPCIONES.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select></label>
      <label className={modo === 'anios' ? 'comparacion-ancho' : ''}>{modo === 'meses' ? 'Month A' : 'Month'}<select value={mes} onChange={(e) => setMes(Number(e.target.value))}>{opcionesMes}</select></label>
      {modo === 'meses' ? <label>Month B<select value={otroMes} onChange={(e) => setOtroMes(Number(e.target.value))}>{opcionesMes}</select></label> : <>
        {modo === 'anios' && <label>Year A<select value={anioA} onChange={(e) => setAnioA(Number(e.target.value))}>{opcionesAnio}</select></label>}
        <label>{modo === 'anios' ? 'Year B' : 'Year'}<select value={anioB} onChange={(e) => setAnioB(Number(e.target.value))}>{opcionesAnio}</select></label>
      </>}
    </div>
    <details className="comparacion-fuente comparacion-ayuda-parametro"><summary>About this parameter</summary><p id="comparacion-parametro-ayuda">{opcion.ayuda}</p></details>
    <div className="comparacion-atajos">
      {panel.tipo === 'zona' && esPeru(panel.z) && panel.z !== zona && <button type="button" onClick={() => setZona(panel.z)}>Use globe zone: {modelo.zona(panel.z).nombre}</button>}
      <button type="button" onClick={() => {
        if (modo === 'anios') { setAnioA(anioB); setAnioB(anioA) }
        else if (modo === 'meses') { setMes(otroMes); setOtroMes(mes) }
        else { setZona(otraZona); setOtraZona(zona) }
      }}>Swap A and B</button>
      {modo !== 'meses' && <button type="button" disabled={disponible.length < (modo === 'anios' ? 2 : 1)} onClick={() => {
        setAnioB(disponible[disponible.length - 1]!)
        if (modo === 'anios') setAnioA(disponible[disponible.length - 2]!)
      }}>{modo === 'anios' ? 'Latest two years with data' : 'Latest year with shared data'}</button>}
    </div>
    <section aria-label="Comparison results" aria-live="polite" aria-atomic="true">
      {iguales && <p className="comparacion-aviso">You selected {modo === 'anios' ? 'the same year' : modo === 'meses' ? 'the same month' : 'the same zone'}. Change A or B to compare.</p>}
      {modo !== 'zonas' && <figure className="comparacion-serie">
        <figcaption>{opcion.nombre} <span>· {variable.unidad}</span></figcaption>
        <p>{modo === 'anios' ? `${MESES[mes]} each year, ${inicio}–${fin}` : `Historical averages: ${MESES[inicio]}–${MESES[fin]}`}</p>
        {serieComparacion.some((d) => d.valor != null) ? <div className="comparacion-grafico">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={serieComparacion} margin={{ top: 25, right: 20, bottom: 4, left: 0 }} accessibilityLayer>
              <CartesianGrid vertical={false} stroke="var(--linea)" strokeDasharray="3 4" />
              <XAxis dataKey="punto" tickFormatter={(p: number) => modo === 'meses' ? MESES[p]!.slice(0, 3) : String(p)} interval="preserveStartEnd" minTickGap={18} tick={{ fill: 'var(--niebla)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis width={48} domain={['auto', 'auto']} tickFormatter={(x: number) => nf(variable.dec).format(x)} tick={{ fill: 'var(--niebla)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip isAnimationActive={false} content={({ active, payload }) => {
                const d = payload?.[0]?.payload as typeof serieComparacion[number] | undefined
                return active && d ? <div className="tip"><b>{d.etiqueta}</b><div>{fmt(d.valor)}</div>{d.n != null && <small>{d.n} years with data</small>}</div> : null
              }} />
              <Line type="linear" dataKey="valor" stroke="var(--frio)" strokeWidth={2} dot={{ r: 2, fill: 'var(--frio)' }} activeDot={{ r: 4 }} connectNulls={false} isAnimationActive={false} />
              {resultado.a != null && <ReferenceDot x={modo === 'meses' ? mes : anioA} y={resultado.a} r={5} fill="var(--frio)" stroke="var(--abismo)" label={{ value: iguales ? 'A/B' : 'A', position: 'top', fill: 'var(--frio)' }} />}
              {!iguales && resultado.b != null && <ReferenceDot x={modo === 'meses' ? otroMes : anioB} y={resultado.b} r={5} fill="var(--fito)" stroke="var(--abismo)" label={{ value: 'B', position: 'top', fill: 'var(--fito)' }} />}
            </LineChart>
          </ResponsiveContainer>
        </div> : <p className="comparacion-aviso">No data in this interval. Try other dates or a different parameter.</p>}
        <p className="comparacion-serie-nota">{modo === 'anios' ? 'Same month each year.' : 'January–December order; available records from years shared by A/B.'} Missing values remain gaps.</p>
        <details className="comparacion-fuente"><summary>View chart values</summary><table className="comparacion-tabla">
          <thead><tr><th scope="col">{modo === 'meses' ? 'Month' : 'Year'}</th><th scope="col">{variable.unidad}</th>{modo === 'meses' && <th scope="col">Years with data</th>}</tr></thead>
          <tbody>{serieComparacion.map((d) => <tr key={d.punto}><th scope="row">{d.etiqueta}</th><td>{fmt(d.valor)}</td>{modo === 'meses' && <td>{d.n}</td>}</tr>)}</tbody>
        </table></details>
      </figure>}
      {modo === 'zonas' ? <div className="comparacion-resultados">
        {[{ s: a, x: resultado.a, ref: refA, letra: 'A' }, { s: b, x: resultado.b, ref: refB, letra: 'B' }].map(({ s, x, ref, letra }) => <div key={letra}>
          <span><strong>{letra}</strong> · {etiqueta(s)}</span><small>{modelo.zona(s.zona).nombre}</small><b>{fmt(x)}</b>
          <small>Historical average for {MESES[s.mes]}: {fmt(ref.promedio)}<br />{periodo(ref.registros.map((r) => r.anio))}</small>
        </div>)}
      </div> : <div className="comparacion-detalles">
        <div className="comparacion-fila"><strong>A · {etiqueta(a)}</strong><strong>B · {etiqueta(b)}</strong></div>
        <div className="comparacion-fila"><span>{modelo.zona(a.zona).nombre}</span><span>{modelo.zona(b.zona).nombre}</span></div>
        <div className="comparacion-fila comparacion-valores"><b>{fmt(resultado.a)}</b><b>{fmt(resultado.b)}</b></div>
        {modo === 'meses' ? <div className="comparacion-fila"><small>Historical average</small><small>Historical average</small></div> : <>
          <div className="comparacion-fila"><small>Historical average for {MESES[a.mes]}: {fmt(refA.promedio)}</small><small>Historical average for {MESES[b.mes]}: {fmt(refB.promedio)}</small></div>
          <div className="comparacion-fila"><small>{periodo(refA.registros.map((r) => r.anio))}</small><small>{periodo(refB.registros.map((r) => r.anio))}</small></div>
        </>}
      </div>}
      <div className="comparacion-conclusion"><span>DIFFERENCE</span><p>{iguales ? 'A and B are the same selection.' : cambio(resultado.a, resultado.b)}</p>
        {diferencia == null && <p>Try another date or parameter. Missing does not mean zero.</p>}
        {diferencia != null && !iguales && <p>{modo === 'meses' ? 'Historical data, not a forecast.' : modo === 'zonas' ? 'Broad areas, not fishing spots.' : 'Two dates do not establish a trend.'}</p>}
      </div>
      {modo === 'meses' && <p className="comparacion-ayuda">Shared reference: {periodo(resultado.comunes)} (1998–2025).</p>}
    </section>
    {modo !== 'meses' && <div className="comparacion-acciones-globo" role="group" aria-label="View selection on the globe">
      {[{ s: a, letra: 'A' }, { s: b, letra: 'B' }].map(({ s, letra }) => <button key={letra} type="button" disabled={valor(s) == null || modelo.idxMes(s.anio, s.mes) > modelo.ultimo} onClick={() => verGlobo(s)}>View {letra} on globe</button>)}
    </div>}
    <Guia variable={variable} />
    <Frase texto={leerComparacion(resultado.a, resultado.b, variable.unidad)} />
    <details className="comparacion-fuente comparacion-lectura">
      <summary>Temperature and chlorophyll</summary>
      <div className="comparacion-tabla-envoltura"><table className="comparacion-tabla">
        <caption>The same selections A and B</caption>
        <thead><tr><th scope="col">Parameter</th><th scope="col">A</th><th scope="col">B</th></tr></thead>
        <tbody>{OPCIONES.slice(0, 2).map((o) => {
          const r = comparar(o.id)
          return <tr key={o.id}><th scope="row">{o.nombre}<small>{cambio(r.a, r.b, o.id)}{modo === 'meses' && <> {periodo(r.comunes)}.</>}</small></th><td>{fmt(r.a, o.id)}</td><td>{fmt(r.b, o.id)}</td></tr>
        })}</tbody>
      </table></div>
      <p>Two selections do not establish a relationship. Chlorophyll indicates pigment, not fish abundance.</p>
    </details>
    {modo === 'anios' && <details className="comparacion-fuente">
      <summary>Historical trend</summary>
      <p>{modelo.zona(zona).nombre} · {MESES[mes]} · {opcion.nombre}. {periodo(refA.registros.map((r) => r.anio))} within 1998–2025.</p>
      <p>{tendencia == null ? 'At least six years with data are needed to estimate linear change.' : <>Descriptive linear change: <strong>{tendencia > 0 ? '+' : tendencia < 0 ? '−' : ''}{fmt(Math.abs(tendencia * 10))} per decade</strong>.</>}</p>
      <p>Describes this month’s record; not a significance test or forecast.</p>
    </details>}
    <details className="comparacion-fuente"><summary>Sources and scope</summary>
      {[...new Set([parametro, ...OPCIONES.slice(0, 2).map((o) => o.id)])].map((id) => { const v = variablePorId(id); return <p key={id}><strong>{OPCIONES.find((o) => o.id === id)?.nombre}:</strong> {v.fuente} Product coverage: {v.periodo}.</p> })}
      <p>Monthly summaries of broad areas; coverage may contain gaps. Historical references use available records from 1998–2025. These are not current conditions, seven-day forecasts or fishing recommendations.</p>
    </details>
  </div>
}
