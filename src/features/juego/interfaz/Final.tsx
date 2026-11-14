import { ESTRATEGIAS, type Estrategia } from '../logica/cardumen'

const n0 = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 0 })
const n1 = new Intl.NumberFormat('es-PE', { maximumFractionDigits: 1, signDisplay: 'exceptZero' })

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
  'El Niño golpea fuerte y la recuperación es lenta: el calor resta mucho fitoplancton y el frío devuelve poco.',
  'No toda la costa sufre igual: Chimbote y Callao son los más frágiles; Paita casi no cambia.',
  'La vida une la Antártida y el Perú por los animales que migran, pero cada mar tiene su propio motor.',
  'Que dos cosas pasen juntas no prueba que una cause la otra.',
  'La pesca también es una presión sobre el cardumen.',
]

/** Cierre de la campaña: resumen de cada generación y lo aprendido */
export default function Final({ resultados, alRepetir, alMenu }: { resultados: ResultadoAnio[]; alRepetir: () => void; alMenu: () => void }) {
  return <div className="juego-informe-fondo" role="dialog" aria-modal="true" aria-labelledby="t-final">
    <article className="juego-informe">
      <h2 id="t-final">La saga del cardumen</h2>
      <table className="juego-diario">
        <thead><tr><th scope="col">Año</th><th scope="col">Inicial</th><th scope="col">Sobrevivientes</th><th scope="col">Estrategia</th></tr></thead>
        <tbody>{resultados.map((r) => <tr key={r.anio}>
          <th scope="row">{r.anio}</th><td>{n0.format(r.inicial)}</td><td>{n0.format(r.sobrevivientes)}</td><td>{r.estrategia === 'ninguna' ? '—' : ESTRATEGIAS[r.estrategia].nombre}</td>
        </tr>)}</tbody>
      </table>
      <section className="juego-final-ambiente" aria-labelledby="t-ambiente">
        <h3 id="t-ambiente">¿Cómo cambió el mar?</h3>
        <table className="juego-diario">
          <thead><tr><th scope="col">Año</th><th scope="col">Alimento relativo</th><th scope="col">Niño 1+2 promedio</th></tr></thead>
          <tbody>{resultados.map((r) => <tr key={r.anio}>
            <th scope="row">{r.anio}</th>
            <td>{r.alimentoPromedio == null ? 'Sin dato' : `${Math.round(r.alimentoPromedio * 100)} % de lo normal`}</td>
            <td>{r.ninoPromedio == null ? 'Sin dato' : `${n1.format(r.ninoPromedio)} °C`}</td>
          </tr>)}</tbody>
        </table>
        {resultados.length === 1 && <p className="pie">Has explorado una temporada.</p>}
        <p className="pie">Las condiciones del océano cambian entre periodos. El alimento relativo es un indicador derivado o asumido por el juego, mientras Niño 1+2 es un índice ambiental; los resultados de supervivencia pertenecen a la simulación.</p>
      </section>
      <p className="pie">Los sobrevivientes corresponden a la simulación educativa de Cardumen; no son una población real medida.</p>
      <h3>Lo que muestran los datos</h3>
      <ul className="juego-aprendizajes">{APRENDIZAJES.map((a) => <li key={a}>{a}</li>)}</ul>
      <p><b>Esta historia aún no termina: los satélites siguen midiendo.</b></p>
      <div className="acciones">
        <a className="juego-caja principal" href="/explorer#tema=nino2026&vista=satellite">Ver El Niño 2026 en el explorador</a>
        <a className="juego-caja" href="/juego?sprites=1">Abrir Cuaderno del Pacífico</a>
        <a className="juego-caja" href="/explorer#dato=chlorophyll&vista=satellite">Explorar datos ambientales</a>
        <button type="button" className="juego-caja" onClick={alRepetir}>Jugar otra vez</button>
        <button type="button" className="juego-caja" onClick={alMenu}>Menú</button>
      </div>
    </article>
  </div>
}
