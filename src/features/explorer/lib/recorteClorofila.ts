import { celdaDe, type CapaMapa } from './mapa'

/** Dibuja un recorte del mapa satelital de clorofila (el mismo dato y los mismos colores del globo en vista Detailed)
 *  para un mes y una caja de coordenadas. Devuelve una imagen (data URL) o null si no hay datos en la caja. */
export function recorteClorofila(capa: CapaMapa, mi: number, lonO: number, lonE: number, latN: number, latS: number): string | null {
  if (mi < 0 || mi >= capa.nM) return null
  const paso = capa.g.celda
  const w = Math.max(1, Math.ceil((lonE - lonO) / paso)), h = Math.max(1, Math.ceil((latN - latS) / paso))
  if (w * h > 700000) return null
  const lienzo = document.createElement('canvas')
  lienzo.width = w
  lienzo.height = h
  const ctx = lienzo.getContext('2d')
  if (!ctx) return null
  const img = ctx.createImageData(w, h)
  let hay = 0
  for (let r = 0; r < h; r++) {
    for (let k = 0; k < w; k++) {
      const { j } = celdaDe(capa, latN - (r + 0.5) * paso, lonO + (k + 0.5) * paso)
      if (j < 0) continue
      const q = capa.datos[j * capa.nM + mi]
      if (!q) continue
      const b = (capa.bandaDe[q] ?? 0) * 4, o = (r * w + k) * 4
      img.data[o] = capa.lutBanda[b] ?? 0
      img.data[o + 1] = capa.lutBanda[b + 1] ?? 0
      img.data[o + 2] = capa.lutBanda[b + 2] ?? 0
      img.data[o + 3] = Math.max(200, capa.lutBanda[b + 3] ?? 255)
      hay++
    }
  }
  if (!hay) return null
  ctx.putImageData(img, 0, 0)
  return lienzo.toDataURL('image/png')
}

/** Degradado CSS con los colores de la escala de clorofila, de poca a mucha. */
export function degradadoClorofila(capa: CapaMapa): string {
  const trozos: string[] = []
  const n = 8
  for (let i = 0; i < n; i++) {
    const q = Math.round(2 + (i / (n - 1)) * 252) * 4
    trozos.push(`rgb(${capa.lut[q] ?? 0}, ${capa.lut[q + 1] ?? 0}, ${capa.lut[q + 2] ?? 0}) ${Math.round((i / (n - 1)) * 100)}%`)
  }
  return `linear-gradient(90deg, ${trozos.join(', ')})`
}
