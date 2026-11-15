import { useEffect, useState } from 'react'
import { useExplorer } from '../explorer/ExplorerContext'
import { describir, validar, ultimoDato, ORDEN, ENLACES, type Datos } from './relaciones'
import './nino.css'
export function useRelaciones() {
 const [datos,setDatos]=useState<Datos|null>(null),[error,setError]=useState(false),[intento,reintentar]=useState(0)
 useEffect(()=>{const c=new AbortController();setError(false);fetch('/assets/data/nino-relaciones.json',{signal:c.signal}).then(r=>{if(!r.ok)throw new Error('Data unavailable');return r.json()}).then(validar).then(setDatos).catch(e=>{if(e.name!=='AbortError')setError(true)});return()=>c.abort()},[intento])
 return {datos,error,reintentar:()=>reintentar(i=>i+1)}
}
export function EstadoNino() {
 const {modelo}=useExplorer(), ultimo=ultimoDato(modelo.nino,modelo.ultimoObservado)
 if(!ultimo)return <p>No observed Niño 1+2 data available.</p>
 const m=modelo.mes(ultimo.i),now=new Date(),fecha=`${m.anio}-${String(m.mes+1).padStart(2,'0')}`
 const atrasado=m.anio*12+m.mes<now.getUTCFullYear()*12+now.getUTCMonth()
 return <div className="nino-estado"><h3>Latest available Niño 1+2 state</h3><p><strong>{ultimo.valor>0?'+':''}{ultimo.valor} °C</strong> · {fecha}. Difference from the usual sea temperature in Niño 1+2.</p>{atrasado&&<p>The latest available observation is from {fecha}, earlier than the current month. This is not a live reading.</p>}<p>Source: the observed Niño 1+2 record used by the El Niño panel (NOAA PSL).</p></div>
}
export default function RelacionesNino({datos}:{datos:Datos}) {
 useEffect(()=>{
 const id = new URLSearchParams(location.search).get('nino')
 if(!id || !ORDEN.some(k=>k===id)) return
 const hash = `#nino-link-${id}`
 history.replaceState(history.state,'',location.pathname+location.search+hash)
 const frame=requestAnimationFrame(()=>document.getElementById(hash.slice(1))?.scrollIntoView({block:'start'}))
 return()=>cancelAnimationFrame(frame)
 },[])
 return <div className="nino-relaciones"><EstadoNino /><h3>From El Niño to the sea</h3><p>Humboldt box, CMEMS reanalysis. These regional links are not estimates for individual explorer zones or for other data products.</p><ol>{ORDEN.map(id=>{const r=datos.variables[id],d=describir(r);return <li key={id}><a href={`#nino-link-${id}`}>{r.nombre}</a>: associated with Niño 1+2, r = {d.r} in the same month. {d.retraso}</li>})}</ol><div className="nino-tarjetas">{ORDEN.map(id=>{const r=datos.variables[id],d=describir(r);return <article id={`nino-link-${id}`} key={id} tabIndex={-1}><h3>{r.nombre}</h3><h4>Link with El Niño</h4><p>{d.fuerza} link: {d.direccion}.</p><dl><dt>Same-month r</dt><dd data-field="r">{d.r}</dd><dt>Best lag (months)</dt><dd data-field="lag">{d.desfase}</dd><dt>r at best lag</dt><dd data-field="best">{d.mejor}</dd><dt>Monthly pairs (n)</dt><dd data-field="n">{d.n}</dd></dl>{d.retraso&&<p>{d.retraso}</p>}<p data-field="robustness">{d.robustez}</p>{d.debilita&&<p>The link weakens when extreme years are removed.</p>}<p>An association, not proof of cause. Monthly anomalies, 1998–2025.</p></article>})}</div><p>{datos.source}</p></div>
}
export function InsigniaNino({variable}:{variable:string}) {
 const {datos,error}=useRelaciones(),id=ENLACES[variable]
 if(!id)return null
 const d=datos?describir(datos.variables[id]):null
 return <a className="nino-insignia" href={`/research?nino=${id}#physical-chain`}>Link with El Niño · Humboldt box{d?`: ${d.fuerza.toLowerCase()}, ${d.direccion}`:error?' · View data':' · View relationship'}</a>
}
