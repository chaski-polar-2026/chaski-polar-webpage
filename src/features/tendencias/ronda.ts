import type { Punto } from '../../lib/tendencias'

export type VariableRonda = 'temp100' | 'sealevel' | 'oxy100' | 'seaice' | 'sst_long'
export type SerieRonda = {
  nombre: string
  unidad: string
  alcance: string
  tipo: 'reanalysis' | 'observation' | 'observation-based reconstruction'
  fuente: string
  inicio: string
  valores?: (number | null)[]
  zonas?: Record<string, (number | null)[]>
}
export type Ronda = { generado: string; series: Record<VariableRonda, SerieRonda> }

export const VARIABLES_RONDA: VariableRonda[] = ['temp100', 'sealevel', 'oxy100', 'seaice', 'sst_long']
export const ANIOS_EXTREMOS = [1998, 2016, 2023]

/** Valida el archivo recibido para que una respuesta incompleta permita reintentar la carga. */
export function leerRonda(datos: unknown): Ronda {
  const objeto = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null
  const valores = (v: unknown) => Array.isArray(v) && v.length > 0 && v.every((n) => n === null || (typeof n === 'number' && Number.isFinite(n)))
  if (!objeto(datos) || typeof datos.generado !== 'string' || !objeto(datos.series)) throw new Error('Invalid trend data')
  for (const id of VARIABLES_RONDA) {
    const s = datos.series[id]
    if (!objeto(s) || !['nombre', 'unidad', 'alcance', 'fuente', 'inicio'].every((k) => typeof s[k] === 'string' && s[k].length > 0)
      || !/^\d{4}-(0[1-9]|1[0-2])$/.test(String(s.inicio))
      || !['reanalysis', 'observation', 'observation-based reconstruction'].includes(String(s.tipo))) throw new Error('Invalid trend series')
    if (id === 'sst_long') {
      if (!objeto(s.zonas) || !valores(s.zonas.norte_centro) || !valores(s.zonas.costa_sur)) throw new Error('Invalid regional series')
    } else if (!valores(s.valores)) throw new Error('Invalid monthly series')
  }
  return datos as Ronda
}

export function mesesRonda(inicio: string, valores: (number | null)[]) {
  const anio = Number(inicio.slice(0, 4)), mes = Number(inicio.slice(5, 7)) - 1
  return valores.map((valor, i) => ({
    mes: `${anio + Math.floor((mes + i) / 12)}-${String((mes + i) % 12 + 1).padStart(2, '0')}`,
    valor,
  }))
}

/** La exclusión se aplica a los mismos puntos que alimentan resultado, comparación y sensibilidad. */
export function sinExtremos(puntos: Punto[], excluir: boolean): Punto[] {
  return excluir ? puntos.filter((p) => !ANIOS_EXTREMOS.includes(p.x)) : puntos
}
