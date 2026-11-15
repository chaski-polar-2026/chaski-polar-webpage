import { lazy, Suspense, useEffect, useState } from 'react'
import AppShell from '../layouts/AppShell'
import MapaCosta, { ZONAS } from '../features/pescadores/MapaCosta'
import Outlook from '../features/pescadores/Outlook'
import { CargarAlVer } from '../components/ui/CargarAlVer'
import InfoTip from '../components/ui/InfoTip'
import '../App.css'
import '../estilos.css'
import '../features/pescadores/fishers-v2.css'
const Species = lazy(() => import('../features/pescadores/SpeciesV2'))
const Sea = lazy(() => import('../features/pescadores/GuiasPescadores'))
export default function FishersPage() {
 const [zone,setZone]=useState('paita'),[sea,setSea]=useState(false)
 useEffect(()=>{document.title='Chaski Polar · For artisanal fishers';document.documentElement.lang='en'},[])
 return <AppShell><main id="contenido" className="fishers-v2"><header><p>For artisanal fishers and their families</p><h1>Get to know your sea.</h1><p>Sea temperature tests and records of marine life off Peru.</p><p>This page does not predict catches or fish locations. It does not give sea safety advice or tell you whether to go fishing.</p><h2>In one minute</h2><ol className="fishers-steps"><li><a href="#coast">Pick your coast</a><p>Find your zone on the map.</p></li><li><a href="#outlook">Read the temperature test</a><p>See how it worked in past months.</p></li><li><a href="#species">Look up a species</a><p>Read what sources recorded.</p></li></ol></header><nav className="fishers-jump" aria-label="Jump to">{['coast','outlook','species','sea','help'].map(s=><a href={'#'+s} key={s}>{s==='outlook'?'Temperature':s[0]!.toUpperCase()+s.slice(1)}</a>)}</nav>
 <section id="coast"><h2>Pick your coast</h2><div className="coast-layout"><div><label htmlFor="coast-select">Coastal zone</label><select id="coast-select" value={zone} onChange={e=>setZone(e.target.value)}>{ZONAS.map(z=><option key={z.id} value={z.id}>{z.nombre}</option>)}</select><p>The temperature results below follow this choice.</p><p>Species records cover different places and years. They are not a list of fish near this port today.</p><p><strong>What this means for you:</strong> the map locates the areas used in the temperature tests.</p></div><MapaCosta resaltar={zone}/></div></section><Outlook zone={zone}/>
 <section id="species"><h2>What has been documented for each species</h2><p>Records describe a place and time. They are not species limits or a picture of where fish are today.</p><CargarAlVer id="species-records" alto={600}><Species/></CargarAlVer></section>
 <section id="sea"><h2>How the sea works</h2><p>These simple drawings are waiting for review by an ocean specialist.</p><details onToggle={e=>{if(e.currentTarget.open)setSea(true)}}><summary>Show the sea diagrams</summary>{sea&&<Suspense fallback={<p>Loading drawings…</p>}><Sea diagramsOnly/></Suspense>}</details></section>
 <section id="help"><h2>How to read this page</h2><ol><li>Choose a coast. Read the result for each number of months ahead.</li><li>Read species records with their sources.</li><li>Open Details to see methods and limits.</li></ol><h3>Words used here</h3><p>Outlook<InfoTip term="Outlook">An estimate of sea temperature in a later month.</InfoTip> · Anomaly<InfoTip term="Anomaly">The difference from the usual temperature for that month.</InfoTip> · Hindcast<InfoTip term="Hindcast">A test on past months, using only earlier information.</InfoTip></p><details><summary>Details and limits</summary><p>The tests cover monthly sea surface temperature in 2010–2025. They do not guarantee future accuracy. No current forecast is shown here.</p><p>Species sources are mostly IMARPE. An association means two things were observed together. It does not prove one caused the other.</p></details></section></main></AppShell>
}

