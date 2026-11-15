import { IconoVariable } from '../guias/GuiasInvestigacion'
import './pescadores.css'

/* Guías ilustradas esquemáticas para lectores no especialistas. Son dibujos simplificados, no a escala. */

const FRIO = '#2a74c9', CALIDO = '#f08a4b', TXT = '#eaf3f5', SUAVE = '#a3bccb', CIAN = '#8fe3f2'

function Afloramiento() {
  return (
    <svg viewBox="0 0 420 250" width="100%" role="img" aria-label="Cross-section of the sea off Peru. Wind blows along the coast, pushes surface water away from land, and cold nutrient-rich water rises near the coast, where plankton grow and fish feed.">
      <defs>
        <linearGradient id="ag-mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f86c9" /><stop offset="1" stopColor="#0a2540" /></linearGradient>
        <marker id="ag-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10Z" fill={CIAN} /></marker>
        <marker id="ag-c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 10 5 0 10Z" fill={FRIO} /></marker>
      </defs>
      <rect width="420" height="250" rx="8" fill="#0c2c4a" />
      <rect x="0" y="62" width="420" height="188" fill="url(#ag-mar)" />
      <path d="M330 62 L420 62 L420 250 L300 250 C318 190 322 130 330 62Z" fill="#b9a077" fillOpacity=".9" />
      <path d="M12 64 C60 58 110 70 160 64 S250 58 330 64" fill="none" stroke="#eaf3f5" strokeOpacity=".5" />
      <circle cx="250" cy="22" r="9" fill="none" stroke={CIAN} strokeWidth="2.2" /><path d="M244 16 256 28M256 16 244 28" stroke={CIAN} strokeWidth="2.2" />
      <text x="20" y="26" fill={TXT} fontSize="12" fontWeight="600">1. Wind blows along the coast (into the page)</text>
      <path d="M200 78 H90" stroke={CIAN} strokeWidth="2.5" markerEnd="url(#ag-f)" fill="none" />
      <text x="20" y="98" fill={TXT} fontSize="12">2. Surface water is pushed offshore</text>
      <path d="M300 220 C296 180 292 150 292 112" stroke={FRIO} strokeWidth="3" markerEnd="url(#ag-c)" fill="none" />
      <text x="170" y="196" fill={TXT} fontSize="12" textAnchor="middle">3. Cold, nutrient-rich water</text>
      <text x="170" y="211" fill={TXT} fontSize="12" textAnchor="middle">rises from below</text>
      <circle cx="262" cy="86" r="3" fill="#3fc28c" /><circle cx="278" cy="92" r="2.5" fill="#3fc28c" /><circle cx="248" cy="96" r="2.5" fill="#3fc28c" /><circle cx="270" cy="102" r="3" fill="#3fc28c" />
      <text x="262" y="140" fill="#3fc28c" fontSize="12" textAnchor="middle">4. Plankton grow</text>
      <text x="262" y="155" fill={SUAVE} fontSize="11" textAnchor="middle">and fish feed here</text>
      <text x="340" y="150" fill="#4a3d27" fontSize="12" fontWeight="600">LAND</text>
    </svg>
  )
}

function NinoDiagrama() {
  const mar = (x: number, calido: boolean) => (
    <g transform={`translate(${x} 0)`}>
      <rect width="196" height="150" y="40" rx="6" fill={calido ? '#7a4a2b' : '#0f4a7a'} fillOpacity={0.55} />
      <rect width="196" height="150" y="40" rx="6" fill="none" stroke="#24507a" />
      <path d="M150 40 H196 V190 H132 C146 150 148 90 150 40Z" fill="#b9a077" fillOpacity=".9" />
      <path d={calido ? 'M6 78 C60 74 110 82 146 78' : 'M6 78 C60 74 110 82 146 78'} stroke={calido ? CALIDO : FRIO} strokeWidth="14" strokeOpacity=".75" fill="none" strokeLinecap="round" />
      {calido
        ? <><path d="M20 140 C60 142 100 140 130 138" stroke={FRIO} strokeWidth="3" strokeOpacity=".7" fill="none" /></>
        : <path d="M130 168 C128 140 126 120 126 96" stroke={FRIO} strokeWidth="3" fill="none" />}
      <text x="98" y="30" fill={TXT} fontSize="13" fontWeight="700" textAnchor="middle">{calido ? 'El Niño (warm event)' : 'Normal conditions'}</text>
    </g>
  )
  return (
    <svg viewBox="0 0 420 250" width="100%" role="img" aria-label="Two side-by-side cross-sections. Normal conditions: cold water rises near the Peruvian coast and plankton are abundant. El Niño: warm surface water spreads toward the coast, upwelling brings less nutrient-rich water, and plankton can decline.">
      <rect width="420" height="250" rx="8" fill="#0c2c4a" />
      {mar(8, false)}{mar(216, true)}
      <text x="106" y="212" fill="#3fc28c" fontSize="11.5" textAnchor="middle">Cold water rises: plankton abundant</text>
      <text x="314" y="212" fill={CALIDO} fontSize="11.5" textAnchor="middle">Warm water at the surface: plankton</text>
      <text x="314" y="226" fill={CALIDO} fontSize="11.5" textAnchor="middle">and fish often change</text>
      <text x="210" y="243" fill={SUAVE} fontSize="10.5" textAnchor="middle">Schematic. Effects differ by species, place and event.</text>
    </svg>
  )
}

