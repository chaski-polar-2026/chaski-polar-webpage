import { useExplorer } from '../../ExplorerContext'
import { useAcciones } from '../../hooks/useAcciones'
import type { IdCorriente } from '../../lib/estado'
import { esPeru } from '../../lib/modelo'
import { BotonVolver, ChipsVariables } from './comun'

/** Corriente de Humboldt o Circumpolar Antártica */
export default function Corriente({ id }: { id: IdCorriente }) {
  const { modelo } = useExplorer()
  const acciones = useAcciones()
  if (id === 'humboldt') return <>
    <BotonVolver />
    <h2>Humboldt Current</h2>
    <div className="region">From southern Chile to northern Peru</div>
    <p>Cold coastal water and nutrient-rich upwelling.</p>
    <h3>What would you like to see on the globe?</h3>
    <ChipsVariables zona={null} />
    <h3>Zones along the current</h3>
    <div className="chips">{modelo.ids.filter(esPeru).map((z) => <button key={z} className="chip" type="button" onClick={() => acciones.irAZona(z)}>{modelo.zona(z).nombre}</button>)}</div>
  </>
  return <>
    <BotonVolver />
    <h2>Antarctic Circumpolar Current</h2>
    <div className="region">Around Antarctica</div>
    <p>Flows eastward around Antarctica.</p>
    <details className="datos-detalle"><summary>Connection with Peru</summary><p>Our analysis found no robust direct relationship between Antarctic and Peruvian phytoplankton.</p></details>
    <h3>What would you like to explore?</h3>
    <div className="chips">
      <button className="chip" type="button" onClick={() => acciones.irAZona('antartida_peninsula')}>Antarctic Peninsula</button>
      <button className="chip" type="button" onClick={() => acciones.corriente('humboldt')}>Humboldt Current</button>
      <button className="chip" type="button" onClick={acciones.base}>Machu Picchu Base</button>
    </div>
  </>
}
