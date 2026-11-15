import { tendencia, promediosAnuales, MESES_ESTACION, type Estacion, type Punto } from '../../lib/tendencias.ts'
import { ANIOS_EXTREMOS } from './ronda.ts'
export interface Configuracion { variable:string; zone:string; unit:string; source:string; dataType:string; coverage:string; start:number; end:number; season:Estacion; seasonLabel:string; exclude:boolean; }
export function minimoMeses(season:Estacion) {
 const meses=MESES_ESTACION[season] ?? Array.from({length:12},(_,i)=>i+1)
 return meses.findIndex((_,i)=>promediosAnuales(meses.slice(0,i+1).map(m=>({mes:`2000-${String(m).padStart(2,'0')}`,valor:1})),season).length>0)+1
}
export function crearEvidencia(anuales:Punto[],c:Configuracion,generatedAt=new Date().toISOString()) {
 const filtrar=(start:number,exclude:boolean)=>anuales.filter(p=>p.x>=start&&p.x<=c.end&&(!exclude||!ANIOS_EXTREMOS.includes(p.x)))
 const convertir=(p:Punto[])=>{const r=tendencia(p);return r?{n:r.n,slopePerDecade:r.pendiente*10,interval95:r.intervalo95.map(x=>x*10),p:r.p}:null}
 const robustness=[{label:'Selected period',start:c.start,exclude:c.exclude},{label:'Start year 2003',start:2003,exclude:c.exclude},{label:'Start year 2010',start:2010,exclude:c.exclude},{label:'Selected period without extreme years',start:c.start,exclude:true}].map((r,i)=>{
 const pts=filtrar(r.start,r.exclude), allowed=i===0||i===3||(anuales[0]?.x??Infinity)<=r.start
 return {label:r.label,period:{start:r.start,end:c.end},excludedYears:r.exclude?ANIOS_EXTREMOS.filter(y=>y>=r.start&&y<=c.end):[],includedYears:pts.map(p=>p.x),result:allowed?convertir(pts):null}
 })
 const valid=robustness.flatMap(r=>r.result?[r.result]:[])
 let summary='Not enough years to assess robustness.'
 if(valid.length){
  if(valid.every(r=>r.p>=.05))summary='No significant trend in any period tested. This is also a result.'
  else if(valid.some(r=>r.p>=.05)||new Set(valid.map(r=>Math.sign(r.slopePerDecade))).size>1)summary='The conclusion changes with the period or when extreme years are removed. Treat it with caution.'
  else summary=valid.length===robustness.length?'The trend holds in every period tested.':'The trend holds in the available tests. Some tests have too few years.'
 }
 const years=Array.from({length:Math.max(0,c.end-c.start+1)},(_,i)=>{const year=c.start+i,value=anuales.find(p=>p.x===year)?.y??null;return {year,value,unit:c.unit,included:value!=null&&(!c.exclude||!ANIOS_EXTREMOS.includes(year))}})
 const selected=filtrar(c.start,c.exclude), result=convertir(selected)
 return {...c,period:{start:c.start,end:c.end},excludedYears:c.exclude?ANIOS_EXTREMOS.filter(y=>y>=c.start&&y<=c.end):[],n:selected.length,slopePerDecade:result?.slopePerDecade??null,interval95:result?.interval95??null,p:result?.p??null,robustness,summary,years,missingYears:years.filter(y=>y.value==null).length,minimumMonths:minimoMeses(c.season),generatedAt,method:"Mann–Kendall test; Sen's slope; 95% interval; two-sided p from a normal approximation."}
}
export type Evidencia=ReturnType<typeof crearEvidencia>
export const numero=(n:number)=>Math.abs(n)>=100?n.toFixed(0):String(Number(n.toPrecision(3)))
export const valorP=(p:number)=>p<0.001?'< 0.001':p.toFixed(3)
export const campoCSV=(value:unknown)=>{const s=String(value??'');return /[",\r\n]/.test(s)?'"'+s.replaceAll('"','""')+'"':s}
export function csvEvidencia(e:Evidencia){return ['year,value,unit,included',...e.years.map(y=>[y.year,y.value,y.unit,y.included].map(campoCSV).join(','))].join('\r\n')+'\r\n'}
export const jsonEvidencia=(e:Evidencia)=>JSON.stringify(e,null,2)
export const nombreArchivo=(e:Evidencia)=>[e.variable,e.zone,e.period.start,e.period.end].join('-').normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g,'-')
