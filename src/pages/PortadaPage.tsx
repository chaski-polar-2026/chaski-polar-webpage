import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExplorerStore } from '../features/explorer/store'
import { montarPortada } from '../features/portada/montar'
import PanelesPortada from '../features/portada/PanelesPortada'
import { posicionScroll } from '../features/portada/scroll'
import { NAVEGACION_PORTADA, SECCIONES } from '../features/portada/contenido'
import '../features/portada/portada.css'
import '../features/portada/desafio.css'
import '../features/portada/intro.css'

/** Portada: descenso con scroll desde la órbita hasta el fondo del mar peruano */
export default function PortadaPage() {
  const navigate = useNavigate()
  const [sinEscena, setSinEscena] = useState(false)

  useEffect(() => {
    const previous = document.documentElement.lang
    document.documentElement.lang = 'en'
    return () => { document.documentElement.lang = previous }
  }, [])

  useEffect(() => {
    document.title = 'Chaski Polar'
    // la pantalla sigue en negro mientras carga el explorador; el globo la aclara cuando está listo
    // el explorador abre en la vista Satelital: la misma foto de la Tierra que se ve en la portada
    try {
      return montarPortada(() => {
        document.documentElement.classList.add('entrando')
        useExplorerStore.getState().setView('satellite')
        navigate('/explorer')
      })
    } catch (error) {
      console.warn('3D view unavailable; the page remains readable.', error)
      setSinEscena(true)
    }
  }, [navigate])

  useEffect(() => {
    const alinear = () => {
      if (location.hash !== '#challenge') return
      const panel = document.getElementById('challenge')
      if (sinEscena) panel?.scrollIntoView({ block: 'start', behavior: 'instant' })
      else { const r = SECCIONES.find(s => s.variante === 'reto')!; scrollTo({ top: posicionScroll(r.de + (r.a - r.de) * 0.3), behavior: 'instant' }) } // un poco dentro del tramo, cuando el panel ya terminó de aparecer
      requestAnimationFrame(() => { if (panel) { panel.inert = false; panel.setAttribute('aria-hidden', 'false'); panel.focus({ preventScroll: true }) } })
    }
    const frame = requestAnimationFrame(alinear)
    const enlaces = [...document.querySelectorAll<HTMLAnchorElement>('.portada a[href="#challenge"]')]
    const navegar = (e: Event) => { e.preventDefault(); if (location.hash !== '#challenge') history.pushState(null, '', '#challenge'); alinear() }
    enlaces.forEach(a => a.addEventListener('click', navegar))
    addEventListener('hashchange', alinear)
    return () => { cancelAnimationFrame(frame); removeEventListener('hashchange', alinear); enlaces.forEach(a => a.removeEventListener('click', navegar)) }
  }, [sinEscena])

  return <div className={`portada${sinEscena ? ' portada-sin-escena' : ''}`}>
    <a className="portada-saltar" href="#challenge">{NAVEGACION_PORTADA.saltar}</a>
    <main id="contenido">
      <div id="portada-recorrido" className="portada-recorrido">
        <div className="portada-ventana">
          <canvas id="escena" aria-label={NAVEGACION_PORTADA.lienzo} />
          <nav className="portada-navegacion" aria-label={NAVEGACION_PORTADA.etiqueta}><a href="#challenge">{NAVEGACION_PORTADA.desafio}</a></nav>
          <div className="medidor" aria-hidden="true"><div className="riel"><div className="marca" id="marca" /></div></div>
          <div className="portada-hud" aria-hidden="true">
            <span className="hud-region">{NAVEGACION_PORTADA.region}</span>
            <span className="hud-fila"><i id="mEtiqueta">ORBIT</i><b id="mValor">700 km</b></span>
            <span className="hud-fila"><i>{NAVEGACION_PORTADA.capa}</i><b id="mCapa">Space</b></span>
          </div>
          <div id="secciones"><PanelesPortada sinEscena={sinEscena} /></div>
          <div className="portada-pista" id="pista">{NAVEGACION_PORTADA.desplazamiento}</div>
        </div>
      </div>
    </main>
    <footer className="portada-cierre"><span>{NAVEGACION_PORTADA.proyecto}</span><a href="#portada-recorrido">{NAVEGACION_PORTADA.volver}</a></footer>
    <div className="portada-velo" id="velo" />
  </div>
}
