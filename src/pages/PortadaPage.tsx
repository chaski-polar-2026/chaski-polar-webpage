import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExplorerStore } from '../features/explorer/store'
import { montarPortada } from '../features/portada/montar'
import DesafioPortada from '../features/portada/DesafioPortada'
import { DESAFIO, NAVEGACION_PORTADA, SECCIONES } from '../features/portada/contenido'
import '../features/portada/portada.css'
import '../features/portada/desafio.css'

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
    if (location.hash !== '#challenge') return
    let activo = true
    const alinear = () => { if (activo && location.hash === '#challenge') document.getElementById('challenge')?.scrollIntoView({ block: 'start', behavior: 'instant' }) }
    const frame = requestAnimationFrame(alinear)
    void document.fonts.ready.then(alinear)
    const cancelar = () => { activo = false; cancelAnimationFrame(frame) }
    const eventos = ['wheel', 'pointerdown', 'touchstart', 'keydown'] as const
    eventos.forEach((evento) => addEventListener(evento, cancelar, { passive: true, once: true }))
    return () => { cancelar(); eventos.forEach((evento) => removeEventListener(evento, cancelar)) }
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
          <div id="secciones">{sinEscena && <section className="portada-seccion activa">
            <h1 aria-label={NAVEGACION_PORTADA.proyecto}><span className="t-contorno">{NAVEGACION_PORTADA.proyecto.split(' ')[0]}</span><span className="t-relleno">{NAVEGACION_PORTADA.proyecto.split(' ').slice(1).join(' ')}</span></h1>
            <p>{SECCIONES[0]!.texto}</p><a className="portada-boton" href={DESAFIO.enlace}>{DESAFIO.boton}</a>
          </section>}</div>
          <div className="portada-pista" id="pista">{NAVEGACION_PORTADA.desplazamiento}</div>
        </div>
      </div>
      <DesafioPortada />
    </main>
    <footer className="portada-cierre"><span>{NAVEGACION_PORTADA.proyecto}</span><a href="#portada-recorrido">{NAVEGACION_PORTADA.volver}</a></footer>
    <div className="portada-velo" id="velo" />
  </div>
}
