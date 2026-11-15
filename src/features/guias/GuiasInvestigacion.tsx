import type { ReactNode } from 'react'
import './guias.css'

/* Ayudas visuales para lectores no especialistas. Todo son dibujos esquemáticos; el ejemplo del gráfico usa números inventados y lo dice. */

const SUAVE = '#a3bccb', CIAN = '#8fe3f2'

const Ico = ({ children, color }: { children: ReactNode; color: string }) => (
  <svg className="guia-ico" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
)

/** Icono simple por variable del proyecto. */
export function IconoVariable({ tipo }: { tipo: 'temperature' | 'chlorophyll' | 'sealevel' | 'oxygen' | 'seaice' }) {
  switch (tipo) {
    case 'temperature': return <Ico color="#f08a4b"><path d="M13 6a3 3 0 0 1 6 0v12.2a6 6 0 1 1-6 0Z" /><path d="M16 12v10" /></Ico>
    case 'chlorophyll': return <Ico color="#3fc28c"><circle cx="11" cy="12" r="4" /><circle cx="21" cy="10" r="3" /><circle cx="19" cy="21" r="5" /><circle cx="9" cy="23" r="2.5" /></Ico>
    case 'sealevel': return <Ico color="#63cde8"><path d="M3 20c3-3 6-3 9 0s6 3 9 0 5-2 8 0" /><path d="M16 4v10M12 8l4-4 4 4" /></Ico>
    case 'oxygen': return <Ico color="#9fe0f2"><circle cx="12" cy="20" r="6" /><circle cx="22" cy="11" r="4" /><circle cx="14" cy="8" r="2" /></Ico>
    case 'seaice': return <Ico color="#eaf3f5"><path d="M4 24 12 8l5 9 3-5 8 12Z" /><path d="M3 27h26" /></Ico>
  }
}

const ETAPAS = [
  { titulo: 'Satellites and models', texto: 'Open records of the sea: temperature, plankton, sea level, oxygen and ice.', icono: <Ico color={CIAN}><rect x="12" y="12" width="8" height="8" rx="1" /><path d="M4 14h6M22 14h6M4 18h6M22 18h6M16 4v6M16 22v6" /></Ico> },
  { titulo: 'Yearly averages', texto: 'Monthly maps become one number per year for each place.', icono: <Ico color={CIAN}><path d="M4 26V6M4 26h24" /><path d="M9 20l5-6 5 4 7-10" /></Ico> },
  { titulo: 'Tests', texto: 'We test whether the series rises or falls, and repeat the test in other ways.', icono: <Ico color={CIAN}><path d="M12 4h8M14 4v8l-7 13a2 2 0 0 0 2 3h14a2 2 0 0 0 2-3l-7-13V4" /></Ico> },
  { titulo: 'El Niño check', texto: 'We remove the strong El Niño years to see if the result still holds.', icono: <Ico color={CIAN}><circle cx="16" cy="16" r="6" /><path d="M16 3v4M16 25v4M3 16h4M25 16h4" /></Ico> },
  { titulo: 'A result you can read', texto: 'Rate of change, a range of doubt, and a clear “holds up” or “does not”.', icono: <Ico color={CIAN}><circle cx="16" cy="16" r="12" /><path d="M10 16.5l4 4 8-9" /></Ico> },
]

/** De los datos al resultado, en cinco pasos. */
export function PipelineDiagrama() {
  return (
    <ol className="guia-pipeline" aria-label="From satellite data to a result you can read, in five steps">
      {ETAPAS.map((e, i) => (
        <li key={e.titulo}>
          <span className="guia-pipeline-ico">{e.icono}</span>
          <strong>{i + 1}. {e.titulo}</strong>
          <span>{e.texto}</span>
        </li>
      ))}
    </ol>
  )
}

/** Cómo leer un gráfico de tendencia, con una serie inventada para ilustrar. */
export function LecturaTendencia() {
  const ys = [6.2, 6.6, 6.1, 6.9, 7.0, 6.7, 7.4, 7.1, 7.9, 7.6, 8.2, 7.9, 8.6, 8.3]
  const x = (i: number) => 50 + i * 24, y = (v: number) => 190 - (v - 5.5) * 38
  const linea = ys.map((v, i) => `${x(i)},${y(v)}`).join(' ')
  const a = 6.35, b = 0.17 // recta ilustrativa
  const banda = `${x(0)},${y(a - 0.5)} ${x(13)},${y(a + b * 13 - 0.5 + 0.2)} ${x(13)},${y(a + b * 13 + 0.9)} ${x(0)},${y(a + 0.4)}`
  return (
    <figure className="guia-figura">
      <svg viewBox="0 0 420 240" width="100%" role="img" aria-label="Illustrative trend chart with made-up numbers. Yearly values rise over time. A dashed line shows the typical rate of change, a shaded band shows the range of plausible rates, and a marker shows that the start year can change the result.">
        <rect width="420" height="240" rx="8" fill="#0c2c4a" />
        <path d="M44 20V196H404" stroke={SUAVE} strokeOpacity=".6" fill="none" />
        <polygon points={banda} fill={CIAN} fillOpacity=".16" />
        <line x1={x(0)} y1={y(a)} x2={x(13)} y2={y(a + b * 13)} stroke={CIAN} strokeWidth="2" strokeDasharray="6 4" />
        <polyline points={linea} fill="none" stroke="#63cde8" strokeWidth="1.6" />
        {ys.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3.2" fill="#63cde8" />)}
        <line x1={x(5)} y1="26" x2={x(5)} y2="196" stroke="#f08a4b" strokeDasharray="3 3" />
        <text x="14" y="16" fill={SUAVE} fontSize="10.5">Example only: made-up numbers</text>
        <text x={x(5) + 6} y="40" fill="#f08a4b" fontSize="11">If you start here, the trend can change</text>
        <text x="52" y="214" fill={SUAVE} fontSize="10.5">Years →</text>
        <text x="56" y="232" fill={SUAVE} fontSize="10.5">Dots: yearly averages</text>
        <text x="190" y="232" fill={CIAN} fontSize="10.5">Dashed line: typical rate of change</text>
        <text x="292" y="214" fill={CIAN} fillOpacity=".8" fontSize="10.5" textAnchor="start">Band: range of doubt</text>
      </svg>
      <figcaption>How to read a trend chart. The dashed line is the typical rate of change. The shaded band is the range of rates that fit the data (a 95% interval). If the band crosses zero, the trend is not clear. The orange marker reminds you that the start year can change the answer.</figcaption>
    </figure>
  )
}

/** Sección completa para la página de investigación. */
export default function GuiasInvestigacion() {
  return (
    <section className="seccion guias" id="how-to-read" aria-labelledby="t-guia-lectura">
      <p className="puente-kicker">Start here</p>
      <h2 id="t-guia-lectura">How to read this page</h2>
      <h3>From data to a result</h3>
      <PipelineDiagrama />
      <h3>Reading a trend chart</h3>
      <LecturaTendencia />
    </section>
  )
}
