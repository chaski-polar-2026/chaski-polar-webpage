import { DATOS_PORTADA, DESAFIO, HALLAZGOS_PORTADA, MOSTRAR_PESCA } from './contenido'

function IconoDato({ tipo }: { tipo: typeof DATOS_PORTADA.tarjetas[number]['icono'] }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {tipo === 'series' && <><path d="M5 5v22h23" /><path d="m9 21 5-7 5 3 7-10" /><circle cx="14" cy="14" r="1.5" /><circle cx="19" cy="17" r="1.5" /></>}
    {tipo === 'tests' && <><path d="M5 26h23M8 24V8m7 16V5m7 19V10" /><path d="M5 8h6m1-3h6m1 5h6m-20 9 21-5" /></>}
    {tipo === 'checks' && <><path d="M5 9h22M5 23h22M10 5v8m12 6v8" /><path d="m10 18 4 4 8-8" /></>}
  </svg>
}

/** Contenido estático: no depende del canvas ni de sus cuadros de animación. */
export default function DesafioPortada() {
  return <div className="portada-estatica">
    <section id="challenge" className="portada-bloque" aria-labelledby="titulo-desafio" tabIndex={-1}>
      <header className="portada-bloque-cabecera"><h2 id="titulo-desafio">{DESAFIO.titulo}</h2><p>{DESAFIO.subtitulo}</p></header>
      <div className="portada-comparacion-cabecera" aria-hidden="true"><span>{DESAFIO.retos}</span><span>{DESAFIO.herramienta}</span></div>
      <div className="portada-comparacion">
        {DESAFIO.filas.filter((fila) => !fila.pesca || MOSTRAR_PESCA).map((fila) => <div className="portada-comparacion-fila" key={fila.reto}>
          <article className="portada-tarjeta"><h3>{DESAFIO.retos}</h3><p>{fila.reto}</p></article>
          <article className="portada-tarjeta"><h3>{DESAFIO.herramienta}</h3><p>{fila.herramienta}</p></article>
        </div>)}
      </div>
      <a className="portada-boton portada-detector" href={DESAFIO.enlace}>{DESAFIO.boton}</a>
    </section>

    <section className="portada-bloque" aria-labelledby="titulo-hallazgos">
      <header className="portada-bloque-cabecera"><h2 id="titulo-hallazgos">{HALLAZGOS_PORTADA.titulo}</h2><p>{HALLAZGOS_PORTADA.subtitulo}</p></header>
      <div className="portada-cifras">
        {HALLAZGOS_PORTADA.tarjetas.map((tarjeta) => <article className="portada-tarjeta" key={tarjeta.cifra}>
          <h3 className="portada-cifra">{tarjeta.cifra}</h3><p className="portada-cifra-etiqueta">{tarjeta.etiqueta}</p>
          {tarjeta.nota && <p className="portada-cifra-nota">{tarjeta.nota}</p>}
        </article>)}
      </div>
      <p className="portada-limite">{HALLAZGOS_PORTADA.limite}</p>
    </section>

    <section className="portada-bloque" aria-labelledby="titulo-datos">
      <header className="portada-bloque-cabecera"><h2 id="titulo-datos">{DATOS_PORTADA.titulo}</h2><p>{DATOS_PORTADA.subtitulo}</p></header>
      <div className="portada-datos">
        {DATOS_PORTADA.tarjetas.map((tarjeta) => <article className="portada-tarjeta" key={tarjeta.titulo}>
          <IconoDato tipo={tarjeta.icono} /><h3>{tarjeta.titulo}</h3><p>{tarjeta.texto}</p>
        </article>)}
      </div>
      <p className="portada-fuentes">{DATOS_PORTADA.fuentes}</p>
    </section>
  </div>
}
