import { IconoSello } from './Cabina'

export const CLAVE_GUIA_ESCRITORIO = 'cardumen-guia-escritorio-v1'

export function faltaGuiaEscritorio(): boolean {
  try { return localStorage.getItem(CLAVE_GUIA_ESCRITORIO) !== 'vista' } catch { return true }
}

export function recordarGuiaEscritorio(): void {
  try { localStorage.setItem(CLAVE_GUIA_ESCRITORIO, 'vista') } catch { /* La ayuda sigue disponible si el almacenamiento no lo está. */ }
}

export type ReferenciaGuia = 'manual' | 'reporte' | 'expediente' | 'carpeta' | 'plan'

/** Guía no bloqueante: explica acciones sin revelar la respuesta de los expedientes. */
export default function GuiaEscritorio({ paso, hayPlan, alPaso, alCerrar, alMostrar }: {
  paso: number; hayPlan: boolean; alPaso: (n: number) => void; alCerrar: () => void; alMostrar: (id: ReferenciaGuia) => void
}) {
  const pasos = [
    { titulo: 'Check before deciding', texto: 'The manual explains the rules. The satellite report contains the data to check each claim. Move papers to read them together.', accion: 'reporte' as const, boton: 'View report' },
    { titulo: 'Select and stamp a file', texto: 'Choose a request, letter or press report, then use the green or red stamp. Stamp labels depend on the document. Do not stamp the manual or report.', accion: 'expediente' as const, boton: 'Choose a file' },
    { titulo: 'File only the year folder', texto: 'You do not need to file every paper. The folder summarizes the year: drag it to the matching category, or select it and tap a tray.', accion: 'carpeta' as const, boton: 'Select folder' },
    { titulo: hayPlan ? 'Prepare the next generation' : 'Review what remains', texto: hayPlan ? 'In the plan, choose a strategy and press Sign. Each has a benefit and a cost; review the year before choosing.' : 'This is the final year of the campaign. There is no next plan to sign: review the files and folder.', accion: hayPlan ? 'plan' as const : 'manual' as const, boton: hayPlan ? 'View plan' : 'View manual' },
    { titulo: 'Submit the completed shift', texto: 'Stamp every file, file the folder and sign the plan if there is one. The counter shows what remains. Submit becomes available when finished; then you can see your correct decisions and citations.', accion: 'manual' as const, boton: 'Check manual' },
  ]
  const actual = pasos[paso]!
  return <aside id="cabina-guia" className="cabina-guia" aria-labelledby="cabina-guia-titulo">
    <div className="cabina-guia-cabecera"><span>First shift · {paso + 1} / {pasos.length}</span><button type="button" onClick={alCerrar}>Close guide</button></div>
    <h3 id="cabina-guia-titulo" aria-live="polite">{paso === 1 && <IconoSello pequeno />}{actual.titulo}</h3>
    <p>{actual.texto}</p>
    <div className="cabina-guia-acciones">
      <button type="button" onClick={() => alMostrar(actual.accion)}>{actual.boton}</button>
      {paso > 0 && <button type="button" onClick={() => alPaso(paso - 1)}>Back</button>}
      {paso < pasos.length - 1 ? <button type="button" onClick={() => alPaso(paso + 1)}>Next →</button>
        : <button type="button" onClick={alCerrar}>Got it</button>}
    </div>
  </aside>
}
