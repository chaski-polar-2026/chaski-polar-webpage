import type { ReactNode } from 'react'
import especies from '../explorer/data/especies.json'
import fuentes from '../explorer/data/fuentes-especies.json'
import './pescadores.css'

type Profundidad = { min: number | null; max: number | null; label: string; source: Record<string, { source_id: string }[]> }
type Pez = {
  id: string; common_name_en: string; common_name_es: string; scientific_name_accepted: string; group: string
  habitat_summary?: string; season_note?: string; el_nino_response_note?: string; temperature_note?: string
  flags?: string; recorded_depth?: Profundidad
}
const ICONOS: Record<string, ReactNode> = {
  'pelagic fish': <svg className="pesc-icono" viewBox="0 0 56 32" aria-hidden="true"><path d="M3 16C13 3 31 3 42 16 31 29 13 29 3 16Z" /><path d="M42 16 54 5v22Z" /></svg>,
  'demersal fish': <svg className="pesc-icono" viewBox="0 0 56 32" aria-hidden="true"><path d="M3 18C12 8 34 8 45 18 34 28 12 28 3 18Z" /><path d="M45 18 55 11v14Z" /><path d="M14 11 26 4l9 7Z" /></svg>,
  mollusc: <svg className="pesc-icono" viewBox="0 0 56 32" aria-hidden="true"><path d="M28 29 9 15A22 22 0 0 1 47 15Z" /></svg>,
}
const GRUPOS: Record<string, string> = { 'pelagic fish': 'Pelagic fish', 'demersal fish': 'Bottom-living fish', mollusc: 'Molluscs' }
const lista = especies as unknown as Pez[]
const enlaceFuente = (id: string) => (fuentes as Record<string, string>)[id]
const profundidad = (p?: Profundidad) => {
  if (!p || (p.min == null && p.max == null)) return null
  if (p.min != null && p.max != null) return `${p.min}–${p.max} m`
  return p.max != null ? `down to ${p.max} m` : `from ${p.min} m`
}
const idsFuente = (p?: Profundidad) => [...new Set(Object.values(p?.source ?? {}).flat().map((s) => s.source_id))]

/** Contexto documentado para pesca artesanal; no es un pronóstico de captura ni una guía de seguridad. */
export default function PescadoresSection() {
  const conNino = lista.filter((e) => e.el_nino_response_note)
  return (
    <>
      <section className="seccion pescadores" id="species-context" aria-labelledby="t-especies">
        <p className="puente-kicker">What has been documented</p>
        <h2 id="t-especies">Context for each species</h2>
        <p className="nota">Every item comes from a cited source (mostly IMARPE). Depths and temperatures describe what was recorded in a given place and time. They are not limits and do not say where the species is today. Fields marked “still pending” have no verified source yet.</p>
        <div className="pesc-rejilla">
          {lista.map((e) => {
            const prof = profundidad(e.recorded_depth)
            const ids = idsFuente(e.recorded_depth)
            return (
              <article key={e.id} className="pesc-ficha">
                <header>{ICONOS[e.group]}<h3>{e.common_name_es}</h3><i>{e.scientific_name_accepted}</i><span className="pesc-grupo">{GRUPOS[e.group] ?? e.group}</span></header>
                {e.habitat_summary && <p>{e.habitat_summary}</p>}
                <dl>
                  {prof && <><dt>Recorded depth</dt><dd>{prof}{ids.map((id) => enlaceFuente(id) && <a key={id} className="pesc-fuente" href={enlaceFuente(id)} target="_blank" rel="noreferrer"> [{id}]</a>)}</dd></>}
                  {e.season_note && <><dt>Season</dt><dd>{e.season_note}</dd></>}
                  {e.temperature_note && <><dt>Recorded temperatures</dt><dd>{e.temperature_note}</dd></>}
                </dl>
                {e.flags?.includes('pending') && <p className="pesc-pendiente">Some fields are still pending a verified source.</p>}
              </article>
            )
          })}
        </div>
      </section>

      <section className="seccion pescadores" id="el-nino-documented" aria-labelledby="t-nino">
        <p className="puente-kicker">Warm years in the record</p>
        <h2 id="t-nino">What was documented during El Niño</h2>
        <p className="nota">These are past observations reported by IMARPE and other sources. They are not predictions for the next event, and effects differed by species, place and year.</p>
        <div className="tabla-scroll">
          <table className="perspectiva-tabla">
            <thead><tr><th scope="col">Species</th><th scope="col">What was documented</th></tr></thead>
            <tbody>{conNino.map((e) => <tr key={e.id}><th scope="row">{e.common_name_es}</th><td>{e.el_nino_response_note}</td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="seccion pescadores" id="what-next" aria-labelledby="t-next">
        <p className="puente-kicker">Where this can go</p>
        <h2 id="t-next">What comes next</h2>
        <ol className="pesc-pasos">
          <li><strong>Today.</strong> A validated sea-temperature outlook and documented context for each species.</li>
          <li><strong>With partners.</strong> Talk with fishers and with IMARPE and PRODUCE about the decisions they need to make. Add a calendar of official closed seasons, checked against current rules, and local satellite indicators near each port.</li>
          <li><strong>Goal.</strong> A catch model by species, tested only on data it has not seen, and published only if it clearly beats a normal month. It needs open landing data by port, species and date, with fishing effort.</li>
        </ol>
        <p className="tend-nota"><strong>Limits.</strong> This page does not forecast catches or fish locations, and it is not guidance on sea safety. Check official weather and port notices before going out.</p>
      </section>
    </>
  )
}
