export const ORDEN = ['sst','seaLevel','deepTemperature','deepOxygen','oxygen','phosphate','chlorophyll'] as const;
export type Clave = typeof ORDEN[number];
export interface Relacion { nombre:string; unidad:string; r_lag0:number; mejor_desfase_meses:number; r_mejor_desfase:number; r_sin_anios_extremos:number; n:number; neff_lag0:number; p_lag0:number; signo:'positive'|'negative'; }
export interface Datos { source:string; variables:Record<Clave,Relacion>; }
export function validar(d: unknown): Datos {
 const x = d as Datos;
 if(!x || typeof x.source !== 'string' || !x.variables) throw new Error('Invalid relationship data');
 for(const id of ORDEN) {
  const r=x.variables[id];
  if(!r || typeof r.nombre!=='string' || typeof r.unidad!=='string' || !['positive','negative'].includes(r.signo)) throw new Error('Invalid variable');
  for(const k of ['r_lag0','mejor_desfase_meses','r_mejor_desfase','r_sin_anios_extremos','n','neff_lag0','p_lag0'] as const) if(typeof r[k]!=='number'||!Number.isFinite(r[k])) throw new Error('Invalid number');
 }
 return x;
}
export function describir(r: Relacion) {
 const fuerza=Math.abs(r.r_lag0)<.3?'Weak':Math.abs(r.r_lag0)<=.6?'Moderate':'Strong';
 return {
  direccion:r.signo==='positive'?'moves with El Niño':'moves against El Niño', fuerza,
  r:r.r_lag0, desfase:r.mejor_desfase_meses, mejor:r.r_mejor_desfase, sinExtremos:r.r_sin_anios_extremos, n:r.n,
  retraso:r.mejor_desfase_meses>=1 && Math.abs(r.r_mejor_desfase)>Math.abs(r.r_lag0) ? `The strongest link appears about ${r.mejor_desfase_meses} months after El Niño changes.` : '',
  robustez:`Without the extreme years (1998, 2016, 2023) the link is r = ${r.r_sin_anios_extremos}.`,
  debilita:Math.abs(r.r_sin_anios_extremos)<Math.abs(r.r_lag0)*2/3,
 };
}
export function ultimoDato(valores: readonly (number|null)[], limite:number) {
 for(let i=Math.min(limite,valores.length-1);i>=0;i--) if(valores[i]!=null && Number.isFinite(valores[i])) return {i,valor:valores[i]!};
 return null;
}
export const ENLACES: Record<string,Clave> = {temperatura_superficial_C:'sst',nivel_mar_anomalia_m:'seaLevel',oxigeno_disuelto:'oxygen',fosfato:'phosphate',clorofila_mg_m3:'chlorophyll'};
