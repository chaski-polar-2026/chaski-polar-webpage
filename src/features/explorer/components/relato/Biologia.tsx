import { useExplorer } from '../../ExplorerContext'
import { useState } from 'react'
import { useAcciones } from '../../hooks/useAcciones'
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
  const acciones = useAcciones()
  const [especie, setEspecie] = useState('all')
  const month = useExplorerStore(s => s.month)
  const monitorZone = useExplorerStore(s => s.monitorZone)
  const z = zona && esPeru(zona) ? zona : monitorZone && esPeru(monitorZone) ? monitorZone : ZONA_CHIMBOTE
  const fecha = modelo.mes(month)
  const peces = rangosPeces(fecha.mes).map(pez => {
    const distancias = pez.rangos.map(r => {
      const valor = modelo.valorSerie(z, r.variable, month)
      if (valor == null || !Number.isFinite(valor)) return null
      return Math.max(r.min - valor, 0, valor - r.max) / (r.max - r.min)
    })
    const distancia = distancias.length && distancias.every(d => d != null)
      ? distancias.reduce<number>((suma, d) => suma + (d ?? 0), 0) / distancias.length : null
    return { ...pez, distancia }
  }).sort((a, b) => a.distancia == null ? (b.distancia == null ? 0 : 1) : b.distancia == null ? -1 : a.distancia - b.distancia)
  return <section className="peces-panel">
    <h2>Fish biological response</h2>
    <label>Coastal zone <select value={z} onChange={e => acciones.irAZona(e.target.value as IdZona)}>
      {modelo.ids.filter(esPeru).map(id => <option key={id} value={id}>{modelo.zona(id).nombre}</option>)}
    </select></label>
    <p><strong>{new Date(Date.UTC(fecha.anio, fecha.mes, 1)).toLocaleDateString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</strong> · {modelo.zona(z).nombre}</p>
    <p className="nota">Choose a zone here or click a coastal location on the globe. Use the timeline to explore another month.</p>
    <p className="nota">Fish are ordered by average distance outside their available reference ranges, scaled by each range's width. Values inside a range tie; fish with missing measurements or ranges appear last. Ranges differ by species, so this is a rough comparison, not a catch forecast.</p>
    <label>Fish <select value={especie} onChange={e => setEspecie(e.target.value)}><option value="all">All fish</option>{peces.map(pez => <option key={pez.nombre} value={pez.nombre}>{pez.nombre}</option>)}</select></label>
    {/* TODO: remove with reference ranges on publishing — el filtro anterior se retiró de la interfaz. */}
    <div className="peces-lista">{peces.filter(pez => especie === 'all' || pez.nombre === especie).map(pez => <article key={pez.nombre}>
      <div className="pez-titulo"><h3>{pez.nombre}</h3><i>{pez.ciencia}</i></div>
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
