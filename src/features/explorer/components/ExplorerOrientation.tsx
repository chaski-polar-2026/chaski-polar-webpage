import { useEffect, useRef, useState } from 'react'
import { create } from 'zustand'
import { claveMes } from '../../../lib/formato'
import { useExplorer } from '../ExplorerContext'
import { useAcciones } from '../hooks/useAcciones'
import { APARTADOS } from '../lib/regiones'
import { variablePorId } from '../lib/variables'
import { useExplorerStore } from '../store'
import './orientation.css'

const STEP_KEY = 'chaski-explorer-step-numbers'
const readSteps = () => { try { return localStorage.getItem(STEP_KEY) !== 'hidden' } catch { return true } }
const useSteps = create<{ visible: boolean; toggle: () => void }>((set) => ({
  visible: readSteps(),
  toggle: () => set(s => {
    try { localStorage.setItem(STEP_KEY, s.visible ? 'hidden' : 'visible') } catch { /* Still works in this session. */ }
    return { visible: !s.visible }
  }),
}))

const STEP_TEXT = ['Choose a study area', 'Choose what to measure', 'Choose a month', 'Click a place name to open its map']
export function StepNumber({ step }: { step: 1 | 2 | 3 | 4 }) {
  const visible = useSteps(s => s.visible)
  return visible ? <span className="explorer-step" title={`${step} · ${STEP_TEXT[step - 1]}`} aria-label={`Step ${step}: ${STEP_TEXT[step - 1]}`} tabIndex={0}>{step}<span className="step-tooltip" role="tooltip">{step} · {STEP_TEXT[step - 1]}</span></span> : null
}

export function ExplorerBreadcrumb() {
  const { modelo } = useExplorer()
  const acciones = useAcciones()
  const s = useExplorerStore()
  const area = APARTADOS.find(a => a.id === s.section)
  const zone = s.panel.tipo === 'zona' ? s.panel.z : null
  const params = new URLSearchParams({ mes: claveMes(modelo.mes(s.month)), dato: variablePorId(s.variable).clave, area: s.section, vista: s.view, estilo: s.mapStyle })
  const areaHref = `#${params}`
  if (zone) params.set('zona', zone)
  const detail = zone ? modelo.zona(zone).nombre : s.panel.tipo === 'general' ? null : {
    zona: 'Place', base: 'Machu Picchu Base', corriente: 'Ocean current', punto: 'Selected ocean point', comparar: 'Compare years', recorrido: 'Guided story', nino2026: 'El Niño 2026',
  }[s.panel.tipo]
  return <nav className="explorer-breadcrumb" aria-label="You are here" aria-live="polite">
    <a href={areaHref} onClick={e => { e.preventDefault(); acciones.general(false); s.flyTo({ lat: -34, lng: -90, altitude: 2.4 }, 1200) }}>Globe</a>
    <span aria-hidden="true">›</span>
    <a href={areaHref} aria-current={!detail ? 'location' : undefined} onClick={e => { e.preventDefault(); acciones.general(false); if (area) s.flyTo(area.pov, 1200) }}>{area?.nombre ?? 'South Pacific'}</a>
    {detail && <><span aria-hidden="true">›</span>{zone ? <a href={`#${params}`} aria-current="location" onClick={e => { e.preventDefault(); acciones.irAZona(zone) }}>{detail}</a> : <span aria-current="location">{detail}</span>}</>}
    {zone && s.zonePhase !== 'globe' && <span className="breadcrumb-map">Place map</span>}
  </nav>
}

export function ExplorerHint() {
  const panel = useExplorerStore(s => s.panel)
  const phase = useExplorerStore(s => s.zonePhase)
  const [visible, setVisible] = useState(true)
  const [newHere] = useState(() => { try { return !localStorage.getItem('chaski-polar-guide-v1') } catch { return true } })
  useEffect(() => {
    const hide = () => setVisible(false)
    const timer = window.setTimeout(hide, 12000)
    return () => clearTimeout(timer)
  }, [])
  useEffect(() => { if (panel.tipo !== 'general') setVisible(false) }, [panel.tipo])
  if (phase !== 'globe') return <p className="explorer-hint" role="status">Use ← Back to globe to return.</p>
  if (!visible) return null
  return <div className="explorer-hint" role="status"><StepNumber step={4} /><span>Click a place on the globe or choose one from the list.{newHere && <> <button type="button" onClick={() => document.getElementById('explorer-guide')?.click()}>New here? Take the 1-minute tour.</button></>}</span></div>
}

export function ExplorerHelp() {
  const visible = useSteps(s => s.visible)
  const toggle = useSteps(s => s.toggle)
  const details = useRef<HTMLDetailsElement>(null)
  const summary = useRef<HTMLElement>(null)
  const launch = (id: string) => { if (details.current) details.current.open = false; document.getElementById(id)?.click() }
  return <details className="explorer-help" ref={details} onKeyDown={e => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (details.current) details.current.open = false; summary.current?.focus() }
  }}>
    <summary ref={summary} aria-label="Where am I? / Help" title="Where am I? / Help">?</summary>
    <div className="explorer-help-sheet">
      <h2>Where am I?</h2>
      <p>Start with a study area, then a variable and month. Open a place to see its map.</p>
      <ol className="screen-map">
        <li><b>Study areas</b> — above the globe. Choose the system to explore.</li>
        <li><b>Variable</b> — under the globe. Choose a measurement.</li>
        <li><b>Month</b> — on the timeline. Drag the slider or play all months.</li>
        <li><b>Globe and place list</b> — open a place name. Its map shows local data.</li>
      </ol>
      <p><b>Side panel:</b> Data explains your selection. Compare shows changes between months or years.</p>
      <p className="explorer-keys"><kbd>Tab</kbd> move between controls · <kbd>Enter</kbd> open a focused place · <kbd>Esc</kbd> return. Use arrow keys on the month slider and tabs; in the tour, ← / → change steps.</p>
      <div className="orientation-actions"><button type="button" onClick={toggle}>{visible ? 'Hide step numbers' : 'Show step numbers'}</button><button type="button" onClick={() => launch('explorer-guide')}>Open Guide</button><button type="button" onClick={() => launch('explorer-existing-help')}>Open Help</button></div>
      <button type="button" onClick={() => { if (details.current) details.current.open = false; summary.current?.focus() }}>Close screen map</button>
    </div>
  </details>
}

export function StepPreference() {
  const visible = useSteps(s => s.visible)
  const toggle = useSteps(s => s.toggle)
  return <button type="button" className="step-preference" onClick={toggle}>{visible ? 'Hide step numbers' : 'Show step numbers'}</button>
}
