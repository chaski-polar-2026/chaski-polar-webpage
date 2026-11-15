import { useEffect, useRef, useState } from 'react'
import { FAQ, PASOS } from './contenido'
import './recorrido.css'
const CLAVE = 'chaski-polar-guide-v1'
function objetivo(i: number) {
 const el = document.querySelector<HTMLElement>(PASOS[i]!.selector)
 return el && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' ? el : null
}
export default function RecorridoAyuda() {
 const [paso, setPaso] = useState<number | null>(null)
 const [ayuda, setAyuda] = useState(false)
 const dialogo = useRef<HTMLDialogElement>(null)
 const guia = useRef<HTMLButtonElement>(null)
 const help = useRef<HTMLButtonElement>(null)
 const tarjeta = useRef<HTMLDivElement>(null)
 const marco = useRef<HTMLDivElement>(null)
 const abrir = () => { const i = PASOS.findIndex((_, k) => objetivo(k)); if (i >= 0) setPaso(i) }
 const cerrar = () => {
  if (paso != null) { try { localStorage.setItem(CLAVE, 'seen') } catch { /* Storage can be unavailable. */ } }
  setPaso(null); setAyuda(false)
 }
 const mover = (direccion: number) => {
  if (paso == null) return
  let i = paso + direccion
  while (i >= 0 && i < PASOS.length && !objetivo(i)) i += direccion
  if (i >= PASOS.length) cerrar()
  else if (i >= 0) setPaso(i)
 }
 useEffect(() => {
  try { if (localStorage.getItem(CLAVE)) return } catch { /* Continue without persistence. */ }
  const iniciar = () => { if (objetivo(0)) { abrir(); return true } return false }
  if (iniciar()) return
  const observer = new MutationObserver(() => { if (iniciar()) observer.disconnect() })
  observer.observe(document.body, {childList:true, subtree:true})
  return () => observer.disconnect()
 }, [])
 const abierto = paso != null || ayuda
 useEffect(() => {
  if (!abierto) return
  const d = dialogo.current!, retorno = ayuda ? help.current : guia.current
  d.showModal()
  tarjeta.current?.focus()
  return () => { d.close(); retorno?.focus({preventScroll:true}) }
 }, [abierto, ayuda])
 useEffect(() => {
  if (paso == null) return
  const el = objetivo(paso)
  if (!el) { setPaso(null); return }
  el.scrollIntoView({block:'center', behavior:'instant'})
  const posicionar = () => {
   const r = el.getBoundingClientRect(), m = marco.current
   if (m) Object.assign(m.style, {left:`${Math.max(0,r.left)}px`,top:`${Math.max(0,r.top)}px`,width:`${Math.max(0,Math.min(r.right,innerWidth)-Math.max(0,r.left))}px`,height:`${Math.max(0,Math.min(r.bottom,innerHeight)-Math.max(0,r.top))}px`})
  }
  posicionar()
  const observer = new ResizeObserver(posicionar); observer.observe(el)
  addEventListener('scroll',posicionar,true); addEventListener('resize',posicionar)
  return () => { observer.disconnect(); removeEventListener('scroll',posicionar,true); removeEventListener('resize',posicionar) }
 }, [paso])
 return <>
  <nav className="recorrido-controles" aria-label="Explorer help"><button ref={guia} onClick={abrir}>Guide</button><button ref={help} onClick={() => setAyuda(true)}>Help</button></nav>
  <dialog className={`recorrido-dialogo${ayuda ? ' recorrido-dialogo-ayuda' : ''}`} ref={dialogo} aria-labelledby="recorrido-titulo" onCancel={e => {e.preventDefault();cerrar()}} onKeyDown={e => {
   if (paso != null && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {e.preventDefault();mover(e.key === 'ArrowRight' ? 1 : -1)}
   if(e.key === 'Tab') {
    const nodes = [...tarjeta.current!.querySelectorAll<HTMLElement>('button:not(:disabled),summary')]
    const primero=nodes[0],ultimo=nodes.at(-1)
    if(e.shiftKey && (document.activeElement===primero || document.activeElement===tarjeta.current)){e.preventDefault();ultimo?.focus()}
    else if(!e.shiftKey && document.activeElement===ultimo){e.preventDefault();primero?.focus()}
   }
  }}>
   {paso != null && <div className="recorrido-marco" ref={marco} aria-hidden="true" />}
   <div className="recorrido-tarjeta" ref={tarjeta} tabIndex={-1}>
    {paso != null ? <><span>Step {paso+1} of {PASOS.length}</span><h2 id="recorrido-titulo">{PASOS[paso]!.titulo}</h2><p aria-live="polite">{PASOS[paso]!.texto}</p><div className="recorrido-botones"><button disabled={paso===0} onClick={()=>mover(-1)}>Back</button><button onClick={()=>mover(1)}>Next</button><button onClick={cerrar}>Skip</button></div></> : <><h2 id="recorrido-titulo">Help</h2><button onClick={cerrar}>Close</button>{FAQ.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</>}
   </div>
  </dialog>
 </>
}
