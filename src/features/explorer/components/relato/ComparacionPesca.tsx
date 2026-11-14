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

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const OPCIONES = [
  { id: 'temperatura_superficial_C', nombre: 'Temperatura superficial', ayuda: 'Permite reconocer agua más cálida o fría en la superficie. No describe la temperatura a la profundidad de pesca.' },
  { id: 'clorofila_mg_m3', nombre: 'Clorofila', ayuda: 'Pigmento del fitoplancton, base de la red alimentaria. Más clorofila no equivale a más peces ni garantiza una captura.' },
  { id: 'viento', nombre: 'Viento', ayuda: 'Rapidez calculada con las componentes mensuales del viento. No muestra ráfagas, oleaje ni condiciones para navegar hoy.' },
  { id: 'salinidad_psu', nombre: 'Salinidad', ayuda: 'Indica qué tan salada está el agua superficial. Ayuda a describir diferencias entre masas de agua.' },
  { id: 'nivel_mar_anomalia_m', nombre: 'Nivel del mar', ayuda: 'Anomalía: diferencia frente a la referencia del producto. No es la altura de la marea ni la profundidad disponible para el bote.' },
] as const
const MODOS = [
  { id: 'anios', nombre: 'Entre años', pregunta: '¿Qué cambió de un año a otro?', ayuda: 'La misma zona y el mismo mes en dos años. Así reduces la diferencia debida a las estaciones.' },
  { id: 'meses', nombre: 'Entre meses', pregunta: '¿Cómo suele cambiar durante el año?', ayuda: 'Compara dos meses usando promedios históricos de los mismos años. Sirve para explorar el ciclo estacional.' },
  { id: 'zonas', nombre: 'Entre zonas', pregunta: '¿Cómo se diferenciaban dos zonas?', ayuda: 'El mismo parámetro y la misma fecha en dos zonas. Describe el ambiente, no cuál es mejor para pescar.' },
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
    return x == null ? 'Sin datos' : `${nf(v.dec).format(x)} ${v.unidad}`
  }
  const cambio = (x: number | null, y: number | null, id = parametro) => {
    if (x == null || y == null) return 'Falta un dato para comparar.'
    const d = y - x, dec = variablePorId(id).dec
    if (Math.abs(d) < 0.5 * 10 ** -dec) return 'Sin diferencia a la precisión mostrada.'
    return `B tiene ${fmt(Math.abs(d), id)} ${d > 0 ? 'más' : 'menos'} que A.`
  }
  const etiqueta = (s: Seleccion) => modo === 'meses' ? MESES[s.mes] : `${MESES[s.mes]} ${s.anio}`
  const referencia = (s: Seleccion) => {
    const registros = historicos.map((anio) => ({ anio, valor: valor({ ...s, anio }) })).filter((r) => r.valor != null)
    return { registros, promedio: media(registros.map((r) => r.valor)) }
  }
  const refA = referencia(a), refB = referencia(b)
  const periodo = (ys: number[]) => ys.length ? `${ys[0]}–${ys[ys.length - 1]} · ${ys.length} años con datos` : 'Sin años con datos'
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
  const opcionesZona = zonas.map((z) => <option key={z} value={z}>{modelo.zonas[z].nombre}</option>)

  return <div className="comparacion-pesca">
    <div className="comparacion-intro"><span>CUADERNO DEL MAR · HISTÓRICO</span><h2>Entiende qué cambia</h2><p>Empieza por una pregunta sobre tu zona.</p></div>
    <div className="comparacion-modos" role="group" aria-label="Qué quieres comparar">
      {MODOS.map((m) => <button key={m.id} type="button" aria-pressed={modo === m.id} onClick={() => setModo(m.id)}>{m.nombre}</button>)}
    </div>
    <h3 className="comparacion-pregunta">{recorrido.pregunta}</h3>
    <p className="comparacion-ayuda">{recorrido.ayuda}</p>
    <div className="comparacion-controles">
      <div className="comparacion-zonas comparacion-ancho">
        <label>{modo === 'zonas' ? 'Zona A' : 'Tu zona'}<select value={zona} onChange={(e) => setZona(e.target.value as IdZona)}>{opcionesZona}</select></label>
        {modo === 'zonas' && <label>Zona B<select value={otraZona} onChange={(e) => setOtraZona(e.target.value as IdZona)}>{opcionesZona}</select></label>}
      </div>
      <label className="comparacion-ancho">Qué quieres observar<select value={parametro} aria-describedby="comparacion-parametro-ayuda" onChange={(e) => setParametro(e.target.value)}>{OPCIONES.map((o) => <option key={o.id} value={o.id}>{o.nombre}</option>)}</select></label>
      <label className={modo === 'anios' ? 'comparacion-ancho' : ''}>{modo === 'meses' ? 'Mes A' : 'Mes'}<select value={mes} onChange={(e) => setMes(Number(e.target.value))}>{opcionesMes}</select></label>
      {modo === 'meses' ? <label>Mes B<select value={otroMes} onChange={(e) => setOtroMes(Number(e.target.value))}>{opcionesMes}</select></label> : <>
        {modo === 'anios' && <label>Año A<select value={anioA} onChange={(e) => setAnioA(Number(e.target.value))}>{opcionesAnio}</select></label>}
        <label>{modo === 'anios' ? 'Año B' : 'Año'}<select value={anioB} onChange={(e) => setAnioB(Number(e.target.value))}>{opcionesAnio}</select></label>
      </>}
    </div>
    <p id="comparacion-parametro-ayuda" className="comparacion-ayuda">{opcion.ayuda}</p>
    <div className="comparacion-atajos">
      {panel.tipo === 'zona' && esPeru(panel.z) && panel.z !== zona && <button type="button" onClick={() => setZona(panel.z)}>Usar zona del globo: {modelo.zonas[panel.z].nombre}</button>}
      <button type="button" onClick={() => {
        if (modo === 'anios') { setAnioA(anioB); setAnioB(anioA) }
        else if (modo === 'meses') { setMes(otroMes); setOtroMes(mes) }
        else { setZona(otraZona); setOtraZona(zona) }
      }}>Intercambiar A y B</button>
      {modo !== 'meses' && <button type="button" disabled={disponible.length < (modo === 'anios' ? 2 : 1)} onClick={() => {
        setAnioB(disponible[disponible.length - 1]!)
        if (modo === 'anios') setAnioA(disponible[disponible.length - 2]!)
      }}>{modo === 'anios' ? 'Últimos dos años con datos' : 'Último año con datos comunes'}</button>}
    </div>
    <section aria-label="Resultado de la comparación" aria-live="polite" aria-atomic="true">
      {iguales && <p className="comparacion-aviso">Elegiste {modo === 'anios' ? 'el mismo año' : modo === 'meses' ? 'el mismo mes' : 'la misma zona'}. Cambia A o B para comparar.</p>}
      {modo !== 'zonas' && <figure className="comparacion-serie">
        <figcaption>{opcion.nombre} <span>· {variable.unidad}</span></figcaption>
        <p>{modo === 'anios' ? `${MESES[mes]} de cada año entre ${inicio} y ${fin}` : `Promedios históricos de ${MESES[inicio]?.toLowerCase()} a ${MESES[fin]?.toLowerCase()}`}</p>
        {serieComparacion.some((d) => d.valor != null) ? <div className="comparacion-grafico">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={serieComparacion} margin={{ top: 25, right: 20, bottom: 4, left: 0 }} accessibilityLayer>
              <CartesianGrid vertical={false} stroke="var(--linea)" strokeDasharray="3 4" />
              <XAxis dataKey="punto" tickFormatter={(p: number) => modo === 'meses' ? MESES[p]!.slice(0, 3) : String(p)} interval="preserveStartEnd" minTickGap={18} tick={{ fill: 'var(--niebla)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis width={48} domain={['auto', 'auto']} tickFormatter={(x: number) => nf(variable.dec).format(x)} tick={{ fill: 'var(--niebla)', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip isAnimationActive={false} content={({ active, payload }) => {
                const d = payload?.[0]?.payload as typeof serieComparacion[number] | undefined
                return active && d ? <div className="tip"><b>{d.etiqueta}</b><div>{fmt(d.valor)}</div>{d.n != null && <small>{d.n} años con datos</small>}</div> : null
              }} />
              <Line type="linear" dataKey="valor" stroke="var(--frio)" strokeWidth={2} dot={{ r: 2, fill: 'var(--frio)' }} activeDot={{ r: 4 }} connectNulls={false} isAnimationActive={false} />
              {resultado.a != null && <ReferenceDot x={modo === 'meses' ? mes : anioA} y={resultado.a} r={5} fill="var(--frio)" stroke="var(--abismo)" label={{ value: iguales ? 'A/B' : 'A', position: 'top', fill: 'var(--frio)' }} />}
              {!iguales && resultado.b != null && <ReferenceDot x={modo === 'meses' ? otroMes : anioB} y={resultado.b} r={5} fill="var(--fito)" stroke="var(--abismo)" label={{ value: 'B', position: 'top', fill: 'var(--fito)' }} />}
            </LineChart>
          </ResponsiveContainer>
        </div> : <p className="comparacion-aviso">No hay datos en este intervalo. Prueba otras fechas o un parámetro diferente.</p>}
        <p className="comparacion-serie-nota">{modo === 'anios' ? 'Se muestra el mismo mes en los años intermedios.' : 'Los meses siguen el orden enero–diciembre, sin pasar al año siguiente. Cada promedio usa los datos disponibles de los años comunes a A y B.'} Los huecos no se rellenan.</p>
        <details className="comparacion-fuente"><summary>Ver valores del gráfico</summary><table className="comparacion-tabla">
          <thead><tr><th scope="col">{modo === 'meses' ? 'Mes' : 'Año'}</th><th scope="col">{variable.unidad}</th>{modo === 'meses' && <th scope="col">Años con datos</th>}</tr></thead>
          <tbody>{serieComparacion.map((d) => <tr key={d.punto}><th scope="row">{d.etiqueta}</th><td>{fmt(d.valor)}</td>{modo === 'meses' && <td>{d.n}</td>}</tr>)}</tbody>
        </table></details>
      </figure>}
      {modo === 'zonas' ? <div className="comparacion-resultados">
        {[{ s: a, x: resultado.a, ref: refA, letra: 'A' }, { s: b, x: resultado.b, ref: refB, letra: 'B' }].map(({ s, x, ref, letra }) => <div key={letra}>
          <span><strong>{letra}</strong> · {etiqueta(s)}</span><small>{modelo.zonas[s.zona].nombre}</small><b>{fmt(x)}</b>
          <small>Promedio histórico de {MESES[s.mes]?.toLowerCase()}: {fmt(ref.promedio)}<br />{periodo(ref.registros.map((r) => r.anio))}</small>
        </div>)}
      </div> : <div className="comparacion-detalles">
        <div className="comparacion-fila"><strong>A · {etiqueta(a)}</strong><strong>B · {etiqueta(b)}</strong></div>
        <div className="comparacion-fila"><span>{modelo.zonas[a.zona].nombre}</span><span>{modelo.zonas[b.zona].nombre}</span></div>
        <div className="comparacion-fila comparacion-valores"><b>{fmt(resultado.a)}</b><b>{fmt(resultado.b)}</b></div>
        {modo === 'meses' ? <div className="comparacion-fila"><small>Promedio histórico</small><small>Promedio histórico</small></div> : <>
          <div className="comparacion-fila"><small>Promedio histórico de {MESES[a.mes]?.toLowerCase()}: {fmt(refA.promedio)}</small><small>Promedio histórico de {MESES[b.mes]?.toLowerCase()}: {fmt(refB.promedio)}</small></div>
          <div className="comparacion-fila"><small>{periodo(refA.registros.map((r) => r.anio))}</small><small>{periodo(refB.registros.map((r) => r.anio))}</small></div>
        </>}
      </div>}
      <div className="comparacion-conclusion"><span>QUÉ PUEDES CONCLUIR</span><p>{iguales ? 'A y B representan la misma selección.' : cambio(resultado.a, resultado.b)}</p>
        {diferencia == null && <p>Prueba otra fecha o parámetro. Un dato ausente no significa cero.</p>}
        {diferencia != null && !iguales && <p>{modo === 'meses' ? 'Esta diferencia describe el ciclo histórico; no anticipa cómo será el próximo mes.' : modo === 'zonas' ? 'Es una diferencia entre áreas amplias, no entre puntos de pesca.' : 'Es un cambio entre dos fechas. Por sí solo no demuestra una tendencia.'}</p>}
      </div>
      {modo === 'meses' && <p className="comparacion-ayuda">Referencia: {periodo(resultado.comunes)} dentro de 1998–2025. Solo se incluyen años con datos en ambos meses.</p>}
    </section>
    {modo !== 'meses' && <div className="comparacion-acciones-globo" role="group" aria-label="Ver la selección en el globo">
      {[{ s: a, letra: 'A' }, { s: b, letra: 'B' }].map(({ s, letra }) => <button key={letra} type="button" disabled={valor(s) == null || modelo.idxMes(s.anio, s.mes) > modelo.ultimo} onClick={() => verGlobo(s)}>Ver {letra} en el globo</button>)}
    </div>}
    <details className="comparacion-fuente comparacion-lectura" open>
      <summary>Lee temperatura y clorofila juntas</summary>
      <p>¿Cambió el calor del agua y también el pigmento del fitoplancton? Observa cada parámetro con su propia unidad.</p>
      <div className="comparacion-tabla-envoltura"><table className="comparacion-tabla">
        <caption>Las mismas selecciones A y B</caption>
        <thead><tr><th scope="col">Parámetro</th><th scope="col">A</th><th scope="col">B</th></tr></thead>
        <tbody>{OPCIONES.slice(0, 2).map((o) => {
          const r = comparar(o.id)
          return <tr key={o.id}><th scope="row">{o.nombre}<small>{cambio(r.a, r.b, o.id)}{modo === 'meses' && <> {periodo(r.comunes)}.</>}</small></th><td>{fmt(r.a, o.id)}</td><td>{fmt(r.b, o.id)}</td></tr>
        })}</tbody>
      </table></div>
      <p>Dos selecciones no prueban una relación entre variables. La clorofila indica pigmento, no cantidad de peces.</p>
    </details>
    {modo === 'anios' && <details className="comparacion-fuente">
      <summary>¿Hay un cambio a lo largo de los años?</summary>
      <p>{modelo.zonas[zona].nombre} · {MESES[mes]} · {opcion.nombre}. {periodo(refA.registros.map((r) => r.anio))} dentro de 1998–2025.</p>
      <p>{tendencia == null ? 'Se necesitan al menos seis años con datos para estimar el cambio lineal.' : <>Cambio lineal descriptivo: <strong>{tendencia > 0 ? '+' : tendencia < 0 ? '−' : ''}{fmt(Math.abs(tendencia * 10))} por década</strong>.</>}</p>
      <p>Resume los registros de este mes. No es una prueba de significancia ni un pronóstico.</p>
    </details>}
    <details className="comparacion-fuente"><summary>Fuentes y alcance</summary>
      {[...new Set([parametro, ...OPCIONES.slice(0, 2).map((o) => o.id)])].map((id) => { const v = variablePorId(id); return <p key={id}><strong>{OPCIONES.find((o) => o.id === id)?.nombre}:</strong> {v.fuente} Cobertura del producto: {v.periodo}.</p> })}
      <p>Resúmenes mensuales de zonas amplias; puede haber huecos dentro de la cobertura. La referencia histórica usa los registros disponibles entre 1998 y 2025. No son condiciones actuales, un pronóstico de siete días ni una recomendación de profundidad o captura.</p>
    </details>
  </div>
}
