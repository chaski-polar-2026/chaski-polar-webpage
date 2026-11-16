import { useEffect, useRef, useState } from 'react'
import { nombreDe, retratoDe } from '../personajes/guias'
import { useDialogo } from './estado'
import { sonar, hablar } from '../motor/sonido'

const LETRAS_POR_SEGUNDO = 45
const sinMovimiento = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/** Caja de diálogo con retrato. El texto aparece letra a letra; Espacio, Enter o un toque lo completan y avanzan */
export default function Dialogo() {
  const { linea, avanzar } = useDialogo()
  const [letras, setLetras] = useState(0)
  const largo = linea?.texto.length ?? 0
  const completo = letras >= largo

  useEffect(() => {
    if (!linea) return
    sonar('dialogo')
    if (sinMovimiento()) { setLetras(linea.texto.length); return }
    setLetras(0)
    const inicio = performance.now()
    let id = 0
    const paso = (ahora: number) => {
      const n = Math.min(linea.texto.length, Math.floor(((ahora - inicio) / 1000) * LETRAS_POR_SEGUNDO))
      // si el jugador ya completó el texto, no se vuelve atrás
      setLetras((antes) => Math.max(antes, n))
      if (n < linea.texto.length) id = requestAnimationFrame(paso)
    }
    id = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(id)
  }, [linea])

  // Un sonidito por cada dos letras que aparecen (no suena si se completa el texto de golpe)
  const sonadas = useRef(0)
  useEffect(() => {
    if (!linea) return
    const antes = sonadas.current
    sonadas.current = letras
    if (letras - antes !== 1 && letras - antes !== 2) return
    if (letras % 2 === 0) hablar(linea.quien, linea.texto[letras - 1] ?? '')
  }, [letras, linea])

  useEffect(() => {
    if (!linea) return
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== ' ' && e.key !== 'Enter') return
      e.preventDefault()
      if (completo) avanzar(); else setLetras(largo)
    }
    addEventListener('keydown', tecla)
    return () => removeEventListener('keydown', tecla)
  }, [linea, completo, largo, avanzar])

  if (!linea) return null
  return <button type="button" className="juego-dialogo juego-caja" onClick={() => (completo ? avanzar() : setLetras(largo))}
    aria-label={`${nombreDe(linea.quien)}: ${linea.texto}. ${completo ? 'Press to continue' : 'Press to show the full text'}`}
    aria-keyshortcuts="Space Enter">
    <img className="juego-dialogo-retrato" src={retratoDe(linea.quien)} alt="" width={64} height={64} />
    <span className="juego-dialogo-texto">
      <span className="bitacora-dialogo-canal">Logbook · Communication</span>
      <b>{nombreDe(linea.quien)}</b>
      <span aria-hidden="true">{linea.texto.slice(0, letras)}</span>
      <span className="bitacora-dialogo-paso" aria-hidden="true">{completo ? 'Continue →' : 'Show full text'}<kbd>Space / Enter</kbd></span>
    </span>
  </button>
}
