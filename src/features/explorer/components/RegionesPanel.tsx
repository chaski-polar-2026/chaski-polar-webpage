import { useAcciones } from '../hooks/useAcciones'
import { APARTADOS, type Apartado } from '../lib/regiones'
import { variablesDeSeccion } from '../lib/variables'
import { useExplorerStore } from '../store'
import { StepNumber } from './ExplorerOrientation'

/** Los cuatro apartados: se elige uno y el selector de datos solo muestra sus parámetros */
export default function RegionesPanel({ alElegir }: { alElegir?: () => void }) {
  const section = useExplorerStore((s) => s.section)
  const acciones = useAcciones()
  const elegir = (a: Apartado) => {
    const st = useExplorerStore.getState()
    alElegir?.()
    acciones.general()
    st.setSection(a.id)
    st.setSidebarTab(a.id === 'anchoveta' ? 'biologia' : 'parametro')
    st.setMonitorZone(null)
    const primera = variablesDeSeccion(a.id === 'anchoveta' ? 'humboldt' : a.id)[0]
    if (primera) st.setVariable(primera.id)
    st.setPlaying(false)
    st.flyTo(a.pov, 1400)
    if (a.id === 'anchoveta' && window.matchMedia('(max-width: 1100px)').matches) {
      st.setSidebarOpen(true)
    }
  }
  return <nav className="regiones" aria-label="Study areas">
    <p className="regiones-titulo"><StepNumber step={1} />Study areas</p>
    <label className="regiones-movil"><StepNumber step={1} />Study area<select value={section} onChange={(e) => { const apartado = APARTADOS.find(a => a.id === e.target.value); if (apartado) elegir(apartado) }}>
      {APARTADOS.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
    </select></label>
    {APARTADOS.map((a) => <button key={a.id} type="button" className="region" aria-pressed={section === a.id} onClick={() => elegir(a)}>
      <b>{a.nombre}</b>
    </button>)}
  </nav>
}
