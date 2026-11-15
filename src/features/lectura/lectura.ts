export const UMBRALES = { temperaturaNormal: 0.3, temperaturaFuerte: 1.5, clorofilaNormal: 15 } as const;
export const SIN_DATOS = 'No data for this selection. Missing does not mean zero.';
export interface Entrada { nombre: string; zona: string; mes: string; valor: number | null; anomalia?: number | null; unidad: string; tipo?: 'temperatura' | 'clorofila'; }
export function leer(e: Entrada): string {
  if (e.valor == null || !Number.isFinite(e.valor)) return SIN_DATOS;
  const a = e.anomalia;
  const lugar = `In ${e.zona}, `;
  if (a != null && Number.isFinite(a)) {
    if (e.tipo === 'temperatura') {
      if (Math.abs(a) < UMBRALES.temperaturaNormal) return lugar + `the sea temperature is close to normal for ${e.mes}.`;
      return lugar + `the sea is ${Math.abs(a).toFixed(1)} °C ${Math.abs(a) > UMBRALES.temperaturaFuerte ? 'much ' : ''}${a > 0 ? 'warmer' : 'cooler'} than usual for ${e.mes}.`;
    }
    if (e.tipo === 'clorofila') return lugar + (Math.abs(a) <= UMBRALES.clorofilaNormal ? `chlorophyll is close to normal for ${e.mes}.` : `chlorophyll is ${Math.round(Math.abs(a))}% ${a > 0 ? 'above' : 'below'} the usual level for ${e.mes}.`);
  }
  return lugar + `${e.nombre.toLowerCase()} is ${Number(e.valor.toFixed(2))} ${e.unidad} for ${e.mes}.`;
}
export function leerComparacion(a: number | null, b: number | null, unidad: string): string {
  if (a == null || b == null || !Number.isFinite(a) || !Number.isFinite(b)) return SIN_DATOS;
  const d = b - a;
  return d === 0 ? 'A and B have the same value.' : `B is ${Number(Math.abs(d).toFixed(2))} ${unidad} ${d > 0 ? 'higher' : 'lower'} than A. Two selections do not establish a trend.`;
}
