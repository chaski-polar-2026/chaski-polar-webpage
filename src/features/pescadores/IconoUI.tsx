import aviso from './iconos/aviso.svg?raw'
import bote from './iconos/bote.svg?raw'
import grafico from './iconos/grafico.svg?raw'
import libro from './iconos/libro.svg?raw'
import ubicacion from './iconos/ubicacion.svg?raw'
import calendario from './iconos/calendario.svg?raw'

const ICONOS = { aviso, bote, grafico, libro, ubicacion, calendario } as const

/** Ícono decorativo de línea (SVG propio del repo) que toma el color del texto. */
export default function IconoUI({ nombre }: { nombre: keyof typeof ICONOS }) {
  return <span className="icono-ui" aria-hidden="true" dangerouslySetInnerHTML={{ __html: ICONOS[nombre] }} />
}
