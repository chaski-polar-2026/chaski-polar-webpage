import assert from 'node:assert/strict'
import { leer, leerComparacion, SIN_DATOS } from './lectura.ts'
const base={nombre:'Sea temperature',zona:'Chimbote',mes:'May',valor:20,unidad:'°C',tipo:'temperatura'}
const casos=[
 [0,'In Chimbote, the sea temperature is close to normal for May.'],
 [.29,'In Chimbote, the sea temperature is close to normal for May.'],
 [-.29,'In Chimbote, the sea temperature is close to normal for May.'],
 [.3,'In Chimbote, the sea is 0.3 °C warmer than usual for May.'],
 [-.3,'In Chimbote, the sea is 0.3 °C cooler than usual for May.'],
 [1.5,'In Chimbote, the sea is 1.5 °C warmer than usual for May.'],
 [1.8,'In Chimbote, the sea is 1.8 °C much warmer than usual for May.'],
 [-2,'In Chimbote, the sea is 2.0 °C much cooler than usual for May.']]
let n=0
for(const [anomalia,expected] of casos){assert.equal(leer({...base,anomalia}),expected);console.log(`PASS ${++n}: ${expected}`)}
for(const valor of [null,NaN,Infinity]){assert.equal(leer({...base,valor}),SIN_DATOS);console.log(`PASS ${++n}: missing value`)}
for(const [anomalia,expected] of [[15,'close to normal for May.'],[-15,'close to normal for May.'],[-35,'35% below the usual level for May.'],[250,'250% above the usual level for May.']]){assert.equal(leer({...base,tipo:'clorofila',anomalia}),'In Chimbote, chlorophyll is '+expected);console.log(`PASS ${++n}: chlorophyll ${anomalia}`)}
assert.equal(leerComparacion(0,0,'°C'),'A and B have the same value.');n++
assert.equal(leerComparacion(null,0,'°C'),SIN_DATOS);n++
console.log(`${n}/${n} cases passed`)
