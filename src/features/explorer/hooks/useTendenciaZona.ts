import { useMemo } from 'react'
import { media, pendiente } from '../../../lib/estadistica'
import { nf, signo } from '../../../lib/formato'
import type { Modelo } from '../lib/modelo'
import type { IdZona } from '../lib/tipos'
import type { Variable } from '../lib/variables'

export function useTendenciaZona(modelo: Modelo, z: IdZona, v: Variable) {
  const serie = useMemo(() => modelo.serieZona(z, v).slice(modelo.i0, modelo.ultimo + 1), [modelo, z, v])

  const tendencia = useMemo(() => {
    const anios: number[] = [], vals: (number | null)[] = []
    for (let y = 1998; y <= modelo.mes(modelo.ultimoObservado).anio; y++) {
      const t = serie.filter((_, k) => modelo.mes(modelo.i0 + k).anio === y)
      if (t.filter((q) => q != null).length >= 6) { anios.push(y); vals.push(media(t)) }
    }
    const pend = pendiente(anios, vals), m = media(vals)
    if (pend == null) return '—'
    return v.modo === 'log' ? `${signo(pend)}${nf(1).format(Math.abs(((pend * 10) / (m || 1)) * 100))} %` : `${signo(pend)}${nf(v.dec).format(Math.abs(pend * 10))} ${v.unidad}`
  }, [modelo, serie, v])

  return { serie, tendencia }
}
