import { useEffect, useState } from 'react'
import './proposito.css'

const CLAVE = 'chaski-proposito-visto'
const BLOQUES = [
  { titulo: 'What it is for', texto: 'To check whether ocean trends off Peru are real before anyone acts on them.' },
  { titulo: 'The problem', texto: 'Ocean trends are often reported as facts. Many change or disappear when the start year changes or El Niño is taken into account, and it is hard for non-specialists to tell.' },
  { titulo: 'Who it is for', texto: 'Universities and research centres studying how the Southern Ocean and the Peruvian sea relate; teachers and students; coastal and fishing communities, as information only.' },
  { titulo: 'What changes', texto: 'You can see the trend, how sure we are, and whether it holds up, in one place and with every test documented, including the ones that found nothing.' },
]

const leer = () => { try { return localStorage.getItem(CLAVE) === '1' } catch { return false } }
const guardar = () => { try { localStorage.setItem(CLAVE, '1') } catch { /* sin almacenamiento: se mostrará de nuevo */ } }

/** Panel translúcido con el propósito del explorador: sale la primera visita y se cierra con un clic. */
export default function Proposito() {
  const [abierto, setAbierto] = useState(() => !leer())
  const cerrar = () => { guardar(); setAbierto(false) }
  useEffect(() => {
    const abrir = () => setAbierto(true)
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') cerrar() }
    window.addEventListener('abrir-proposito', abrir)
    document.addEventListener('keydown', tecla)
    return () => { window.removeEventListener('abrir-proposito', abrir); document.removeEventListener('keydown', tecla) }
  }, [])
  if (!abierto) return null
  return (
    <div className="proposito" role="dialog" aria-modal="false" aria-labelledby="proposito-titulo" onClick={cerrar}>
      <div className="proposito-cabecera">
        <h2 id="proposito-titulo">What is this page for?</h2>
        <button type="button" className="proposito-cerrar" onClick={cerrar} aria-label="Close this panel">Got it ✕</button>
      </div>
      <dl>
        {BLOQUES.map((b) => <div key={b.titulo}><dt>{b.titulo}</dt><dd>{b.texto}</dd></div>)}
      </dl>
      <p onClick={(e) => e.stopPropagation()}><a href="/about">About and methods</a> · <a href="/fishers">For fishers</a> · <span>Click anywhere to close</span></p>
    </div>
  )
}
