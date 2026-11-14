import { useEffect, useState } from 'react'
import { useExplorerStore } from '../../store'
import Base from './Base'
import Comparar from './Comparar'
import Corriente from './Corriente'
import General from './General'
import Punto from './Punto'
import Nino2026 from './Nino2026'
import Recorrido from './Recorrido'
import Zona from './Zona'
import Biologia from './Biologia'
import ComparacionPesca from './ComparacionPesca'

/** Panel lateral: muestra una vista según lo que se tocó en el globo */
export default function Relato() {
  const panel = useExplorerStore((s) => s.panel)
  const section = useExplorerStore((s) => s.section)
  const setPanel = useExplorerStore((s) => s.setPanel)
  const [tab, setTab] = useState<'datos' | 'comparar'>(panel.tipo === 'comparar' ? 'comparar' : 'datos')
  useEffect(() => { setTab(panel.tipo === 'comparar' ? 'comparar' : 'datos') }, [panel])
  const clave = JSON.stringify(panel)

  let vista
  switch (panel.tipo) {
    case 'zona': vista = <Zona z={panel.z} nota={panel.nota} />; break
    case 'base': vista = <Base />; break
    case 'corriente': vista = <Corriente id={panel.id} />; break
    case 'punto': vista = <Punto lat={panel.lat} lng={panel.lng} />; break
    case 'comparar': vista = <Comparar />; break
    case 'recorrido': vista = <Recorrido paso={panel.paso} />; break
    case 'nino2026': vista = <Nino2026 />; break
    default: vista = <General />
  }
  const zona = panel.tipo === 'zona' ? panel.z : undefined
  return <>
    <div className="relato-tabs" role="tablist" aria-label="Panel options">
      <button type="button" role="tab" id="tab-datos" aria-selected={tab === 'datos'} aria-controls="panel-datos" tabIndex={tab === 'datos' ? 0 : -1} onClick={() => { if (panel.tipo === 'comparar') setPanel({ tipo: 'general' }); setTab('datos') }} onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); setTab('comparar'); document.getElementById('tab-comparar')?.focus() } }}>Data</button>
      <button type="button" role="tab" id="tab-comparar" aria-selected={tab === 'comparar'} aria-controls="panel-comparar" tabIndex={tab === 'comparar' ? 0 : -1} onClick={() => setTab('comparar')} onKeyDown={(e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); if (panel.tipo === 'comparar') setPanel({ tipo: 'general' }); setTab('datos'); document.getElementById('tab-datos')?.focus() } }}>Compare</button>
    </div>
    <div id="panel-datos" role="tabpanel" aria-labelledby="tab-datos" hidden={tab !== 'datos'}>{tab === 'datos' && (section === 'anchoveta' ? <div className="relato-contenido" key={`biologia-${clave}`}><Biologia zona={zona} /></div> : <div className="relato-contenido" key={clave}>{vista}</div>)}</div>
    <div id="panel-comparar" role="tabpanel" aria-labelledby="tab-comparar" hidden={tab !== 'comparar'}><ComparacionPesca /></div>
  </>
}
