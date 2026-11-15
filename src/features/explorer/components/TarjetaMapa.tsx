import MapaCosta from '../../pescadores/MapaCosta'
import { useExplorerStore } from '../store'
import './tarjeta-mapa.css'

const ZONAS_MAPA = ['paita', 'chimbote', 'callao', 'pisco', 'ilo']

/** Mapa esquemático que acompaña a la zona de Perú seleccionada o a la corriente de Humboldt. */
export default function TarjetaMapa() {
  const panel = useExplorerStore((s) => s.panel)
  let resaltar: string | undefined, titulo = ''
  if (panel.tipo === 'zona') {
    const id = ZONAS_MAPA.find((z) => panel.z.includes(z))
    if (!id) return null
    resaltar = id; titulo = 'Where this zone is'
  } else if (panel.tipo === 'corriente' && panel.id === 'humboldt') {
    titulo = 'The Humboldt Current along Peru'
  } else return null
  return (
    <aside className="tarjeta-mapa" aria-label={titulo}>
      <p className="tarjeta-mapa-titulo">{titulo}</p>
      <MapaCosta resaltar={resaltar} compacto />
    </aside>
  )
}
