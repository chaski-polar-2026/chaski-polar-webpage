// Ejecutar con Node 24: node src/features/tendencias/verificar-evidencia.mjs
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { promediosAnuales, tendencia } from '../../lib/tendencias.ts'
import { leerRonda, mesesRonda } from './ronda.ts'
import { crearEvidencia, csvEvidencia, jsonEvidencia, campoCSV, numero, valorP } from './evidencia.ts'

const datos = leerRonda(JSON.parse(readFileSync(new URL('../../../public/assets/data/tendencias-ronda.json', import.meta.url), 'utf8')))
const FECHA = '2026-11-14T00:00:00.000Z'
function anualesDe(id, zona) {
  const s = datos.series[id]
  return { s, anuales: promediosAnuales(mesesRonda(s.inicio, id === 'sst_long' ? s.zonas[zona] : s.valores), 'year').filter((p) => p.x <= 2025) }
}
function caso(id, zona, start, exclude = false) {
  const { s, anuales } = anualesDe(id, zona)
  return { anuales, e: crearEvidencia(anuales, { variable: s.nombre, zone: zona || s.alcance, unit: s.unidad, source: s.fuente, dataType: s.tipo, coverage: 'test', start, end: 2025, season: 'year', seasonLabel: 'Whole year', exclude }, FECHA) }
}
let n = 0
const ok = (nombre, f) => { f(); n++; console.log('PASS', nombre) }

ok('sea level 1998–2025 holds in every period', () => { const { e } = caso('sealevel', '', 1998); assert.equal(e.summary, 'The trend holds in every period tested.'); assert.ok(e.robustness.every((r) => r.result && r.result.p < .05)) })
ok('sea ice 1979–2025 changes with the period', () => { const { e } = caso('seaice', '', 1979); assert.equal(e.summary, 'The conclusion changes with the period or when extreme years are removed. Treat it with caution.'); assert.ok(e.robustness[0].result.p >= .05) })
ok('long SST south coast 1998–2025 shows no significant trend', () => { const { e } = caso('sst_long', 'costa_sur', 1998); assert.equal(e.summary, 'No significant trend in any period tested. This is also a result.') })
ok('every robustness row equals the existing functions', () => {
  for (const [id, zona, start] of [['sealevel', '', 1998], ['seaice', '', 1979], ['temp100', '', 1998]]) {
    const { anuales, e } = caso(id, zona, start)
    for (const r of e.robustness) {
      if (!r.result) continue
      const pts = anuales.filter((p) => p.x >= r.period.start && p.x <= 2025 && !r.excludedYears.includes(p.x))
      const t = tendencia(pts)
      assert.equal(r.result.slopePerDecade, t.pendiente * 10)
      assert.equal(r.result.p, t.p)
      assert.equal(r.result.n, t.n)
    }
  }
})
ok('extreme years are removed only when asked', () => {
  const sin = caso('sealevel', '', 1998, true).e, con = caso('sealevel', '', 1998, false).e
  assert.deepEqual(sin.excludedYears, [1998, 2016, 2023]); assert.deepEqual(con.excludedYears, [])
  assert.equal(sin.robustness[3].includedYears.includes(2016), false)
  assert.equal(con.robustness[0].includedYears.includes(2016), true)
})
ok('CSV matches the displayed values', () => {
  const { e } = caso('sealevel', '', 1998, true)
  const lines = csvEvidencia(e).trim().split(/\r?\n/)
  assert.equal(lines[0], 'year,value,unit,included'); assert.equal(lines.length, e.years.length + 1)
  for (const [i, y] of e.years.entries()) { const [yr, val, , inc] = lines[i + 1].split(','); assert.equal(Number(yr), y.year); assert.equal(val === '' ? null : Number(val), y.value); assert.equal(inc, String(y.included)) }
  assert.equal(lines.find((l) => l.startsWith('2016,')).endsWith(',false'), true)
})
ok('JSON keeps full precision and matches the analysis', () => {
  const { e } = caso('temp100', '', 1998); const j = JSON.parse(jsonEvidencia(e))
  assert.equal(j.slopePerDecade, e.slopePerDecade); assert.equal(j.p, e.p); assert.equal(j.robustness.length, 4)
})
ok('CSV fields are escaped', () => { assert.equal(campoCSV('a,b'), '"a,b"'); assert.equal(campoCSV('say "hi"'), '"say ""hi"""'); assert.equal(campoCSV(null), '') })
ok('numbers are shown in a readable way', () => { assert.equal(numero(0.025849123), '0.0258'); assert.equal(numero(1234.5), '1235'); assert.equal(valorP(0.0000049), '< 0.001'); assert.equal(valorP(0.0415), '0.042') })
console.log(`${n}/${n} evidence checks passed`)
