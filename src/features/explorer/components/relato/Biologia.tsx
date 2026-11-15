import { useExplorer } from '../../ExplorerContext'
import { useExplorerStore } from '../../store'
import { esPeru, ZONA_CHIMBOTE } from '../../lib/modelo'
import type { IdZona } from '../../lib/tipos'
import './peces.css'

type Rango = { variable: string; nombre: string; unidad: string; min: number; max: number }
const temperatura = (min: number, max: number): Rango => ({ variable: 'temperatura_superficial_C', nombre: 'Surface temperature', unidad: '°C', min, max })
const salinidad = (min: number, max: number): Rango => ({ variable: 'salinidad_psu', nombre: 'Surface salinity', unidad: 'PSU', min, max })
// Intervalos superficiales del informe de especies; no se trasladan ensayos larvales o temperaturas de fondo.
export function rangosPeces(mes: number) {
  const verano = mes <= 2, invierno = mes >= 6 && mes <= 8
  return [
    { nombre: 'Anchoveta', ciencia: 'Engraulis ringens', rangos: verano ? [temperatura(17.6, 23.7), salinidad(32.30, 35.14)] : invierno ? [temperatura(14.5, 18.8), salinidad(34.81, 35.12)] : [], nota: verano ? 'Summer ranges' : invierno ? 'Winter ranges' : 'Season-specific bounds pending for this month', fuente: 'https://doi.org/10.1111/fog.12419' },
    { nombre: 'Jurel', ciencia: 'Trachurus murphyi', rangos: verano ? [temperatura(15, 23), salinidad(34.8, 35.24)] : [], nota: verano ? 'Historical survey reference, summers 1992–1994' : 'Comparable seasonal bounds not available', fuente: 'https://hdl.handle.net/20.500.12958/409' },
    { nombre: 'Caballa', ciencia: 'Scomber japonicus', rangos: [temperatura(15, 19), salinidad(34.9, 35.2)], nota: 'IMARPE reference ranges', fuente: 'https://biodiversidadacuatica.imarpe.gob.pe/Files/ExportarEspeciePdf?taxonId=125' },
    { nombre: 'Perico', ciencia: 'Coryphaena hippurus', rangos: [temperatura(22, 24), { variable: 'clorofila_mg_m3', nombre: 'Chlorophyll-a', unidad: 'mg/m³', min: 0, max: 1 }], nota: 'Offshore reference; chlorophyll below 1 (0 is a display baseline)', fuente: 'https://doi.org/10.1016/j.dsr2.2019.104665' },
    ...[
      ['Bonito', 'Sarda chiliensis chiliensis'], ['Merluza', 'Merluccius peruanus'], ['Lorna', 'Callaus deliciosa'], ['Cachema', 'Cynoscion analis'], ['Corvina', 'Cilus gilberti'], ['Lisa', 'Mugil cephalus'], ['Cabinza', 'Isacia conceptionis'], ['Cabrilla', 'Paralabrax humeralis'], ['Pejerrey', 'Odontesthes regia'], ['Chita', 'Anisotremus scapularis'], ['Lenguado', 'Paralichthys adspersus'], ['Coco', 'Paralonchurus peruanus'], ['Pintadilla', 'Chirodactylus variegatus'],
    ].map(([nombre, ciencia]) => ({ nombre, ciencia, rangos: [] as Rango[], nota: 'Comparable surface bounds not available', fuente: '' })),
  ]
}

export default function Biologia({ zona }: { zona?: IdZona }) {
  const { modelo } = useExplorer()
  const month = useExplorerStore(s => s.month)
  const monitorZone = useExplorerStore(s => s.monitorZone)
  const setZone = useExplorerStore(s => s.setMonitorZone)
  const z = zona && esPeru(zona) ? zona : monitorZone && esPeru(monitorZone) ? monitorZone : ZONA_CHIMBOTE
  const fecha = modelo.mes(month)
  return <section className="peces-panel">
    <h2>Fish biological response</h2>
    <p>Humboldt fish · conditions at the selected timeline month</p>
    <label>Coastal zone <select value={z} onChange={e => setZone(e.target.value as IdZona)} disabled={!!zona && esPeru(zona)}>
      {modelo.ids.filter(esPeru).map(id => <option key={id} value={id}>{modelo.zona(id).nombre}</option>)}
    </select></label>
    <p><strong>{new Date(Date.UTC(fecha.anio, fecha.mes, 1)).toLocaleDateString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</strong> · {modelo.zona(z).nombre}</p>
    <p className="nota">Each band shows a reference range and the selected value. Within range means compatible, not a catch forecast. All fish are shown without ranking.</p>
    <div className="peces-lista">{rangosPeces(fecha.mes).map(pez => <article key={pez.nombre}>
      <h3>{pez.nombre}</h3><i>{pez.ciencia}</i>
      {pez.rangos.map(r => {
        const dato = modelo.valorSerie(z, r.variable, month)
        const x = dato != null && Number.isFinite(dato) ? dato : null
        const ancho = r.max - r.min
        const posicion = x == null ? 50 : Math.max(0, Math.min(100, ((x - r.min) / ancho * 50) + 25))
        const dentro = x != null && x >= r.min && (r.variable === 'clorofila_mg_m3' ? x < r.max : x <= r.max)
        const distancia = x == null ? null : x < r.min ? r.min - x : x > r.max ? x - r.max : 0
        return <div className="pez-factor" key={r.variable}>
          <div><b>{r.nombre}</b><span>{x == null ? 'No data for this month' : `${x.toFixed(2)} ${r.unidad}`}</span></div>
          <div className="pez-banda" aria-hidden="true"><span />{x != null && <b style={{ left: `${posicion}%` }} />}</div>
          <small>Reference: {r.min}–{r.max} {r.unidad} · {x == null ? 'Unavailable' : dentro ? 'Within range' : distancia === 0 ? 'At upper boundary' : `${distancia?.toFixed(2)} ${r.unidad} ${x < r.min ? 'below' : 'above'} range`}</small>
        </div>
      })}
      <p className="nota">{pez.nota}{pez.fuente && <> · <a href={pez.fuente} target="_blank" rel="noreferrer">Source</a></>}</p>
    </article>)}</div>
  </section>
}
