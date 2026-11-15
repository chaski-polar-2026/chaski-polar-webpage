import IconoJuego from './IconoJuego'
import type { EstadoLumi } from '../escenas/lumi'
import { DIVISIONES_META } from '../escenas/lumi'
import type { EstadoNara } from '../escenas/nara'
import { META_KIRI } from '../guion'
import Medidor from './Medidor'

export function HudLumi({ e }: { e: EstadoLumi | null }) {
  if (!e) return null
  return <section className="bitacora-prologo juego-caja" aria-label="Lumi status and objective">
    <span className="bitacora-sobretitulo">01 · Life begins here</span>
    <h2>Lumi <span>{e.divisiones} / {DIVISIONES_META} divisions</span></h2>
    <p className="bitacora-objetivo">Collect nutrients and return to the light.</p>
    <div className="bitacora-recurso"><span><IconoJuego tipo="luz" />Light</span><Medidor valor={e.luz} tono="ambar" etiqueta="Available light" /></div>
    <div className="bitacora-recurso"><span><IconoJuego tipo="nutrientes" />Nutrients</span><Medidor valor={e.nutrientes} tono="hielo" etiqueta="Lumi’s nutrients" /></div>
    <div className="bitacora-recurso"><span><IconoJuego tipo="crecimiento" />Growth</span><Medidor valor={e.crecimiento} etiqueta="Lumi’s growth" /></div>
    {(e.nutrientes <= 0 || e.bajoHielo) && <p className="bitacora-alerta" role="status">{e.nutrientes <= 0 ? 'Find blue or green nutrient tokens.' : 'Find an opening: the ice blocks the light.'}</p>}
  </section>
}

export function HudKiri({ comidos }: { comidos: number }) {
  return <section className="bitacora-prologo juego-caja" aria-label="Kiri’s objective">
    <span className="bitacora-sobretitulo">02 · The chain of life</span>
    <h2>Kiri <span>{comidos} / {META_KIRI} food items</span></h2>
    <p className="bitacora-objetivo">Eat the green patches. Dodge the penguins.</p>
    <Medidor valor={comidos / META_KIRI} etiqueta="Food collected by Kiri" />
  </section>
}

const NOMBRE_CORRIENTE = { circumpolar: 'Circumpolar · eastward', humboldt: 'Humboldt · northward' } as const

export function HudNara({ e }: { e: EstadoNara | null }) {
  if (!e) return null
  const grados = (x: number, pos: string, neg: string) => `${Math.abs(x).toFixed(0)}° ${x >= 0 ? pos : neg}`
  return <section className="bitacora-prologo juego-caja" aria-label="Nara status and objective">
    <span className="bitacora-sobretitulo">03 · A journey north</span>
    <h2>Nara <span>{Math.round(e.avance * 100)}% of the journey</span></h2>
    <p className="bitacora-objetivo">Reach the ring off Piura. Use the currents.</p>
    <div className="bitacora-recurso"><span><IconoJuego tipo="energia" />Fat reserves</span><Medidor valor={e.grasa} tono={e.grasa < 0.25 ? 'alerta' : 'ambar'} etiqueta="Nara’s fat reserves" /></div>
    <div className="bitacora-recurso"><span><IconoJuego tipo="crecimiento" />Journey</span><Medidor valor={e.avance} tono="hielo" etiqueta="Journey progress" /></div>
    <p className="bitacora-coordenadas">{grados(e.lat, 'N', 'S')} · {grados(e.lon, 'E', 'W')}{e.corriente && <span>{NOMBRE_CORRIENTE[e.corriente]}</span>}</p>
  </section>
}
