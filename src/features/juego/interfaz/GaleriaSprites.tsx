import { useEffect, useMemo, useState } from 'react'
import * as px from '../personajes/pixelart'
import { PALETA } from '../motor/pixel'
import './presentacion.css'

type Ficha = {
  id: string
  titulo: string
  texto: string
  referencia: string
  etiqueta: string
}

const FICHAS: Ficha[] = [
  { id: 'lumi', titulo: 'Lumi · fitoplancton', etiqueta: 'Organismo', texto: 'Lumi representa una diatomea, un tipo de fitoplancton. El juego usa la clorofila registrada para representar las condiciones de alimento del mar.', referencia: 'Referencia: guion del juego y variable chlorophyll del explorador.' },
  { id: 'kiri', titulo: 'Kiri · krill antártico', etiqueta: 'Organismo', texto: 'Kiri representa el krill antártico, que se alimenta de fitoplancton. Esta cadena pertenece al contexto antártico y no es la misma que la del litoral peruano.', referencia: 'Referencia: guion del juego.' },
  { id: 'nara', titulo: 'Nara · ballena jorobada', etiqueta: 'Organismo', texto: 'Nara representa una ballena jorobada que conecta los escenarios narrativos de la Antártida y el Perú mediante su migración.', referencia: 'Referencia: guion del juego.' },
  { id: 'anchi', titulo: 'Anchi · anchoveta', etiqueta: 'Organismo', texto: 'Anchi representa una anchoveta que se desplaza en cardumen. En el juego, su recorrido permite observar cambios relativos entre zonas y meses.', referencia: 'Referencia: guion del juego y motor del mar.' },
  { id: 'orbi', titulo: 'ORBI · lectura satelital', etiqueta: 'Herramienta', texto: 'ORBI introduce la lectura del color del mar desde satélite. La clorofila es una variable usada para estudiar el fitoplancton; no es una medición directa de alimento.', referencia: 'Referencia: guion del juego y variable chlorophyll del explorador.' },
  { id: 'afloramiento', titulo: 'Afloramiento costero', etiqueta: 'Proceso', texto: 'El afloramiento aparece en el guion como el ascenso de agua fría y rica en nutrientes frente a la costa peruana. Aquí se presenta como contexto, no como una fórmula nueva.', referencia: 'Referencia: guion del juego y variable wind del explorador.' },
  { id: 'lecturas', titulo: 'Tres formas de leer un dato', etiqueta: 'Método', texto: 'Observado deriva de una anomalía de clorofila registrada; estimado usa temperatura y coeficientes del juego; normal indica que faltan datos adecuados.', referencia: 'Referencia: motor/mar.ts.' },
  { id: 'simulacion', titulo: 'Dato y simulación', etiqueta: 'Método', texto: 'Las variables ambientales proceden de datos del proyecto. El alimento relativo, la supervivencia y otros resultados son reglas de simulación educativa.', referencia: 'Referencia: motor/mar.ts y guía del proyecto.' },
]

const ZONAS = ['Paita', 'Chimbote', 'Callao', 'Pisco', 'Ilo']

function FichaEducativa({ ficha, consultada, alConsultar }: { ficha: Ficha; consultada: boolean; alConsultar: (id: string) => void }) {
  return <details className="cuaderno-ficha" onToggle={(evento) => { if (evento.currentTarget.open) alConsultar(ficha.id) }}>
    <summary><span className="cuaderno-icono" aria-hidden="true">{ficha.etiqueta.slice(0, 1)}</span><span>{ficha.titulo}</span><span className="cuaderno-flecha" aria-hidden="true">+</span></summary>
    <div className="cuaderno-ficha-cuerpo">
      <p>{ficha.texto}</p>
      <small>{ficha.referencia}</small>
      {consultada && <span className="cuaderno-consultada">Consultado</span>}
    </div>
  </details>
}

