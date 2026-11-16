import type { Expediente } from '../logica/escritorio'

/** Herramienta de sellar, no un emoji dependiente del sistema operativo. */
export function IconoSello({ pequeno = false }: { pequeno?: boolean }) {
  return <svg className={`cabina-icono-sello${pequeno ? ' pequeno' : ''}`} viewBox="0 0 32 32" width={pequeno ? 18 : 26} height={pequeno ? 18 : 26} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 5h8v5l-2 3v5h-4v-5l-2-3z" fill="currentColor" />
    <path d="M8 18h16l3 6H5zM5 24h22v4H5zM10 31h12" />
  </svg>
}

/** Sello de goma dibujado (mango de madera, cuerpo metalico, base de goma) sobre su almohadilla de tinta. */
export function SelloGrande({ color }: { color: 'verde' | 'rojo' }) {
  const tinta = color === 'verde' ? '#3fa66b' : '#c0453a', tintaOsc = color === 'verde' ? '#1f6f47' : '#8f2f29'
  return <svg className="sello-dibujo" viewBox="0 0 120 120" width={120} height={120} aria-hidden="true" focusable="false">
    <rect x="8" y="88" width="104" height="26" rx="5" fill="#16202a" stroke="#3a4a58" strokeWidth="2" />
    <rect x="14" y="92" width="92" height="14" rx="3" fill={tintaOsc} />
    <rect x="20" y="94" width="80" height="6" rx="3" fill={tinta} opacity=".8" />
    <g className="sello-cuerpo">
      <ellipse cx="60" cy="14" rx="15" ry="9" fill="#b07a44" stroke="#6b4423" strokeWidth="2" />
      <path d="M52 20h16l5 30H47z" fill="#c68b4e" stroke="#6b4423" strokeWidth="2" strokeLinejoin="round" />
      <rect x="30" y="50" width="60" height="14" rx="3" fill="#8e9ba8" stroke="#4d5a66" strokeWidth="2" />
      <rect x="34" y="53" width="52" height="3" rx="1.5" fill="#c6d0d9" />
      <rect x="32" y="64" width="56" height="12" rx="3" fill={tinta} stroke={tintaOsc} strokeWidth="2" />
      <path d="M44 70h32" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity=".55" />
    </g>
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
