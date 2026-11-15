import { useState } from 'react'
import { useExplorer } from '../../ExplorerContext'
import { useAcciones } from '../../hooks/useAcciones'
import { useExplorerStore } from '../../store'
import { esPeru, ZONA_CHIMBOTE } from '../../lib/modelo'
import type { IdZona } from '../../lib/tipos'
import especies from '../../data/especies.json'
import fuentes from '../../data/fuentes-especies.json'
import { ICONOS_PEZ } from '../../../pescadores/iconosPez'
import './peces.css'

type Fuente = { source_id: string; page_or_table: string; short_quote: string }
type Temperatura = { min: number | null; max: number | null; basis: string; comparable: boolean; use_in_comparison: boolean; source: Record<string, Fuente[]> }
type Pez = { id: string; common_name_es: string; scientific_name_accepted: string; group: string; temperature_note: string; depth_note?: string; recorded_temperature?: Temperatura }

// Las observaciones estacionales se comparan solo en la estación indicada en la fuente.
function rango(t: Temperatura | undefined, mes: number): { min: number; max: number; fuente: Fuente } | null {
  if (!t?.comparable || !t.use_in_comparison || t.basis !== 'field_seasonal_observation') return null
  const estacion = mes <= 2 ? 'summer' : mes >= 6 && mes <= 8 ? 'winter' : null
  if (!estacion) return null
  const citas = Object.values(t.source).flat()
  for (const fuente of citas) {
    for (const parte of fuente.short_quote.split(';')) {
      if (!parte.toLowerCase().includes(estacion)) continue
      const valores = parte.match(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)/)
      if (valores) return { min: Number(valores[1]), max: Number(valores[2]), fuente }
    }
  }
  return null
}

export default function Biologia({ zona }: { zona?: IdZona }) {
  const { modelo } = useExplorer()
  const acciones = useAcciones()
  const [especie, setEspecie] = useState('all')
  const month = useExplorerStore(s => s.month)
  const monitorZone = useExplorerStore(s => s.monitorZone)
  const z = zona && esPeru(zona) ? zona : monitorZone && esPeru(monitorZone) ? monitorZone : ZONA_CHIMBOTE
  const fecha = modelo.mes(month)
  const peces = (especies as Pez[]).filter(p => p.group.includes('fish'))
  const valor = modelo.valorSerie(z, 'temperatura_superficial_C', month)
  const dato = valor != null && Number.isFinite(valor) ? valor : null
  return <section className="peces-panel">
    <h2>Fish biological response</h2>
    <label>Coastal zone <select value={z} onChange={e => acciones.irAZona(e.target.value as IdZona)}>{modelo.ids.filter(esPeru).map(id => <option key={id} value={id}>{modelo.zona(id).nombre}</option>)}</select></label>
    <p><strong>{new Date(Date.UTC(fecha.anio, fecha.mes, 1)).toLocaleDateString('en', { month: 'long', year: 'numeric', timeZone: 'UTC' })}</strong> · {modelo.zona(z).nombre}</p>
    <p className="nota">Choose a zone here or on the globe, and use the timeline to explore another month.</p>
    <p className="nota">Closeness to recorded temperatures compares the selected surface temperature with observations in a matching context. Recorded temperatures are not tolerance limits or optima and do not indicate wellbeing or fishing probability. Species are not ranked.</p>
    <label>Fish <select value={especie} onChange={e => setEspecie(e.target.value)}><option value="all">All fish</option>{peces.map(p => <option key={p.id} value={p.id}>{p.common_name_es}</option>)}</select></label>
    <div className="peces-lista">{peces.filter(p => especie === 'all' || p.id === especie).map(pez => {
      const referencia = rango(pez.recorded_temperature, fecha.mes)
      const distancia = referencia && dato != null ? Math.max(referencia.min - dato, 0, dato - referencia.max) : null
      const enlace = referencia ? (fuentes as Record<string, string>)[referencia.fuente.source_id] : null
      return <article key={pez.id}>
        <div className="pez-titulo">{ICONOS_PEZ[pez.group]}<h3>{pez.common_name_es}</h3><i>{pez.scientific_name_accepted}</i></div>
        {referencia && dato != null ? <div className="pez-factor">
          <div><b>Surface temperature</b><span>{dato.toFixed(2)} °C</span></div>
          <div className="pez-banda" aria-hidden="true"><span /><b style={{ left: `${Math.max(0, Math.min(100, ((dato - referencia.min) / (referencia.max - referencia.min) * 50) + 25))}%` }} /></div>
          <small>Recorded: {referencia.min}–{referencia.max} °C · {distancia === 0 ? 'Within recorded range' : `${distancia?.toFixed(2)} °C ${dato < referencia.min ? 'below' : 'above'} recorded range`}</small>
          <p className="nota">{pez.temperature_note} {enlace && <a href={enlace} target="_blank" rel="noreferrer">Source ({referencia.fuente.page_or_table})</a>}</p>
        </div> : <p className="nota">No comparable data{referencia && dato == null ? ' for this month' : ''}.</p>}
        {pez.id === 'merluza' && pez.depth_note && <p className="nota">{pez.depth_note} Recorded fishing depth is not a physiological limit.</p>}
      </article>
    })}</div>
  </section>
}