/** Galería de sprites ampliados (abrir /juego?sprites=1): sirve para revisar el pixel art sobre el fondo de la página */
export default function GaleriaSprites() {
  const [cuadro, setCuadro] = useState(0)
  const [consultados, setConsultados] = useState<Set<string>>(() => new Set())
  const [animar, setAnimar] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (!animar) return
    const id = window.setInterval(() => setCuadro((c) => c + 1), 160)
    return () => clearInterval(id)
  }, [animar])
  const lista = useMemo(() => Object.entries({
    Nara: px.naraPixel(), Anchi: px.anchiPixel(), Anchoveta: px.anchovetaPixel(), Kiri: px.kiriPixel(), Lumi: px.lumiPixel(),
    Fito: px.fitoPixel(), Nutriente: px.nutrientePixel(), 'Pingüino': px.pinguinoPixel(), Guanay: px.guanayPixel(), Lobo: px.loboPixel(),
    ORBI: px.orbiPixel(), Gaia: px.gaiaPixel(),
  }).map(([nombre, cuadros]) => ({ nombre, srcs: cuadros.map((c) => ({ src: c.toDataURL(), w: c.width, h: c.height })) })), [])
  const marcarConsultado = (id: string) => setConsultados((actuales) => {
    if (actuales.has(id)) return actuales
    const siguientes = new Set(actuales)
    siguientes.add(id)
    return siguientes
  })
  return <div className="juego-galeria cuaderno-sprites">
    <header className="cuaderno-cabecera">
      <a href="/juego">← Volver al juego</a>
      <h1>Cuaderno del Pacífico</h1>
      <p>Personajes, lugares y conceptos para leer el mar durante la partida.</p>
      <button type="button" className="juego-caja" aria-pressed={animar} onClick={() => setAnimar((a) => !a)}>{animar ? 'Pausar animación' : 'Animar personajes'}</button>
      <div className="cuaderno-paleta" aria-label="Paleta de los personajes">{Object.entries(PALETA).map(([nombre, color]) => <span key={nombre} style={{ background: color }} title={`${nombre}: ${color}`} />)}</div>
    </header>
    <section className="cuaderno-seccion cuaderno-lecturas" aria-labelledby="cuaderno-lecturas-titulo">
      <div className="cuaderno-seccion-cabecera"><span className="cuaderno-kicker">01 · Lecturas de campo</span><h2 id="cuaderno-lecturas-titulo">Conceptos para volver al mar</h2><p>Abre una ficha cuando quieras. Las consultas se reúnen aquí durante esta visita.</p></div>
      <div className="cuaderno-fichas">{FICHAS.map((ficha) => <FichaEducativa key={ficha.id} ficha={ficha} consultada={consultados.has(ficha.id)} alConsultar={marcarConsultado} />)}</div>
      <p className="cuaderno-coleccion">{consultados.size === 0 ? 'Todavía no has consultado conceptos.' : `${consultados.size} concepto${consultados.size === 1 ? '' : 's'} consultado${consultados.size === 1 ? '' : 's'} en esta visita.`}</p>
    </section>
    <section className="cuaderno-seccion" aria-labelledby="cuaderno-atlas-titulo">
      <div className="cuaderno-seccion-cabecera"><span className="cuaderno-kicker">02 · Miniatlas</span><h2 id="cuaderno-atlas-titulo">Cinco zonas del litoral</h2><p>El recorrido del juego ordena estas zonas de norte a sur. Cada una puede tener condiciones distintas en un mismo mes.</p></div>
      <div className="cuaderno-atlas" role="list" aria-label="Zonas del litoral peruano">{ZONAS.map((zona, indice) => <div className="cuaderno-zona" key={zona} role="listitem"><span>{String(indice + 1).padStart(2, '0')}</span><b>{zona}</b></div>)}</div>
      <small className="cuaderno-referencia">Referencia: zonas definidas en motor/mar.ts. El cuaderno no añade coordenadas.</small>
    </section>
    <section className="cuaderno-seccion" aria-labelledby="cuaderno-cadenas-titulo">
      <div className="cuaderno-seccion-cabecera"><span className="cuaderno-kicker">03 · Dos mares</span><h2 id="cuaderno-cadenas-titulo">Cadenas de vida, contextos distintos</h2><p>Las dos cadenas son una guía conceptual del juego; no significan que las poblaciones o los datos sean los mismos.</p></div>
      <div className="cuaderno-cadenas">
        <article><h3>Antártida</h3><p>Fitoplancton <b>→</b> krill <b>→</b> pingüinos, focas y ballenas</p><small>Contexto de Kiri y Nara.</small></article>
        <article><h3>Litoral peruano</h3><p>Fitoplancton <b>→</b> zooplancton <b>→</b> anchoveta <b>→</b> aves y lobos marinos</p><small>Contexto de Anchi y del cardumen.</small></article>
      </div>
    </section>
    <section className="cuaderno-seccion cuaderno-enlaces" aria-labelledby="cuaderno-explorar-titulo">
      <div className="cuaderno-seccion-cabecera"><span className="cuaderno-kicker">04 · Seguir la pista</span><h2 id="cuaderno-explorar-titulo">Del cuaderno al explorador</h2><p>Consulta las variables ambientales del proyecto y contrasta la explicación conceptual con los datos disponibles.</p></div>
      <nav aria-label="Explorar variables"><a className="juego-caja" href="/explorer#dato=chlorophyll&vista=satellite">Explorar clorofila</a><a className="juego-caja" href="/explorer#dato=temperature&vista=satellite">Explorar temperatura</a></nav>
    </section>
    <section className="cuaderno-seccion cuaderno-sprite-seccion" aria-labelledby="cuaderno-sprites-titulo">
      <div className="cuaderno-seccion-cabecera"><span className="cuaderno-kicker">05 · Archivo visual</span><h2 id="cuaderno-sprites-titulo">Habitantes del Pacífico</h2><p>Pixel art original · siluetas ampliadas · animación por cuadros</p></div>
      <div className="cuaderno-sprite-grid">{lista.map((s) => <figure key={s.nombre}>
        <div className="cuaderno-muestra">{(() => {
          const c = s.srcs[cuadro % s.srcs.length]!
          const escala = Math.max(1, Math.floor(Math.min(180 / c.w, 100 / c.h)))
          return <img src={c.src} alt={s.nombre} width={c.w * escala} height={c.h * escala} />
        })()}</div>
        <figcaption><b>{s.nombre}</b><span>{s.srcs[0]!.w} × {s.srcs[0]!.h} px · {s.srcs.length} cuadros</span></figcaption>
        <div className="cuaderno-cuadros">{s.srcs.map((c, k) => <a key={k} href={c.src} download={`${s.nombre.toLowerCase()}-${k + 1}.png`} aria-label={`Descargar ${s.nombre}, cuadro ${k + 1}`}><img src={c.src} alt="" width={c.w} height={c.h} /></a>)}</div>
      </figure>)}</div>
    </section>
  </div>
}
