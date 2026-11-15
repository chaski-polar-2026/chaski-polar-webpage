import { InsigniaNino } from '../../../nino/RelacionesNino'
import { Guia } from '../../../lectura/PanelLectura'
import { mesLargo } from '../../../../lib/formato'
import { useExplorer } from '../../ExplorerContext'
import { useAcciones } from '../../hooks/useAcciones'
import { HISTORIAS } from '../../lib/historias'
import { esPeru } from '../../lib/modelo'
import { variablePorId } from '../../lib/variables'
import { useExplorerStore } from '../../store'
import { ChipsEventos } from './comun'
import Proposito from './Proposito'

/** Resumen de todas las zonas en el mes elegido */
export default function General() {
  const { modelo, mapa, mapaEstado } = useExplorer()
  const acciones = useAcciones()
  const { section, variable, month: i, view } = useExplorerStore()
  const v = variablePorId(variable)
  const filas = modelo.ids.map((z) => ({ z, t: modelo.anomalia(z, v, i), a: modelo.anomaliaTxt(z, v, i) }))
    .sort((x, y) => (y.t == null ? -1 : x.t == null ? 1 : Math.abs(y.t) - Math.abs(x.t)))
  const top = filas[0]
  const mes = mesLargo(modelo.mes(i))
  const sinDatoAntartida = filas.some((f) => !esPeru(f.z) && f.t == null) && v.id === 'clorofila_mg_m3'
  const conMapa = mapaEstado === 'listo' && mapa.activo({ variable: v, vista: view })

  if (section === 'pacifico_sur') return <>
    <h2>South Pacific</h2>
    <p>Regional data not available yet.</p>
  </>

  let notaMapa: React.ReactNode = null
  if (conMapa) {
    notaMapa = v.mapa === 'clorofila'
      ? ' The globe map shows chlorophyll in half-degree cells: yellow and green mean more phytoplankton; purple means less.'
        : ' The globe map shows how far temperature moved from normal in one-degree cells: orange is warmer; blue is colder; normal water has little color.'
  } else if (view === 'illustrated' && v.mapa) {
    notaMapa = <> Each globe point is a study zone, colored by its value for the selected month. To see the full satellite map, switch above to <strong>Detailed</strong> or <strong>Satellite</strong> view.</>
  }

  return <>
    <Proposito />
    <h2 id="variable-actual">{v.nombre}</h2>
    <Guia variable={v} />
    {section === 'humboldt' && <InsigniaNino variable={v.id} />}
    <h3>Select a zone · {mes}</h3>
    <ul className="lista-zonas">{filas.map((f) => <li key={f.z}><button className="fila-zona" type="button" onClick={() => acciones.irAZona(f.z)}>
      <span className="punto" style={{ background: modelo.colorZona(f.z, v, i, 1) }} />
      <span>{modelo.zona(f.z).nombre}<small>{modelo.zona(f.z).region}</small></span>
      <span className="valor">{f.a ? f.a.corto : 'no data'}</span>
    </button></li>)}</ul>
    <details className="datos-detalle">
    <summary>Parameter and source</summary>
    <p>{notaMapa}</p>
    <p>{top?.a ? <>In {mes}, the zone farthest from normal was <strong>{modelo.zona(top.z).nombre}</strong>: {top.a.frase}.</> : `In ${mes} there is no ${v.corto} data for these zones.`}{sinDatoAntartida && ' No sea-color data during Antarctic winter.'}</p>
    <p className="variable-meta"><strong>Unit:</strong> {v.unidad} · <strong>Source:</strong> {v.fuente} · <strong>Period:</strong> {v.periodo} · <strong>Coverage:</strong> {v.cobertura}</p>
    </details>
    <h3>Explore an El Niño event</h3>
    <ChipsEventos />
    <h3>Explore a story</h3>
    <button className="recorrido-cta" type="button" onClick={() => acciones.paso(0)}>
      <b>From ice to anchoveta</b>
      <span>Guided tour · 3 min</span>
      <svg viewBox="0 0 34 34" aria-hidden="true"><circle cx="17" cy="17" r="16" fill="none" stroke="#3fc28c" strokeWidth="1.5" /><path d="M14 11l8 6-8 6z" fill="#eaf3f5" /></svg>
    </button>
    <div className="historias">
      <button className="historia destacada" type="button" onClick={acciones.nino2026}><b>El Niño 2026, ongoing</b></button>
      {HISTORIAS.map((h) => <button key={h.id} className="historia" type="button" onClick={() => acciones.historia(h.id)}><b>{h.titulo}</b></button>)}
      {mapaEstado === 'listo' && <button className="historia" type="button" onClick={() => { const m = modelo.mes(i); acciones.comparar({ mes: m.mes, b: m.anio }) }}><b>Compare two years</b></button>}
    </div>
    <div className="acciones-relato">
      <a className="btn" href="/research#hallazgos">View findings</a>
      <a className="btn" href="/research#physical-chain">Physical conditions</a>
    </div>
  </>
}
