import {useState} from 'react'
import species from '../explorer/data/especies.json'
import sources from '../explorer/data/fuentes-especies.json'
import {iconoPez} from './iconosPez'
const groups:Record<string,string>={'pelagic fish':'Fish in open water','demersal fish':'Fish near the bottom',mollusc:'Squid, octopus and shellfish'}
const seasons:Record<string,number[]>={anchoveta:[2,3,8,9],pota:[10,11,12,1],concha_abanico:[9,10,11,12,1,2,3,4,5],caballa:[11,12,1,2,3],bonito:[10,11,12,2,3]}
const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export default function SpeciesV2(){
 const [group,setGroup]=useState('all')
 return <><label htmlFor="group">Species group</label><select id="group" value={group} onChange={e=>setGroup(e.target.value)}><option value="all">All groups</option>{Object.entries(groups).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select><p><strong>What this means for you:</strong> these records give background about marine life. They do not show where to find it now.</p><div className="species-grid">{species.filter(e=>group==='all'||e.group===group).map(e=>{
 const ids=[...new Set(Object.values(e.sources??{}).flat().map(s=>s.source_id))]
 const depth=e.recorded_depth
 const label=depth.min==null?`Down to ${depth.max} m (lower end not recorded)`:depth.max==null?`From ${depth.min} m`:`${depth.min}–${depth.max} m`
 return <article key={e.id} className="species-card"><header>{iconoPez(e.id,e.group)}<h3>{e.common_name_en}</h3><i>{e.scientific_name_accepted}</i></header><p>{groups[e.group]}</p><h4>At what depths was it recorded?</h4><p>{label}</p>{depth.min!=null&&depth.max!=null&&<div className="depth-track" role="img" aria-label={`${label} below the surface; linear scale 0 to 1200 metres`}><span style={{left:`${depth.min/12}%`,width:`${Math.max(1,(depth.max-depth.min)/12)}%`}}/></div>}<p className="small">Surface (0 m) to 1,200 m. Records, not limits.{e.id==='pota'?' Includes a recorded dive, not a usual depth range.':''}</p><details><summary>Details: seasons and warm years</summary>{'season_note' in e&&<><h4>When was activity recorded?</h4><p>{e.season_note}</p>{seasons[e.id]&&<><div className="month-ribbon" role="img" aria-label={`Main spawning months: ${seasons[e.id]!.map(m=>months[m-1]).join(', ')}. See the text for other activity.`}>{months.map((m,i)=><span key={m} className={seasons[e.id]!.includes(i+1)?'active':''}>{m}{seasons[e.id]!.includes(i+1)?' •':''}</span>)}</div><p className="small">Filled months: main spawning period. Other activity can occur outside these months. This is not a fishing calendar.</p></>}</>}{'temperature_note' in e&&<><h4>What temperatures were recorded?</h4><p>{e.temperature_note}</p></>}{'el_nino_response_note' in e&&<><h4>What happened in warm years?</h4><p>{e.el_nino_response_note}</p></>}<h4>Sources</h4><p>{ids.map(id=><a className="source-link" key={id} href={(sources as Record<string,string>)[id]} target="_blank" rel="noreferrer">Source {id}</a>)}</p></details></article>
 })}</div></>
}
