import { IconoVariable } from '../../guias/GuiasInvestigacion'
import { Lectura, Guia } from '../../lectura/PanelLectura'
import { useExplorer } from '../ExplorerContext'
import { useTendenciaZona } from '../hooks/useTendenciaZona'
import { esPeru } from '../lib/modelo'
import type { IdZona } from '../lib/tipos'
import { variablePorId } from '../lib/variables'
import { useExplorerStore } from '../store'

const CAMPOS = [
  ['temperatura_superficial_C', 'temperature'], ['clorofila_mg_m3', 'chlorophyll'],
  ['nivel_mar_anomalia_m', 'sealevel'], ['oxigeno_disuelto', 'oxygen'], ['hielo', 'seaice'],
] as const
export default function DatosZona({ zona }: { zona: IdZona }) {
  const { modelo } = useExplorer()
  const month = useExplorerStore(s => s.month)
  const variable = useExplorerStore(s => s.variable)
  const v = variablePorId(variable)
  const { tendencia } = useTendenciaZona(modelo, zona, v)
  return <section className="zona-lecturas" aria-label="Selected month and trend">
    <ul className="vista-zona-cifras">{CAMPOS.filter(([id]) => id !== 'hielo' || !esPeru(zona)).map(([id, tipo]) => {
      const campo = variablePorId(id)
      const x = id === 'oxigeno_disuelto' && !esPeru(zona) ? null : modelo.valorZona(zona, campo, month)
      return <li key={id}><IconoVariable tipo={tipo} /><span>{campo.nombre}</span><b>{x == null ? 'no data for this zone' : modelo.valorTxt(campo, x)}</b>
        {(campo.modo === 'regional' || campo.modo === 'indice') && <small>{campo.cobertura}. Not a local measurement.</small>}
      </li>
    })}</ul>
    <h4>{v.nombre}</h4>
    <p className="zona-tendencia"><strong>{tendencia}</strong> Estimated change per decade (1998–{modelo.mes(modelo.ultimoObservado).anio})</p>
    <Lectura modelo={modelo} zona={zona} variable={v} mes={month} />
    <Guia variable={v} />
  </section>
}
