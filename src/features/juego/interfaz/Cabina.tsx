import type { Expediente } from '../logica/escritorio'

/** Herramienta de sellar, no un emoji dependiente del sistema operativo. */
export function IconoSello({ pequeno = false }: { pequeno?: boolean }) {
  return <svg className={`cabina-icono-sello${pequeno ? ' pequeno' : ''}`} viewBox="0 0 32 32" width={pequeno ? 18 : 26} height={pequeno ? 18 : 26} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 5h8v5l-2 3v5h-4v-5l-2-3z" fill="currentColor" />
    <path d="M8 18h16l3 6H5zM5 24h22v4H5zM10 31h12" />
  </svg>
}

/** Sello de goma en pixel art (mango de madera, banda metalica, goma de color) sobre su almohadilla de tinta.
    La rejilla es de 32 x 32 celdas; el contorno oscuro se calcula solo, como en los demas personajes pixelados. */
const N = 32
type Rejilla = string[][]
const vacia = (): Rejilla => Array.from({ length: N }, () => Array<string>(N).fill('.'))
const caja = (g: Rejilla, x0: number, y0: number, x1: number, y1: number, ch: string) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y]![x] = ch }
const elipse = (g: Rejilla, cx: number, cy: number, rx: number, ry: number, ch: string) => { for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) g[y]![x] = ch }
const cuerpoSello = (): Rejilla => {
  const g = vacia()
  elipse(g, 16, 4, 6.5, 3.5, 'W'); caja(g, 12, 2, 15, 3, 'h'); caja(g, 20, 5, 22, 6, 'w') // perilla
  caja(g, 13, 8, 18, 14, 'W'); caja(g, 13, 8, 14, 14, 'h'); caja(g, 18, 8, 18, 14, 'w') // mango
  caja(g, 11, 15, 20, 16, 'W'); caja(g, 20, 15, 20, 16, 'w') // base del mango
  caja(g, 7, 17, 24, 20, 'M'); caja(g, 7, 17, 24, 17, 's'); caja(g, 7, 20, 24, 20, 'm') // banda metalica
  caja(g, 5, 21, 26, 27, 'C'); caja(g, 6, 22, 10, 22, 'i'); caja(g, 5, 26, 26, 27, 'c'); caja(g, 25, 21, 26, 25, 'c') // goma
  return g
}
const almohadilla = (): Rejilla => {
  const g = vacia()
  caja(g, 2, 28, 29, 31, 'p'); caja(g, 4, 29, 27, 30, 'I'); caja(g, 6, 29, 14, 29, 'j')
  return g
}
export function SelloGrande({ color }: { color: 'verde' | 'rojo' }) {
  const v = color === 'verde'
  const paleta: Record<string, string> = {
    k: '#0b1620', W: '#c68b4e', h: '#e3b27a', w: '#8a5a2e', M: '#aab6c2', s: '#dfe7ee', m: '#6f7d8a',
    C: v ? '#3fa66b' : '#c0453a', i: v ? '#7be0a6' : '#ff9c8f', c: v ? '#1f6f47' : '#8f2f29',
    p: '#3a4a58', I: v ? '#1f6f47' : '#8f2f29', j: v ? '#3fa66b' : '#c0453a',
  }
  const celdas = (g: Rejilla) => g.flatMap((fila, y) => fila.map((ch, x) => paleta[ch] ? <rect key={`${y}-${x}`} x={x * 4} y={y * 4} width={4} height={4} fill={paleta[ch]} /> : null))
  return <svg className="sello-dibujo" viewBox="0 0 128 128" width={128} height={128} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
    <g>{celdas(almohadilla())}</g>
    <g className="sello-cuerpo">{celdas(cuerpoSello())}</g>
  </svg>
}

function Representante({ tipo }: { tipo: Expediente['tipo'] | undefined }) {
  const chaqueta = tipo === 'solicitud' ? '#697d70' : tipo === 'prensa' ? '#49647d' : '#3e7780'
  return <svg viewBox="0 0 248 122" width={248} height={122} className="cabina-personaje" role="img" aria-label="Port representative waiting at the counter">
    <g shapeRendering="crispEdges">
      <path fill="#153647" d="M0 0h248v122H0z" />
      <path fill="#315b66" d="M0 61h248v34H0z" />
      <path fill="#678e92" d="M0 68h38v2H0zm52 9h32v2H52zm120-5h46v2h-46zm29 13h47v2h-47z" />
      <path fill="#283e48" d="M18 41h7v30h-7zm-6 27h30v5H12zm194-33h7v37h-7zm-13 33h36v5h-36z" />
      <path fill="#122936" d="M32 53h28l-8 8H39zM182 56h31l-7 8h-18z" />
      <path fill="#14242e" d="M96 99V65h8V45h8V33h25v8h8v18h8v40z" />
      <path fill="#ae795a" d="M109 45h30v27h-7v6h-18v-6h-5z" />
      <path fill="#cc9a75" d="M109 45h23v25h-18v-5h-5z" />
      <path fill="#2a3841" d="M106 36h31v7h12v5h-47v-5h4z" />
      <path fill="#6d8990" d="M109 36h25v3h-25z" />
      <path fill="#172b37" d="M114 54h3v3h-3zm15 0h3v3h-3z" />
      <path fill="#855b49" d="M120 63h7v2h-7z" />
      <path fill={chaqueta} d="M103 75h13l7 7 8-7h13l11 15v25H92V90z" />
      <path fill="#bdcbbd" d="M116 75h15l-8 10z" />
      <path fill="#293f49" d="M120 86h4v27h-4zm-17 7h11v9h-11zm30 0h11v9h-11z" />
      <path fill="#c6a36d" d="M145 89h18v23h-18z" />
      <path fill="#eadfc6" d="M149 88h18v23h-18z" />
      <path fill="#687a75" d="M152 94h12v2h-12zm0 5h10v2h-10z" />
      <path fill="#b88765" d="M139 106h16v7h-16z" />
      <path fill="#55717b" d="M0 109h248v4H0z" />
      <path fill="#0a202e" d="M0 113h248v9H0z" />
      <path fill="#42616a" d="M0 0h7v113H0zm241 0h7v113h-7zM7 0h234v6H7z" />
    </g>
  </svg>
}

/** La visita espera sin temporizador. Sus documentos siguen siendo los mismos expedientes del juego. */
export default function Cabina({ expediente, revisados, total, entregado = false }: {
  expediente?: Expediente; revisados: number; total: number; entregado?: boolean
}) {
  const rol = expediente?.tipo === 'solicitud' ? 'Fleet representative'
    : expediente?.tipo === 'prensa' ? 'Press messenger' : 'Technical representative'
  return <section className="cabina-ventanilla" aria-label="Port office counter">
    <div className="cabina-vista"><span className="cabina-placa">Port office</span><Representante tipo={expediente?.tipo} /></div>
    <div className="cabina-visita">
      <p className="cabina-rotulo">{entregado ? 'Review complete' : 'At the counter'}</p>
      <h3>{entregado ? 'Documents returned' : rol}</h3>
      <p>{entregado ? 'The shift is over. You can review your decisions.'
        : expediente ? `${expediente.remitente} is waiting for “${expediente.titulo}” to be reviewed.` : 'All files are stamped. Finish the shift.'}</p>
      <p className="cabina-estado" role="status">{revisados} of {total} files stamped{!entregado && ' · No time limit'}</p>
    </div>
  </section>
}
