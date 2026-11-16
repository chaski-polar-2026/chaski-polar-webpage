import especies from '../../data/especies.json'
import './condiciones.css'

/* Meses (1 = enero) tomados de las notas de temporada de especies.json (IMARPE y guías citadas).
   Estaciones aproximadas para Perú: verano dic–mar, otoño abr–jun, invierno jul–sep, primavera oct–nov.
   "principal" es el periodo más marcado en la fuente; "otros" es actividad secundaria. */
type Temporada = { etiqueta: string; principal: number[]; otros: number[] }
const TODO = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const TEMPORADAS: Record<string, Temporada> = {
  anchoveta: { etiqueta: 'Spawning', principal: [8, 9, 2, 3], otros: TODO },
  merluza: { etiqueta: 'Spawning', principal: [7, 8, 9, 10, 11], otros: [12, 1, 2, 3, 4, 5, 6] },
  cachema: { etiqueta: 'Reproduction and landings', principal: [10, 11, 12, 1, 2, 3], otros: [] },
  jurel: { etiqueta: 'Spawning', principal: [7, 8, 9, 10, 11], otros: [12, 1, 2, 3] },
  perico: { etiqueta: 'Artisanal landings (not spawning)', principal: [10, 11, 12, 1, 2, 3], otros: [] },
  caballa: { etiqueta: 'Spawning', principal: [11, 12, 1, 2, 3], otros: TODO },
  bonito: { etiqueta: 'Spawning', principal: [10, 11, 12, 2, 3], otros: TODO },
  lorna: { etiqueta: 'Spawning', principal: [4, 5, 6], otros: [] },
}
const MES = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
const NOMBRE_MES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const BASE_TEMP: Record<string, string> = {
  bottom_temperature_cruise: 'bottom temperature on survey cruises',
  field_depth_mixed_observation: 'observations at mixed depths',
  laboratory_treatment: 'laboratory treatments',
  field_seasonal_observation: 'seasonal surface observations',
}
const MAX_PROF = 800

type Datos = { id: string; el_nino_response_note?: string; recorded_temperature?: { min: number | null; max: number | null; basis: string }; recorded_depth?: { min: number | null; max: number | null } }

/** Condiciones registradas de una especie: meses de desove o desembarques, profundidad y temperatura (contexto, no pronóstico) */
export default function TarjetaCondiciones({ id, mes, tempComparable }: { id: string; mes: number; tempComparable: boolean }) {
  const d = (especies as unknown as Datos[]).find(e => e.id === id)
  if (!d) return null
  const t = TEMPORADAS[id]
  const prof = d.recorded_depth
  const pmax = prof?.max ?? null
  const pmin = prof?.min ?? 0
  const sqrt = (m: number) => Math.sqrt(Math.min(m, MAX_PROF) / MAX_PROF) * 100
  const temp = d.recorded_temperature
  const tieneTemp = temp && temp.min != null && temp.max != null
  const mesActual = mes + 1
  return <div className="cond">
    {t && <div className="cond-bloque">
      <b>{t.etiqueta} by month</b>
      <ol className="cond-meses" aria-label={`${t.etiqueta}: ${NOMBRE_MES.filter((_, i) => t.principal.includes(i + 1)).join(', ')}`}>
        {MES.map((l, i) => <li key={i} className={`${t.principal.includes(i + 1) ? 'cond-m-pp' : t.otros.includes(i + 1) ? 'cond-m-ot' : ''}${i + 1 === mesActual ? ' cond-m-hoy' : ''}`} title={NOMBRE_MES[i]}>{l}</li>)}
      </ol>
      <small>Dark: main period in the sources{t.otros.length ? '; light: also recorded' : ''}. Outlined: month selected on the timeline.</small>
    </div>}
    {pmax != null && <div className="cond-bloque">
      <b>Recorded depth</b>
      <div className="cond-prof" aria-hidden="true"><span style={{ left: `${sqrt(pmin)}%`, width: `${Math.max(2, sqrt(pmax) - sqrt(pmin))}%` }} /></div>
      <small>{prof?.min != null ? `${prof.min}–${pmax} m` : `Down to ${pmax} m`} · surface at the left, {MAX_PROF} m at the right. A recorded range, not a species limit.</small>
    </div>}
    {!tempComparable && tieneTemp && <small className="cond-temp">Recorded {temp.min}–{temp.max} °C from {BASE_TEMP[temp.basis] ?? 'field records'}. {temp.basis === 'field_seasonal_observation' ? 'The sources report it by season, so it is compared only in the summer and winter months.' : 'Not comparable with the surface temperature of this zone.'}</small>}
    {d.el_nino_response_note && <details><summary>What was recorded during El Niño</summary><p className="nota">{d.el_nino_response_note}</p></details>}
    <p className="nota cond-aviso">Recorded conditions, not a fishing forecast.</p>
  </div>
}
