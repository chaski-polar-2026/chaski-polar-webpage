import { ESTRATEGIAS, type Estrategia } from '../logica/cardumen'

const n0 = new Intl.NumberFormat('en', { maximumFractionDigits: 0 })
const n1 = new Intl.NumberFormat('en', { maximumFractionDigits: 1, signDisplay: 'exceptZero' })

export interface ResultadoAnio {
  anio: number
  inicial: number
  sobrevivientes: number
  estrategia: Estrategia['id']
  alimentoPromedio: number | null
  ninoPromedio: number | null
}

/** Lo que el jugador aprendió sin tutoriales (propuesta del juego, sección 6) */
const APRENDIZAJES = [
  'El Niño hits hard and recovery is slow: warmth reduces phytoplankton much more than cold brings it back.',
  'The coast is not affected equally: Chimbote and Callao are most vulnerable; Paita changes little.',
  'Migrating animals connect Antarctica and Peru, but each sea has its own drivers.',
  'Two things happening together does not prove that one causes the other.',
  'Fishing also puts pressure on the school.',
]

/** Cierre de la campaña: resumen de cada generación y lo aprendido */
export default function Final({ resultados, alRepetir, alMenu }: { resultados: ResultadoAnio[]; alRepetir: () => void; alMenu: () => void }) {
  return <div className="juego-informe-fondo" role="dialog" aria-modal="true" aria-labelledby="t-final">
    <article className="juego-informe">
      <h2 id="t-final">The school’s saga</h2>
      <table className="juego-diario">
        <thead><tr><th scope="col">Year</th><th scope="col">Initial</th><th scope="col">Survivors</th><th scope="col">Strategy</th></tr></thead>
        <tbody>{resultados.map((r) => <tr key={r.anio}>
          <th scope="row">{r.anio}</th><td>{n0.format(r.inicial)}</td><td>{n0.format(r.sobrevivientes)}</td><td>{r.estrategia === 'ninguna' ? '—' : ESTRATEGIAS[r.estrategia].nombre}</td>
        </tr>)}</tbody>
      </table>
      <section className="juego-final-ambiente" aria-labelledby="t-ambiente">
        <h3 id="t-ambiente">How did the sea change?</h3>
        <table className="juego-diario">
          <thead><tr><th scope="col">Year</th><th scope="col">Relative food</th><th scope="col">Average Niño 1+2</th></tr></thead>
          <tbody>{resultados.map((r) => <tr key={r.anio}>
            <th scope="row">{r.anio}</th>
            <td>{r.alimentoPromedio == null ? 'No data' : `${Math.round(r.alimentoPromedio * 100)}% of normal`}</td>
            <td>{r.ninoPromedio == null ? 'No data' : `${n1.format(r.ninoPromedio)} °C`}</td>
          </tr>)}</tbody>
        </table>
        {resultados.length === 1 && <p className="pie">You explored one season.</p>}
        <p className="pie">Ocean conditions change between periods. Relative food is an indicator derived or assumed by the game, while Niño 1+2 is an environmental index; survival results belong to the simulation.</p>
      </section>
      <p className="pie">Survivors belong to the educational Cardumen simulation; they are not a measured real population.</p>
      <h3>What the data show</h3>
      <ul className="juego-aprendizajes">{APRENDIZAJES.map((a) => <li key={a}>{a}</li>)}</ul>
      <p><b>This story is not over: satellites are still measuring.</b></p>
      <div className="acciones">
        <a className="juego-caja principal" href="/explorer#tema=nino2026&vista=satellite">View El Niño 2026 in the explorer</a>
        <a className="juego-caja" href="/juego?sprites=1">Open the Pacific notebook</a>
        <a className="juego-caja" href="/explorer#dato=chlorophyll&vista=satellite">Explore environmental data</a>
        <button type="button" className="juego-caja" onClick={alRepetir}>Play again</button>
        <button type="button" className="juego-caja" onClick={alMenu}>Menu</button>
      </div>
    </article>
  </div>
}