const PASOS = [
  { n: 1, titulo: 'Pick your zone', texto: 'Find the coastal zone nearest to you on the map: Paita, Chimbote, Callao, Pisco or Ilo.' },
  { n: 2, titulo: 'Read the outlook', texto: 'The chart shows how well the sea-temperature outlook worked in the past, one to three months ahead.' },
  { n: 3, titulo: 'Check the species', texto: 'Each card shows what has been documented for that species. It is context, not a prediction.' },
]
const VARIABLES = [
  { nombre: 'Temperature', texto: 'How warm the sea surface is', color: '#f08a4b', tipo: 'temperature' },
  { nombre: 'Chlorophyll', texto: 'How much plankton the water holds', color: '#3fc28c', tipo: 'chlorophyll' },
  { nombre: 'Sea level', texto: 'Height of the sea surface', color: '#63cde8', tipo: 'sealevel' },
  { nombre: 'Oxygen', texto: 'How much oxygen is in the water', color: '#9fe0f2', tipo: 'oxygen' },
  { nombre: 'Sea ice', texto: 'Ice floating around Antarctica', color: '#eaf3f5', tipo: 'seaice' },
]

/** Pasos de uso, diagramas explicativos y leyenda de variables para la página de pescadores. */
export default function GuiasPescadores() {
  return (
    <>
      <section className="seccion pescadores" id="how-to-use" aria-labelledby="t-uso">
        <p className="puente-kicker">Start here</p>
        <h2 id="t-uso">How to use this page</h2>
        <ol className="pesc-pasos-guia">
          {PASOS.map((p) => <li key={p.n}><span className="pesc-paso-n" aria-hidden="true">{p.n}</span><div><strong>{p.titulo}</strong><p>{p.texto}</p></div></li>)}
        </ol>
      </section>

      <section className="seccion pescadores" id="how-the-sea-works" aria-labelledby="t-mar">
        <p className="puente-kicker">Why this sea is rich</p>
        <h2 id="t-mar">How the sea off Peru works</h2>
        <div className="pesc-diagramas">
          <figure><Afloramiento /><figcaption>Upwelling: winds along the coast bring cold, nutrient-rich water to the surface. This is why the Peruvian sea supports so much life. Simplified drawing, not to scale.</figcaption></figure>
          <figure><NinoDiagrama /><figcaption>During El Niño, warm water spreads toward the coast and upwelling can bring water that is warmer and poorer in nutrients. Documented effects on species have varied between events.</figcaption></figure>
        </div>
      </section>

      <section className="seccion pescadores" id="legend" aria-labelledby="t-leyenda">
        <h2 id="t-leyenda">What the variables and colours mean</h2>
        <ul className="pesc-variables">
          {VARIABLES.map((v) => <li key={v.nombre}><IconoVariable tipo={v.tipo as "temperature" | "chlorophyll" | "sealevel" | "oxygen" | "seaice"} /><div><strong>{v.nombre}</strong><span>{v.texto}</span></div></li>)}
        </ul>
        <div className="pesc-escala" role="img" aria-label="Colour scale from blue, colder or lower than normal, through light, normal, to orange or red, warmer or higher than normal.">
          <span>Colder or lower than normal</span><i aria-hidden="true" /><span>Warmer or higher than normal</span>
        </div>
        <p className="tend-nota">Chlorophyll maps show the amount of plankton instead: low to high. The legend on each map says which scale applies.</p>
      </section>
    </>
  )
}
