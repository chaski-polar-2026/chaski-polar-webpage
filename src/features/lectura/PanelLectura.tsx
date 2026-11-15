import type { Modelo } from '../explorer/lib/modelo'
import type { IdZona } from '../explorer/lib/tipos'
import type { Variable } from '../explorer/lib/variables'
import { leer } from './lectura'
import './lectura.css'
export function Frase({ texto }: { texto: string }) { return <div className="lectura-simple" key={texto}><strong>Read this as</strong><p>{texto}</p></div> }
export function Lectura({ modelo, zona, variable: v, mes }: { modelo: Modelo; zona: IdZona; variable: Variable; mes: number }) {
 const x = modelo.esEscenario(mes) ? null : modelo.valorZona(zona, v, mes)
 const tipo = v.id === 'temperatura_superficial_C' ? 'temperatura' : v.id === 'clorofila_mg_m3' ? 'clorofila' : undefined
 const nombreMes = new Intl.DateTimeFormat('en', {month:'long', timeZone:'UTC'}).format(new Date(Date.UTC(2000, modelo.mes(mes).mes)))
 const region = v.modo === 'regional' ? 'the Peruvian coastal average' : v.modo === 'indice' ? 'the Antarctic regional record' : modelo.zona(zona).nombre
 return <Frase texto={leer({ nombre: v.nombre, zona: region, mes: nombreMes, valor: x == null ? null : x * (v.factor ?? 1), anomalia: tipo ? modelo.anomaliaTxt(zona,v,mes)?.valor : null, tipo, unidad:v.unidad }) + (x != null && v.modo === 'nutriente' ? ' This is a historical monthly average, not a measurement for the selected year.' : '')} />
}
export function Guia({ variable: v }: { variable: Variable }) { return <details className="guia-variable"><summary>{v.nombre}: What is this?</summary><p>{v.que}</p><dl><dt>Unit</dt><dd>{v.unidad}</dd><dt>A rise or fall</dt><dd>{v.lecturaCambio}</dd><dt>Limits</dt><dd>{v.lecturaLimite}</dd><dt>What “usual” means</dt><dd>The average for that calendar month in the zone, using the record up to 2025.</dd><dt>Source and coverage</dt><dd>{v.fuente} {v.periodo}. {v.cobertura}.</dd></dl><strong>What the page does not do</strong><p>This is not a forecast or fishing or safety advice. It cannot detect harmful algal blooms (“red tides”). Chlorophyll is not fish abundance. Landings are not biomass.</p></details> }
