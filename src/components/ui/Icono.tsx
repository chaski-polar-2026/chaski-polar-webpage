import './icono.css'

/** Iconos de trazo minimalistas (24x24) solo decorativos: nunca llevan el significado solos. */
const TRAZOS = {
  ola: 'M2 12c3-5 5 5 8 0s5 5 8 0 3-3 4-2M2 18c3-5 5 5 8 0s5 5 8 0 3-3 4-2',
  grafico: 'M4 4v16h16M8 15l4-4 3 3 5-6',
  barras: 'M5 20V11m5 9V5m5 15v-7m5 7V8',
  mapa: 'm3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2ZM9 4v14m6-12v14',
  termometro: 'M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0ZM12 9v8',
  pez: 'M3 12c4-6 10-6 14 0-4 6-10 6-14 0Zm14 0 4-4v8ZM8 11h.01',
  calendario: 'M4 6h16v14H4ZM4 10h16M8 3v4m8-4v4',
  libro: 'M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13C17 4 14 4.5 12 6ZM12 6v13',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 11v5m0-8h.01',
  aviso: 'm12 3 10 18H2ZM12 10v5m0 3h.01',
  enlace: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L12 6.3M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  flecha: 'M5 12h14m-6-6 6 6-6 6',
  salir: 'M14 4h6v6m0-6L10 14M18 14v5H5V6h5',
  descarga: 'M12 4v11m-5-5 5 5 5-5M5 20h14',
  lupa: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM21 21l-5-5',
  reloj: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM12 7v5l3 2',
  satelite: 'M9 9l6 6M4 8l4-4 4 4-4 4Zm8 8 4-4 4 4-4 4ZM4 20c4 0 8-4 8-8',
  pin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11ZM12 7.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z',
  bote: 'M3 14h18l-3 5H6ZM12 3v11M12 4l6 8h-6M5 21c2 0 2-1 4-1',
  brujula: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM15.5 8.5l-2 5-5 2 2-5Z',
  base: 'M4 6c0 3 16 3 16 0S4 3 4 6Zm0 0v12c0 3 16 3 16 0V6M4 12c0 3 16 3 16 0',
  gota: 'M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z',
  burbujas: 'M8 16a4 4 0 1 0 0 .01ZM17 9a3 3 0 1 0 0 .01ZM15 19a1.5 1.5 0 1 0 0 .01Z',
  chispa: 'M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2Z',
  check: 'M5 12.5l4.5 4.5L19 7',
  capas: 'm12 3 9 5-9 5-9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
  tendencia: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  tabla: 'M4 5h16v14H4ZM4 10h16M4 15h16M10 5v14',
  escudo: 'M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6Z',
  ojo: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  hoja: 'M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19l8-8',
  onda: 'M3 12h3l2-6 4 12 3-9 2 3h4',
} as const

export type NombreIcono = keyof typeof TRAZOS

export function Icono({ nombre, className = '' }: { nombre: NombreIcono; className?: string }) {
  return <svg className={`icono ${className}`.trim()} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={TRAZOS[nombre]} /></svg>
}

export default Icono

/** Linea decorativa con un icono al centro, para separar bloques grandes. */
export function Divisor({ nombre = 'ola' }: { nombre?: NombreIcono }) {
  return <div className="deco-divisor" aria-hidden="true"><Icono nombre={nombre} /></div>
}
