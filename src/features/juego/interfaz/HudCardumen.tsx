import { useState, type PointerEvent } from 'react'
import type { Entrada } from '../motor/entrada'
import { NOMBRE_ZONA, type Mar } from '../motor/mar'
import { useHud } from '../escenas/cardumen'
import Medidor from './Medidor'

// Escala ilustrativa de la escena: cada unidad representa unos 10 m.
const METROS = 10, FONDO = 14
export const MESES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const n0 = new Intl.NumberFormat('en', { maximumFractionDigits: 0 })
const n1 = new Intl.NumberFormat('en', { maximumFractionDigits: 1, signDisplay: 'exceptZero' })
const TEXTO_TEMPORADA = { abierta: 'Open: purse seiners at sea', veda: 'Fishing ban: fleet in port', fuera: 'Off season' } as const
const TEXTO_ORIGEN = { observado: 'Satellite-measured chlorophyll', estimado: 'Food estimated from temperature', normal: 'No data: a normal month is assumed' } as const
const limitar = (n: number) => Math.max(0, Math.min(100, n))

type PuntoHistorico = { valor: number | null; estimado: boolean }
function Historico({ puntos, mesFin, tipo, etiqueta }: { puntos: PuntoHistorico[]; mesFin: number; tipo: 'alimento' | 'anomalia'; etiqueta: string }) {
  const base = tipo === 'alimento' ? 100 : 0
  const amplitud = Math.max(tipo === 'alimento' ? 100 : 3, ...puntos.map((p) => p.valor == null ? 0 : Math.abs(p.valor - base)))
  const ancho = 240 / mesFin
  const datos = puntos.map((p, i) => `${MESES[i]}: ${p.valor == null ? 'no data' : `${n1.format(p.valor)}${tipo === 'alimento' ? ' %' : ' °C'}${p.estimado ? ' estimated' : ''}`}`).join('; ')
  return <div className="lectura-historico">
    <svg viewBox="0 0 240 58" preserveAspectRatio="none" role="img" aria-label={`${etiqueta}, history for the current zone. ${datos}`}>
      <line x1="0" y1="29" x2="240" y2="29" className="historico-base" />
      {puntos.map((p, i) => {
        if (p.valor == null) return <line key={i} x1={i * ancho + ancho / 2} x2={i * ancho + ancho / 2} y1="25" y2="33" className="historico-ausente" />
        const diferencia = p.valor - base, alto = Math.abs(diferencia) / amplitud * 24
        return <rect key={i} x={i * ancho + 2} y={diferencia >= 0 ? 29 - alto : 29} width={Math.max(1, ancho - 4)} height={Math.max(1, alto)} className={`${tipo === 'anomalia' ? diferencia >= 0 ? 'historico-calido' : 'historico-frio' : diferencia >= 0 ? 'historico-positivo' : 'historico-negativo'}${p.estimado ? ' historico-estimado' : ''}`}><title>{MESES[i]}: {n1.format(p.valor)}{tipo === 'alimento' ? ' %' : ' °C'}{p.estimado ? ' (estimated)' : ''}</title></rect>
      })}
    </svg>
    <div className="historico-eje"><span>Jan</span><span>{tipo === 'alimento' ? '100 % normal' : '0 °C'}</span><span>{MESES[mesFin - 1]?.slice(0, 3)}</span></div>
  </div>
}

