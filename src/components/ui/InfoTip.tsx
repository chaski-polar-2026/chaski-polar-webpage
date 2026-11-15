import { useEffect, useId, useRef, useState } from 'react'
import './infotip.css'

/** Botón "?" que abre una explicación breve. Se cierra con Escape o al hacer clic fuera; funciona con teclado y táctil. */
export default function InfoTip({ term, children }: { term: string; children: string }) {
  const [abierto, setAbierto] = useState(false)
  const raiz = useRef<HTMLSpanElement>(null)
  const id = useId()
  useEffect(() => {
    if (!abierto) return
    const fuera = (e: MouseEvent | TouchEvent) => { if (raiz.current && !raiz.current.contains(e.target as Node)) setAbierto(false) }
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('mousedown', fuera)
    document.addEventListener('touchstart', fuera)
    document.addEventListener('keydown', tecla)
    return () => { document.removeEventListener('mousedown', fuera); document.removeEventListener('touchstart', fuera); document.removeEventListener('keydown', tecla) }
  }, [abierto])
  return (
    <span className="infotip" ref={raiz}>
      <button type="button" className="infotip-boton" aria-expanded={abierto} aria-controls={id} aria-label={`What does “${term}” mean?`} onClick={() => setAbierto((v) => !v)}>?</button>
      {abierto && <span role="tooltip" id={id} className="infotip-globo"><strong>{term}.</strong> {children}</span>}
    </span>
  )
}
