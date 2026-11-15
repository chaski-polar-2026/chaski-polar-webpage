import { DATOS_PORTADA, DESAFIO, HALLAZGOS_PORTADA, MOSTRAR_PESCA, SECCIONES } from './contenido'

type Icono = 'nivel' | 'periodo' | 'pruebas' | 'temperatura' | 'satelite' | 'codigo'
const trazos: Record<Icono, string> = {
  nivel: 'M3 17c3-4 6 4 9 0s6 4 9 0M3 21c3-4 6 4 9 0s6 4 9 0M12 3v10m-4-4 4 4 4-4',
  periodo: 'M7 3v4m10-4v4M4 10h16M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1M8 14h2m4 0h2m-8 3h2',
  pruebas: 'M4 19V5m0 14h17M8 15l4-5 4 2 5-7',
  temperatura: 'M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0M12 9v9m5-10h3m-3 4h2',
  satelite: 'm9 9 6 6m-7-7 4-4 8 8-4 4-8-8ZM4 10l4 4-4 4-3-3 3-5Zm10-6 4-3 3 3-3 4-4-4ZM10 18a4 4 0 0 1-4-4m7 7a7 7 0 0 1-10-10',
  codigo: 'm8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16',
}
function IconoPortada({ tipo }: { tipo: Icono }) {
  return <svg className="portada-icono" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={trazos[tipo]} /></svg>
}

export default function PanelesPortada({ sinEscena }: { sinEscena: boolean }) {
  return SECCIONES.map((s, indice) => <section key={indice}
    id={s.variante === 'reto' ? 'challenge' : undefined}
    className={`portada-seccion${s.variante ? ` portada-panel portada-panel--${s.variante}` : ''}${sinEscena || indice === 0 ? ' activa' : ''}`}
    tabIndex={-1} inert={!sinEscena && indice !== 0} aria-hidden={!sinEscena && indice !== 0}>
    {s.variante === 'reto' ? <>
      <p className="portada-antetitulo">{DESAFIO.subtitulo}</p><h2>{DESAFIO.titulo}</h2><p>{DESAFIO.resumen}</p>
      <div className="portada-pregunta">
        <article><h3>{DESAFIO.retos}</h3>{DESAFIO.filas.filter(f => !f.pesca || MOSTRAR_PESCA).map(f => <p key={f.reto}>{f.reto}</p>)}</article>
        <article><h3>{DESAFIO.herramienta}</h3>{DESAFIO.filas.filter(f => !f.pesca || MOSTRAR_PESCA).map(f => <p key={f.reto}>{f.herramienta}</p>)}</article>
      </div>
      <a className="portada-boton portada-detector" href={DESAFIO.enlace}>{DESAFIO.boton}</a>
    </> : s.variante === 'cifras' ? <>
      <h2>{HALLAZGOS_PORTADA.titulo}</h2>
      <div className="portada-cifras">{HALLAZGOS_PORTADA.tarjetas.map(t => <article key={t.icono}>
        <IconoPortada tipo={t.icono} /><p className="portada-cifra">{'prefijo' in t && <span className="portada-prefijo">{t.prefijo} </span>}{t.cifra}</p><h3>{t.etiqueta}</h3><p className="portada-nota">{t.nota}</p>
      </article>)}</div><p className="portada-nota">{HALLAZGOS_PORTADA.limite}</p>
    </> : s.variante === 'metodo' ? <>
      <h2>{DATOS_PORTADA.titulo}</h2><div className="portada-datos">{DATOS_PORTADA.tarjetas.map(t =>
        <article key={t.titulo}><IconoPortada tipo={t.icono} /><h3>{t.titulo}</h3><p>{t.texto}</p></article>)}</div><a className="portada-fuentes" href={DATOS_PORTADA.enlace}>{DATOS_PORTADA.fuentes}</a>
    </> : <>
      {s.principal ? <h1 aria-label={s.titulo}><span className="t-contorno">{s.titulo.split(' ')[0]}</span><span className="t-relleno">{s.titulo.split(' ').slice(1).join(' ')}</span></h1> : <h2>{s.titulo}</h2>}
      <p>{s.texto}</p>{s.botones?.map(b => b.href || sinEscena
        ? <a className="portada-boton" href={b.href ?? '/explorer'} key={b.texto}>{b.texto}</a>
        : <button className="portada-boton" type="button" data-entrar key={b.texto}>{b.texto}</button>)}
    </>}
  </section>)
}
