import type { ReactNode } from 'react'
import './pescadores.css'

/** Siluetas esquemáticas por grupo de especie (dibujos simples, no fotografías). */
export const ICONOS_PEZ: Record<string, ReactNode> = {
  'pelagic fish': <svg className="pesc-icono" viewBox="0 0 56 32" aria-hidden="true"><path d="M3 16C13 3 31 3 42 16 31 29 13 29 3 16Z" /><path d="M42 16 54 5v22Z" /></svg>,
  'demersal fish': <svg className="pesc-icono" viewBox="0 0 56 32" aria-hidden="true"><path d="M3 18C12 8 34 8 45 18 34 28 12 28 3 18Z" /><path d="M45 18 55 11v14Z" /><path d="M14 11 26 4l9 7Z" /></svg>,
  mollusc: <svg className="pesc-icono" viewBox="0 0 56 32" aria-hidden="true"><path d="M28 29 9 15A22 22 0 0 1 47 15Z" /></svg>,
}
