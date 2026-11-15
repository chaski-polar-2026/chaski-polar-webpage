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
  { id: 'lumi', titulo: 'Lumi · phytoplankton', etiqueta: 'Organism', texto: 'Lumi represents a diatom, a type of phytoplankton. The game uses recorded chlorophyll to represent food conditions in the sea.', referencia: 'Reference: game script and explorer chlorophyll variable.' },
  { id: 'kiri', titulo: 'Kiri · Antarctic krill', etiqueta: 'Organism', texto: 'Kiri represents Antarctic krill, which eat phytoplankton. This food chain belongs to Antarctica and differs from that of the Peruvian coast.', referencia: 'Reference: game script.' },
  { id: 'nara', titulo: 'Nara · humpback whale', etiqueta: 'Organism', texto: 'Nara represents a humpback whale whose migration connects the Antarctic and Peruvian settings.', referencia: 'Reference: game script.' },
  { id: 'anchi', titulo: 'Anchi · anchoveta', etiqueta: 'Organism', texto: 'Anchi represents an anchoveta swimming in a school. In the game, its journey reveals relative changes across zones and months.', referencia: 'Reference: game script and ocean engine.' },
  { id: 'orbi', titulo: 'ORBI · satellite observations', etiqueta: 'Tool', texto: 'ORBI introduces satellite observations of ocean color. Chlorophyll helps study phytoplankton; it is not a direct measure of food.', referencia: 'Reference: game script and explorer chlorophyll variable.' },
  { id: 'afloramiento', titulo: 'Coastal upwelling', etiqueta: 'Process', texto: 'Upwelling is the rise of cold, nutrient-rich water off the Peruvian coast. It is presented as context, not a new formula.', referencia: 'Reference: game script and explorer wind variable.' },
  { id: 'lecturas', titulo: 'Three ways to read data', etiqueta: 'Method', texto: 'Observed comes from a recorded chlorophyll anomaly; estimated uses temperature and game coefficients; normal means suitable data are missing.', referencia: 'Reference: motor/mar.ts.' },
  { id: 'simulacion', titulo: 'Data and simulation', etiqueta: 'Method', texto: 'Environmental variables come from project data. Relative food, survival and other outcomes follow educational simulation rules.', referencia: 'Reference: motor/mar.ts and project guide.' },
]

const ZONAS = ['Paita', 'Chimbote', 'Callao', 'Pisco', 'Ilo']

