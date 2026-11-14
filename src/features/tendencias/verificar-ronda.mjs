// Ejecutar con Node 24: node src/features/tendencias/verificar-ronda.mjs
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { promediosAnuales, sensibilidadInicio, tendencia } from '../../lib/tendencias.ts'
import { ANIOS_EXTREMOS, leerRonda, mesesRonda, sinExtremos } from './ronda.ts'

const datos = leerRonda(JSON.parse(readFileSync(new URL('../../../public/assets/data/tendencias-ronda.json', import.meta.url), 'utf8')))
const csv = readFileSync(new URL('./referencia_tendencias_web.csv', import.meta.url), 'utf8').trim().split(/\r?\n/)
const [cabecera, ...filas] = csv
assert.equal(cabecera, 'variable,desde,hasta,n,sen_por_decada,p')

console.log('| Variable | Period | Sen/decade panel | Reference | p panel | p reference | Result |')
console.log('|---|---|---:|---:|---:|---:|---|')
const fallos = []
let maxPendiente = 0, maxP = 0
for (const fila of filas) {
  const [variable, desde, hasta, n, sen, p] = fila.split(',')
  const [id, zona] = variable.split(':')
  const serie = datos.series[id]
  assert.ok(serie, variable)
  const valores = zona ? serie.zonas[zona] : serie.valores
  const anual = promediosAnuales(mesesRonda(serie.inicio, valores), 'year')
  const puntos = anual.filter((punto) => punto.x >= Number(desde) && punto.x <= Number(hasta))
  const r = tendencia(puntos)
  assert.ok(r, `${variable}: insufficient yearly values`)
  const diferenciaSen = Math.abs(r.pendiente * 10 - Number(sen)), diferenciaP = Math.abs(r.p - Number(p))
  maxPendiente = Math.max(maxPendiente, diferenciaSen); maxP = Math.max(maxP, diferenciaP)
  const correcto = r.n === Number(n) && diferenciaSen < 0.001 && diferenciaP < 0.005
  if (!correcto) fallos.push({ variable, desde, hasta, n: r.n, diferenciaSen, diferenciaP })
  console.log(`| ${variable} | ${desde}–${hasta} | ${(r.pendiente * 10).toFixed(6)} | ${Number(sen).toFixed(4)} | ${r.p.toFixed(6)} | ${Number(p).toFixed(4)} | ${correcto ? 'PASS' : 'FAIL'} |`)

  // Con exclusión, ni el ajuste ni las ventanas de sensibilidad pueden usar esos años.
  const filtrados = sinExtremos(anual, true).filter((punto) => punto.x <= Number(hasta))
  assert.ok(filtrados.every((punto) => !ANIOS_EXTREMOS.includes(punto.x)))
  for (const ventana of sensibilidadInicio(filtrados)) {
    const esperados = anual.filter((punto) => punto.x >= ventana.inicio && punto.x <= Number(hasta) && !ANIOS_EXTREMOS.includes(punto.x))
    const esperado = tendencia(esperados)
    assert.equal(ventana.n, esperado.n)
    assert.equal(ventana.pendiente, esperado.pendiente)
    assert.equal(ventana.p, esperado.p)
  }
  assert.deepEqual(sinExtremos(anual, false), anual)
}
assert.throws(() => leerRonda({ series: {} }))
assert.throws(() => leerRonda({ ...datos, series: { ...datos.series, temp100: { ...datos.series.temp100, valores: [NaN] } } }))
assert.deepEqual(mesesRonda('1999-12', [1, null, 3]), [{ mes: '1999-12', valor: 1 }, { mes: '2000-01', valor: null }, { mes: '2000-02', valor: 3 }])
console.log(`\n${filas.length} reference rows. Max slope difference: ${maxPendiente.toFixed(8)}; max p difference: ${maxP.toFixed(8)}.`)
console.log('Extreme-year exclusion, sensitivity windows, missing values and data-error checks passed.')
assert.deepEqual(fallos, [], 'Reference tolerances exceeded; inspect the input and statistical method before changing either.')
