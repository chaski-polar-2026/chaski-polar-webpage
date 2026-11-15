import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {validar,describir,ORDEN,ultimoDato} from './relaciones.ts'
const raw=JSON.parse(readFileSync(new URL('../../../public/assets/data/nino-relaciones.json',import.meta.url),'utf8'))
const d=validar(raw)
for(const id of ORDEN){const r=raw.variables[id],v=describir(d.variables[id]);assert.deepEqual([v.r,v.desfase,v.mejor,v.sinExtremos,v.n],[r.r_lag0,r.mejor_desfase_meses,r.r_mejor_desfase,r.r_sin_anios_extremos,r.n]);assert.ok(v.robustez.includes(`r = ${r.r_sin_anios_extremos}.`));console.log(`PASS ${id}: r=${v.r}, lag=${v.desfase}, best=${v.mejor}, without extremes=${v.sinExtremos}, n=${v.n}`)}
assert.deepEqual(ultimoDato([1,null,NaN,2,9],3),{i:3,valor:2})
assert.equal(ultimoDato([null,NaN],1),null)
assert.equal(describir({...d.variables.sst,r_lag0:.3}).fuerza,'Moderate')
assert.equal(describir({...d.variables.sst,r_lag0:.6}).fuerza,'Moderate')
assert.throws(()=>validar({}))
console.log('7/7 cards match JSON; thresholds, missing values and observed cutoff PASS')
