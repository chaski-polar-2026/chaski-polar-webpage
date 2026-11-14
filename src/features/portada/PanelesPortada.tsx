import { DATOS_PORTADA, DESAFIO, HALLAZGOS_PORTADA, MOSTRAR_PESCA, SECCIONES } from './contenido'

export default function PanelesPortada({ sinEscena }: { sinEscena: boolean }) {
  return SECCIONES.map((s, indice) => <section key={indice}
    id={s.variante === 'reto' ? 'challenge' : undefined}
    className={`portada-seccion${s.variante ? ` portada-panel portada-panel--${s.variante}` : ''}${sinEscena || indice === 0 ? ' activa' : ''}`}
    tabIndex={-1} inert={!sinEscena && indice !== 0} aria-hidden={!sinEscena && indice !== 0}>
    {s.variante === 'reto' ? <>
      <p className="portada-antetitulo">{DESAFIO.subtitulo}</p><h2>{DESAFIO.titulo}</h2><p>{DESAFIO.resumen}</p>
      <div className="portada-comparacion">{DESAFIO.filas.filter(f => !f.pesca || MOSTRAR_PESCA).map(f =>
        <div className="portada-comparacion-fila" key={f.reto}>
          <div><h3>{DESAFIO.retos}</h3><p>{f.reto}</p></div><div><h3>{DESAFIO.herramienta}</h3><p>{f.herramienta}</p></div>
        </div>)}</div>
      <a className="portada-boton portada-detector" href={DESAFIO.enlace}>{DESAFIO.boton}</a>
    </> : s.variante === 'cifras' ? <>
      <h2>{HALLAZGOS_PORTADA.titulo}</h2>
      <div className="portada-cifras">{HALLAZGOS_PORTADA.tarjetas.map(t => <article key={t.cifra}>
        <h3 className="portada-cifra">{t.cifra}</h3><p>{t.etiqueta}</p>{t.nota && <p className="portada-nota">{t.nota}</p>}
      </article>)}</div><p className="portada-nota">{HALLAZGOS_PORTADA.limite}</p>
    </> : s.variante === 'metodo' ? <>
      <h2>{DATOS_PORTADA.titulo}</h2><div className="portada-datos">{DATOS_PORTADA.tarjetas.map(t =>
        <article key={t.titulo}><h3>{t.titulo}</h3><p>{t.texto}</p></article>)}</div><p className="portada-nota">{DATOS_PORTADA.fuentes}</p>
    </> : <>
      {s.principal ? <h1 aria-label={s.titulo}><span className="t-contorno">{s.titulo.split(' ')[0]}</span><span className="t-relleno">{s.titulo.split(' ').slice(1).join(' ')}</span></h1> : <h2>{s.titulo}</h2>}
      <p>{s.texto}</p>{s.botones?.map(b => b.href || sinEscena
        ? <a className="portada-boton" href={b.href ?? '/explorer'} key={b.texto}>{b.texto}</a>
        : <button className="portada-boton" type="button" data-entrar key={b.texto}>{b.texto}</button>)}
    </>}
  </section>)
}