function FichaEducativa({ ficha, consultada, alConsultar }: { ficha: Ficha; consultada: boolean; alConsultar: (id: string) => void }) {
  return <details className="cuaderno-ficha" onToggle={(evento) => { if (evento.currentTarget.open) alConsultar(ficha.id) }}>
    <summary><span className="cuaderno-icono" aria-hidden="true">{ficha.etiqueta.slice(0, 1)}</span><span>{ficha.titulo}</span><span className="cuaderno-flecha" aria-hidden="true">+</span></summary>
    <div className="cuaderno-ficha-cuerpo">
      <p>{ficha.texto}</p>
      <small>{ficha.referencia}</small>
      {consultada && <span className="cuaderno-consultada">Viewed</span>}
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
    Phytoplankton: px.fitoPixel(), Nutrient: px.nutrientePixel(), Penguin: px.pinguinoPixel(), Guanay: px.guanayPixel(), 'Sea lion': px.loboPixel(),
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
      <a href="/juego">← Back to the game</a>
      <h1>Pacific notebook</h1>
      <p>Characters, places and concepts to help read the sea during the game.</p>
      <button type="button" className="juego-caja" aria-pressed={animar} onClick={() => setAnimar((a) => !a)}>{animar ? 'Pause animation' : 'Animate characters'}</button>
      <div className="cuaderno-paleta" aria-label="Character palette">{Object.entries(PALETA).map(([nombre, color]) => <span key={nombre} style={{ background: color }} title={color} />)}</div>
    </header>
    <section className="cuaderno-seccion cuaderno-lecturas" aria-labelledby="cuaderno-lecturas-titulo">
      <div className="cuaderno-seccion-cabecera"><span className="cuaderno-kicker">01 · Field notes</span><h2 id="cuaderno-lecturas-titulo">Concepts to take back to sea</h2><p>Open a card whenever you like. Your viewed cards are collected here during this visit.</p></div>
      <div className="cuaderno-fichas">{FICHAS.map((ficha) => <FichaEducativa key={ficha.id} ficha={ficha} consultada={consultados.has(ficha.id)} alConsultar={marcarConsultado} />)}</div>
      <p className="cuaderno-coleccion">{consultados.size === 0 ? 'You have not viewed any concepts yet.' : `${consultados.size} concept${consultados.size === 1 ? '' : 's'} viewed during this visit.`}</p>
    </section>
    <section className="cuaderno-seccion" aria-labelledby="cuaderno-atlas-titulo">
      <div className="cuaderno-seccion-cabecera"><span className="cuaderno-kicker">02 · Mini atlas</span><h2 id="cuaderno-atlas-titulo">Five coastal zones</h2><p>The game orders these zones from north to south. Each can have different conditions in the same month.</p></div>
      <div className="cuaderno-atlas" role="list" aria-label="Peruvian coastal zones">{ZONAS.map((zona, indice) => <div className="cuaderno-zona" key={zona} role="listitem"><span>{String(indice + 1).padStart(2, '0')}</span><b>{zona}</b></div>)}</div>
      <small className="cuaderno-referencia">Reference: zones defined in motor/mar.ts. The notebook adds no coordinates.</small>
    </section>
    <section className="cuaderno-seccion" aria-labelledby="cuaderno-cadenas-titulo">
      <div className="cuaderno-seccion-cabecera"><span className="cuaderno-kicker">03 · Two seas</span><h2 id="cuaderno-cadenas-titulo">Food chains, different contexts</h2><p>These two chains are a conceptual guide; they do not mean that populations or data are the same.</p></div>
      <div className="cuaderno-cadenas">
        <article><h3>Antarctica</h3><p>Phytoplankton <b>→</b> krill <b>→</b> penguins, seals and whales</p><small>Kiri and Nara’s context.</small></article>
        <article><h3>Peruvian coast</h3><p>Phytoplankton <b>→</b> zooplancton <b>→</b> anchoveta <b>→</b> birds and sea lions</p><small>Anchi and the school’s context.</small></article>
      </div>
    </section>
    <section className="cuaderno-seccion cuaderno-enlaces" aria-labelledby="cuaderno-explorar-titulo">
      <div className="cuaderno-seccion-cabecera"><span className="cuaderno-kicker">04 · Follow the trail</span><h2 id="cuaderno-explorar-titulo">From notebook to explorer</h2><p>Explore the project’s environmental variables and compare the explanation with the available data.</p></div>
      <nav aria-label="Explore variables"><a className="juego-caja" href="/explorer#dato=chlorophyll&vista=satellite">Explore chlorophyll</a><a className="juego-caja" href="/explorer#dato=temperature&vista=satellite">Explore temperature</a></nav>
    </section>
    <section className="cuaderno-seccion cuaderno-sprite-seccion" aria-labelledby="cuaderno-sprites-titulo">
      <div className="cuaderno-seccion-cabecera"><span className="cuaderno-kicker">05 · Visual archive</span><h2 id="cuaderno-sprites-titulo">Pacific inhabitants</h2><p>Original pixel art · enlarged silhouettes · frame animation</p></div>
      <div className="cuaderno-sprite-grid">{lista.map((s) => <figure key={s.nombre}>
        <div className="cuaderno-muestra">{(() => {
          const c = s.srcs[cuadro % s.srcs.length]!
          const escala = Math.max(1, Math.floor(Math.min(180 / c.w, 100 / c.h)))
          return <img src={c.src} alt={s.nombre} width={c.w * escala} height={c.h * escala} />
        })()}</div>
        <figcaption><b>{s.nombre}</b><span>{s.srcs[0]!.w} × {s.srcs[0]!.h} px · {s.srcs.length} frames</span></figcaption>
        <div className="cuaderno-cuadros">{s.srcs.map((c, k) => <a key={k} href={c.src} download={`${s.nombre.toLowerCase()}-${k + 1}.png`} aria-label={`Download ${s.nombre}, frame ${k + 1}`}><img src={c.src} alt="" width={c.w} height={c.h} /></a>)}</div>
      </figure>)}</div>
    </section>
  </div>
}
