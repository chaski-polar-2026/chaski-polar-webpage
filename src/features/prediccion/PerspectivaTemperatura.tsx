import datos from './perspectiva_acierto.json'
import './prediccion.css'

const NOMBRES: Record<string, string> = { paita: 'Paita', chimbote: 'Chimbote', callao: 'Callao', pisco: 'Pisco', ilo: 'Ilo' }
const HORIZONTES = [1, 2, 3]
const pct = (v: number) => `${v >= 0 ? '+' : '−'}${Math.abs(v * 100).toFixed(0)}%`

/** Habilidad retrospectiva del pronóstico de temperatura superficial; no es un pronóstico de pesca. */
export default function PerspectivaTemperatura() {
  const filas = datos.results.filter((f) => f.variable === 'SST' && f.model === 'nino')
  const zonas = Object.keys(NOMBRES).filter((z) => filas.some((f) => f.zone === z))
  return (
    <section className="seccion prediccion" id="temperature-outlook" aria-labelledby="t-temp-outlook">
      <p className="puente-kicker">One to three months ahead</p>
      <h2 id="t-temp-outlook">Can we anticipate sea surface temperature?</h2>
      <p className="nota">We tested a simple model that predicts the monthly temperature anomaly from El Niño 1+2 and from the last known month. Each month from 2010 to 2025 was predicted using only earlier data. The table shows how much smaller the errors were than simply predicting a normal month.</p>
      <div className="tabla-scroll">
        <table className="perspectiva-tabla">
          <caption className="sr-only">Error reduction versus a normal month, by coastal zone and months ahead</caption>
          <thead><tr><th scope="col">Coastal zone</th>{HORIZONTES.map((h) => <th scope="col" key={h}>{h} month{h > 1 ? 's' : ''} ahead</th>)}</tr></thead>
          <tbody>{zonas.map((z) => <tr key={z}><th scope="row">{NOMBRES[z]}</th>{HORIZONTES.map((h) => {
            const f = filas.find((x) => x.zone === z && x.horizon_months === h)
            if (!f) return <td key={h}>No data</td>
            const claro = f.status.startsWith('clear')
            return <td key={h} data-claro={claro}>{pct(f.mae_improvement)}<small> ({pct(f.ci95[0])} to {pct(f.ci95[1])})</small><small>{claro ? 'Clear improvement' : 'Not clearly better'}</small></td>
          })}</tr>)}</tbody>
        </table>
      </div>
      <p className="tend-nota">A positive value means smaller errors than a normal month; the range is a 95% interval. One month ahead the model is clearly better in every zone. At two and three months the gain shrinks and in some zones it is not clear.</p>
      <p className="tend-nota"><strong>Try it yourself.</strong> In <a href="/extra-game/juego.html">From Ice to Anchovy</a>, a small pixel-art game, you read ocean signals and guess whether Peruvian fishing rose or fell each year. It shows associations, not proven causes, and it is separate from the temperature outlook above.</p>
      <p className="tend-nota"><strong>Limits.</strong> {datos.warning} This is an outlook for sea temperature only. It is not a forecast of fish or fishing.</p>
    </section>
  )
}