/** Lo necesario para sobrevivir permanece visible; el parte científico se consulta a voluntad. */
export default function HudCardumen({ entrada, mar, compacto, alternar }: { entrada: Entrada | null; mar: Mar | null; compacto: boolean; alternar: () => void }) {
  const hud = useHud((s) => s.hud)
  const [parteAbierto, setParteAbierto] = useState(true)
  if (!hud) return null
  const pctComida = Math.round(hud.alimento * 100)
  const supervivencia = hud.inicial > 0 ? hud.peces / hud.inicial : 0
  const profundidad = Math.max(0, Math.round(-hud.y * METROS))
  const limiteOxigeno = Math.max(0, Math.round(-hud.yOxigeno * METROS))
  const historia = Array.from({ length: hud.mes + 1 }, (_, mes) => {
    const indice = mar?.indice(hud.anio, mes + 1) ?? -1
    return indice >= 0 && mar ? mar.estado(hud.zona, indice) : null
  })
  const serie = (campo: 'alimento' | 'anomaliaTemp' | 'nino12'): PuntoHistorico[] => historia.map((estado) => ({
    valor: !estado || (campo === 'alimento' && estado.origen === 'normal') ? null : campo === 'alimento' ? estado.alimento * 100 : estado[campo],
    estimado: campo === 'alimento' && estado?.origen === 'estimado',
  }))
  const alerta = hud.bajoOxigeno ? 'Low oxygen. Rise to shallower water.'
    : hud.energia < 0.25 ? 'Low energy. Find the green food patches.' : null
  const tocar = (boton: 'subir' | 'bajar', activo: boolean) => { if (entrada) entrada.botones[boton] = activo }
  const sostener = (e: PointerEvent<HTMLButtonElement>, boton: 'subir' | 'bajar') => {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    tocar(boton, true)
  }

  return <>
    <div className="bitacora-hud">
      <section className="bitacora-fecha juego-caja" aria-label="Expedition date and zone">
        <span className="bitacora-sobretitulo">Season logbook</span>
        <div><b>{MESES[hud.mes]} {hud.anio}</b><span>{NOMBRE_ZONA[hud.zona]}</span></div>
        <Medidor valor={hud.avanceTemporada} tono="hielo" etiqueta="Season progress" />
        <div className="bitacora-temporada-extremos"><span>Jan {hud.anio}</span><span>{MESES[hud.mesFin - 1]} {hud.anio}</span></div>
      </section>

      <section className="bitacora-supervivencia juego-caja" aria-label="School status">
        <div className="bitacora-indicadores">
          <div className="bitacora-indicador">
            <span>School</span><b>{n0.format(hud.peces)} <small>fish</small></b>
            <Medidor valor={supervivencia} tono="hielo" etiqueta="School survival" />
            <small>{Math.round(supervivencia * 100)} % of the initial generation</small>
          </div>
          <div className="bitacora-indicador">
            <span>Energy</span><b>{Math.round(hud.energia * 100)} <small>%</small></b>
            <Medidor valor={hud.energia} tono={hud.energia < 0.25 ? 'alerta' : 'salvia'} etiqueta="School energy" />
            <small>{hud.energia < 0.25 ? 'You need food' : 'Find food to maintain it'}</small>
          </div>
        </div>
        <div className="bitacora-profundidad" aria-label={`Approximate depth: ${profundidad} meters; low oxygen below ${limiteOxigeno} meters`}>
          <div className="bitacora-profundidad-titulo"><span>Depth</span><b>~{profundidad} m</b></div>
          <div className="bitacora-profundidad-escala" aria-hidden="true">
            <div className="bitacora-profundidad-riel">
              <span className="bitacora-profundidad-zona" style={{ top: `${limitar(-hud.yOxigeno / FONDO * 100)}%` }} />
              <span className="bitacora-profundidad-marca" style={{ top: `${limitar(-hud.y / FONDO * 100)}%` }} />
            </div>
            <div className="bitacora-profundidad-pie"><span>Surface</span><span>Low oxygen below ~{limiteOxigeno} m</span></div>
          </div>
        </div>
        {alerta && <p className="bitacora-alerta" role="status">{alerta}</p>}
      </section>

      <section className={`bitacora-parte${parteAbierto ? ' abierto' : ''} juego-caja`} aria-label="Sea report">
        <button type="button" className="bitacora-parte-boton" aria-expanded={parteAbierto} aria-controls="bitacora-parte-contenido"
          onClick={() => setParteAbierto((a) => !a)}>
          <span><span className="bitacora-sobretitulo">ORBI · {NOMBRE_ZONA[hud.zona]}</span><b>Sea report</b></span>
          <span className="bitacora-parte-resumen">{pctComida} % <small>food</small></span>
          <span className="bitacora-parte-signo" aria-hidden="true">{parteAbierto ? '−' : '+'}</span>
        </button>
        <div id="bitacora-parte-contenido" className="bitacora-parte-contenido" hidden={!parteAbierto}>
          <p className="bitacora-origen">{TEXTO_ORIGEN[hud.origen]}. 100% represents normal for this month.</p>
          <dl className="bitacora-lecturas">
            <div><dt>Food</dt><dd className={pctComida < 60 ? 'lectura-alerta' : ''}>{pctComida} %</dd><Historico puntos={serie('alimento')} mesFin={hud.mesFin} tipo="alimento" etiqueta="Food" /></div>
            <div><dt>Temperature</dt><dd>{hud.anomaliaTemp == null ? 'No data' : `${n1.format(hud.anomaliaTemp)} °C`}</dd><Historico puntos={serie('anomaliaTemp')} mesFin={hud.mesFin} tipo="anomalia" etiqueta="Temperature" /></div>
            <div><dt>Niño 1+2</dt><dd>{hud.nino12 == null ? 'No data' : `${n1.format(hud.nino12)} °C`}</dd><Historico puntos={serie('nino12')} mesFin={hud.mesFin} tipo="anomalia" etiqueta="Niño 1+2" /></div>
          </dl>
          <p className="bitacora-temporada"><b>Fishing</b> {TEXTO_TEMPORADA[hud.temporada]}</p>
          <div className="bitacora-radar" aria-label="Food by zone this month">
            <span className="bitacora-sobretitulo">Where food is available</span>
            {hud.radar.map((r) => <div key={r.zona} className={`bitacora-radar-fila${r.zona === hud.zona ? ' aqui' : ''}`}>
              <span>{NOMBRE_ZONA[r.zona]}{r.zona === hud.zona && <small> · here</small>}</span>
              <span className="bitacora-radar-pista" aria-hidden="true"><span style={{ width: `${limitar(r.alimento * 50)}%` }} /></span>
              <b>{Math.round(r.alimento * 100)} %</b>
            </div>)}
          </div>
          <p className="bitacora-origen">History through the current month for the selected zone. Temperature and Niño 1+2: departure from normal. Faint bars: estimated food; mark: no data.</p>
        </div>
      </section>
    </div>

    <div className="bitacora-acciones" aria-label="School actions">
      <button type="button" className="juego-caja bitacora-impulso" disabled={hud.impulsoEspera > 0 || !entrada}
        onClick={() => entrada?.pedirImpulso()} style={{ ['--carga' as string]: `${limitar((1 - hud.impulsoEspera) * 100)}%` }}>
        <b>{hud.impulsoEspera > 0 ? 'Recharging' : 'Boost'}</b><kbd>Shift</kbd>
      </button>
      <button type="button" className={`juego-caja${compacto ? ' activo' : ''}`} onClick={alternar} aria-pressed={compacto}>
        <b>{compacto ? 'Grouped' : 'Spread out'}</b><kbd>F</kbd>
      </button>
      <button type="button" className="juego-caja bitacora-tactil" aria-label="Hold to rise"
        onPointerDown={(e) => sostener(e, 'subir')} onPointerUp={() => tocar('subir', false)}
        onPointerCancel={() => tocar('subir', false)} onLostPointerCapture={() => tocar('subir', false)}>↑ Rise</button>
      <button type="button" className="juego-caja bitacora-tactil" aria-label="Hold to dive"
        onPointerDown={(e) => sostener(e, 'bajar')} onPointerUp={() => tocar('bajar', false)}
        onPointerCancel={() => tocar('bajar', false)} onLostPointerCapture={() => tocar('bajar', false)}>↓ Dive</button>
    </div>
  </>
}
