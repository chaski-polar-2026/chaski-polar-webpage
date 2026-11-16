import type { ReactNode } from 'react'
import './pescadores.css'

/* Ilustraciones vectoriales esquemáticas, una por especie (no están a escala ni son retratos exactos).
   Se dibujan con currentColor y trazos oscuros para que combinen con la interfaz. */
const OSC = '#071e33'
const Ojo = ({ x, y, r = 2.6 }: { x: number; y: number; r?: number }) => <circle cx={x} cy={y} r={r} fill={OSC} />
const Marco = ({ children, nombre }: { children: ReactNode; nombre: string }) => (
  <svg className="pesc-ilus" viewBox="0 0 120 56" role="img" aria-label={`Illustration of ${nombre} (schematic, not to scale)`}>{children}</svg>
)
const trazo = { stroke: OSC, strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' } as const

const ILUSTRACIONES: Record<string, ReactNode> = {
  anchoveta: <Marco nombre="anchoveta"><path d="M4 28 16 19v18Z" fill="currentColor" /><path d="M14 28C30 16 80 14 112 27c0 3 0 3 0 3C80 42 30 40 14 28Z" fill="currentColor" /><path d="M58 18 66 11l6 7Z" fill="currentColor" /><path d="M24 29C50 27 80 27 106 29" {...trazo} stroke="#eaf3f5" strokeOpacity=".8" /><Ojo x={102} y={26} /></Marco>,
  pota: <Marco nombre="jumbo flying squid"><path d="M6 28 24 11l10 11C60 18 84 20 94 28c-10 8-34 10-60 6L24 45Z" fill="currentColor" /><path d="M94 28 118 17M94 28l24 4M94 29l22 10M94 27l22-5" {...trazo} stroke="currentColor" strokeWidth={3} /><Ojo x={88} y={26} r={2.8} /></Marco>,
  concha_abanico: <Marco nombre="Peruvian scallop"><path d="M60 52 22 26A42 42 0 0 1 98 26Z" fill="currentColor" /><path d="M60 52 34 14M60 52 46 8M60 52 60 6M60 52 74 8M60 52 86 14" {...trazo} /><path d="M50 52h20l-3-7H53Z" fill="currentColor" /></Marco>,
  pulpo: <Marco nombre="octopus"><path d="M38 24C38 4 82 4 82 24c0 8-6 12-22 12S38 32 38 24Z" fill="currentColor" /><path d="M42 34C32 42 26 48 14 46M50 36c-6 9-8 14-16 17M57 37c-2 8 0 13-5 17M65 37c2 8 0 13 5 17M71 36c6 9 8 14 16 17M78 34c10 8 16 14 28 12" {...trazo} stroke="currentColor" strokeWidth={4.5} /><Ojo x={51} y={23} /><Ojo x={69} y={23} /></Marco>,
  merluza: <Marco nombre="Peruvian hake"><path d="M3 28 15 21v14Z" fill="currentColor" /><path d="M13 28C30 21 80 19 115 25v6C80 37 30 35 13 28Z" fill="currentColor" /><path d="M44 22 50 14l12 7ZM66 21l8-6 16 7ZM62 34l8 6 18-5Z" fill="currentColor" /><Ojo x={105} y={26} /><path d="M24 29C60 27 90 27 112 29" {...trazo} stroke="#eaf3f5" strokeOpacity=".7" /></Marco>,
  cachema: <Marco nombre="Peruvian weakfish"><path d="M3 28 14 19v18Z" fill="currentColor" /><path d="M12 28C26 12 84 10 112 26c-2 6-28 18-88 14-8-2-11-8-12-12Z" fill="currentColor" /><path d="M40 15C52 5 72 6 86 15Z" fill="currentColor" /><path d="M20 31C50 33 84 32 106 29" {...trazo} stroke="#eaf3f5" strokeOpacity=".8" /><Ojo x={100} y={25} /></Marco>,
  jurel: <Marco nombre="Chilean jack mackerel"><path d="M18 28 3 12l6 16-6 16Z" fill="currentColor" /><path d="M16 28C34 14 80 12 113 27 80 42 34 42 16 28Z" fill="currentColor" /><path d="M54 16 62 8l20 7ZM84 38 92 43l10-7Z" fill="currentColor" /><path d="M30 28C60 26 84 26 104 28" {...trazo} strokeDasharray="2 2.4" /><Ojo x={102} y={26} /></Marco>,
  perico: <Marco nombre="mahi-mahi"><path d="M12 30 2 15l6 15-6 16Z" fill="currentColor" /><path d="M11 30C30 20 60 14 90 14c14 2 22 10 22 14-8 8-32 16-62 14C30 40 18 36 11 30Z" fill="currentColor" /><path d="M22 22C48 4 82 6 92 14Z" fill="currentColor" /><path d="M40 40l8 7 20-6Z" fill="currentColor" /><Ojo x={103} y={25} /><path d="M30 30C60 32 90 30 108 29" {...trazo} stroke="#eaf3f5" strokeOpacity=".6" /></Marco>,
  caballa: <Marco nombre="chub mackerel"><path d="M4 28 16 19v18Z" fill="currentColor" /><path d="M14 28C30 16 80 14 112 27 80 42 30 40 14 28Z" fill="currentColor" /><path d="M52 19 60 12l10 7ZM76 18l6-5 6 6Z" fill="currentColor" /><path d="M28 24q6-4 12 0t12 0 12 0 12 0 12 0" {...trazo} /><Ojo x={102} y={26} /></Marco>,
  bonito: <Marco nombre="Pacific bonito"><path d="M3 28 15 18v20Z" fill="currentColor" /><path d="M13 28C28 14 82 12 113 27 82 42 28 42 13 28Z" fill="currentColor" /><path d="M48 18 58 8l22 9Z" fill="currentColor" /><path d="M34 20 48 30M46 18 60 30M58 17 72 29M70 17 84 28" {...trazo} /><Ojo x={102} y={26} /></Marco>,
  lorna: <Marco nombre="lorna drum"><path d="M12 30 2 20v20Z" fill="currentColor" /><path d="M12 30C22 8 80 6 108 22c5 4 5 8 0 12C90 46 30 48 12 30Z" fill="currentColor" /><path d="M30 13C60 1 86 6 98 16Z" fill="currentColor" /><path d="M30 31C60 33 88 32 104 29" {...trazo} stroke="#eaf3f5" strokeOpacity=".7" /><Ojo x={98} y={25} /></Marco>,
  corvina: <Marco nombre="corvina drum"><path d="M4 28 16 20v16Z" fill="currentColor" /><path d="M14 28C30 14 84 10 114 25c0 4-2 6-6 8C84 44 30 44 14 28Z" fill="currentColor" /><path d="M36 15C52 3 76 6 90 14Z" fill="currentColor" /><path d="M26 30C56 34 88 32 108 28" {...trazo} stroke="#eaf3f5" strokeOpacity=".7" /><Ojo x={104} y={24} /></Marco>,
}

/** Silueta genérica por grupo, para especies sin ilustración propia. */
const GENERICAS: Record<string, string> = { 'pelagic fish': 'anchoveta', 'demersal fish': 'cachema', mollusc: 'concha_abanico' }

/** Ilustraciones por especie (imagen con fondo transparente). Las dimensiones evitan saltos de diseño. */
const IMAGENES: Record<string, [number, number]> = {
  anchoveta: [640, 199], pota: [640, 163], concha_abanico: [640, 527], pulpo: [640, 327], merluza: [640, 201], cachema: [640, 243],
  jurel: [640, 254], perico: [640, 272], caballa: [640, 242], bonito: [640, 248], lorna: [640, 321], corvina: [640, 225],
}

export function iconoPez(id: string, grupo: string): ReactNode {
  const t = IMAGENES[id]
  if (t) return <img className="pesc-ilus pesc-ilus-img" src={`/assets/especies/ilus-${id}.webp`} alt="" aria-hidden="true" width={t[0]} height={t[1]} loading="lazy" />
  return ILUSTRACIONES[id] ?? ILUSTRACIONES[GENERICAS[grupo] ?? 'anchoveta']
}
