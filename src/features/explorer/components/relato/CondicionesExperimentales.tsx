import { EXPERIMENTOS } from '../../data/experimentos-especies'
import './experimentos.css'

/** Evidencia experimental por especie, independiente del mes o las condiciones del globo. */
export default function CondicionesExperimentales({ id }: { id: string }) {
  const estudio = EXPERIMENTOS[id]
  if (!estudio) return <details className="especie-experimento especie-experimento--vacio">
    <summary className="especie-experimento-cabecera">
      <span className="especie-experimento-titulo">Experimental findings</span>
      <span className="especie-experimento-tipo">No supported values</span>
    </summary>
    <div className="especie-experimento-contenido"><p>No supported experimental values to show from the studies reviewed.</p></div>
  </details>

  return <details className="especie-experimento">
    <summary className="especie-experimento-cabecera">
      <span className="especie-experimento-titulo">Experimental findings</span>
      <span className="especie-experimento-tipo">Laboratory study{estudio.resumen && ' · Study abstract'}</span>
      <span className="especie-experimento-resumen">{estudio.valores.map(v => <span key={v.variable}>{v.variable}: <strong>{v.valor}</strong></span>)}</span>
    </summary>
    <div className="especie-experimento-contenido">
    <p className="especie-experimento-contexto">{estudio.etapa} · {estudio.lugar}</p>
    <dl className="especie-experimento-valores">
      {estudio.valores.map(v => <div key={v.variable}>
        <dt>{v.variable}</dt>
        <dd>{v.valor}<span>{v.detalle}</span></dd>
      </div>)}
    </dl>
    <p className="especie-experimento-resultado"><strong>Observed result</strong> {estudio.resultado}</p>
    <p className="especie-experimento-alcance">{estudio.alcance}</p>
    <details className="especie-experimento-detalles">
      <summary>Study context and limits</summary>
      <p>{estudio.contexto}</p>
      <p>{estudio.limites}</p>
      <p className="especie-experimento-localizador">{estudio.fuente.localizador}. These findings describe an experiment, not conditions for the selected month or a catch forecast.</p>
    </details>
    <a className="especie-experimento-fuente" href={estudio.fuente.enlace} target="_blank" rel="noreferrer">Read the study · {estudio.fuente.nombre}</a>
    </div>
  </details>
}
