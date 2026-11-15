/** Original inline line icons, decorative because each has an adjacent text label. */
export default function IconoJuego({ tipo }: { tipo: 'pez' | 'energia' | 'luz' | 'nutrientes' | 'crecimiento' | 'profundidad' }) {
  const trazos = {
    pez: 'M3 12C7 5 15 5 19 12C15 19 7 19 3 12ZM19 12L23 8V16L19 12M8 11H8.1',
    energia: 'M13 2L5 14H11L10 22L19 9H13L13 2Z',
    luz: 'M12 3V5M12 19V21M3 12H5M19 12H21M5 5L7 7M17 17L19 19M5 19L7 17M17 7L19 5M16 12A4 4 0 1 1 8 12A4 4 0 1 1 16 12Z',
    nutrientes: 'M5 6H10V11H5ZM14 13H19V18H14ZM14 4H18V8H14ZM5 16H9V20H5Z',
    crecimiento: 'M4 20H20M7 16V12H11V8H15V4H20',
    profundidad: 'M8 3V21M4 17L8 21L12 17M16 5H21M16 10H19M16 15H21M16 20H19',
  }
  return <svg className="icono-juego" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={trazos[tipo]} /></svg>
}
