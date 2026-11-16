import * as THREE from 'three'
import { sinContorno } from './escena'

export const VOXEL = 0.2
export const PIXEL_VOXEL = VOXEL * 0.5

type Cubo = [number, number, number, number]

const PIEDRA = [0x4d6274, 0x5b7083, 0x41566a, 0x506a7d]
const ARENA = [0xb9a077, 0xa78f6c, 0xc4ad88]
const HIELO = [0xeaf6fd, 0xd8eef8, 0xffffff]
const elegir = (colores: number[], indice: number) => colores[Math.abs(indice) % colores.length]!

function instanciar(cubos: Cubo[], geometria: THREE.BoxGeometry): THREE.InstancedMesh {
  const malla = new THREE.InstancedMesh(geometria, sinContorno(new THREE.MeshLambertMaterial()), cubos.length)
  const matriz = new THREE.Matrix4(), color = new THREE.Color()
  cubos.forEach(([x, y, z, hexadecimal], indice) => {
    matriz.setPosition(x * VOXEL, y * VOXEL, z * VOXEL)
    malla.setMatrixAt(indice, matriz)
    malla.setColorAt(indice, color.setHex(hexadecimal))
  })
  malla.instanceMatrix.needsUpdate = true
  malla.instanceColor!.needsUpdate = true
  return malla
}

function roca(cubos: Cubo[], altura: (x: number, z: number) => number, cx: number, cz: number, radio: number, aplaste = 0.8) {
  const base = altura(cx, cz), limite = Math.ceil(radio + 1)
  for (let x = -limite; x <= limite; x++) for (let z = -limite; z <= limite; z++) for (let y = 0; y <= limite; y++) {
    const d = Math.hypot(x, z, y / aplaste) + Math.sin(x * 0.9 + z * 0.7 + y) * 0.6
    if (d < radio && d > radio - 1.8) cubos.push([cx + x, base + y, cz + z, elegir(PIEDRA, x + y + z)])
  }
}

/** Construye un fondo antártico amplio con las proporciones voxel del prototipo original. */
export function crearFondoKiriVoxel(escena: THREE.Scene): { rayos: THREE.Mesh[]; nieve: THREE.Points } {
  const cubos: Cubo[] = []
  const radio = 150
  const enMundo = (x: number, z: number) => Math.hypot(x, z) <= radio
  const ruido = (x: number, z: number) => Math.sin(x * 0.05) * 3 + Math.cos(z * 0.045) * 3 + Math.sin((x + z) * 0.03) * 3 + Math.sin(x * 0.17 + z * 0.13)
  const alturas = new Map<string, number>()
  for (let x = -radio; x <= radio; x++) for (let z = -radio; z <= radio; z++) if (enMundo(x, z)) alturas.set(`${x},${z}`, Math.max(0, Math.round(ruido(x, z) + 10)))
  const altura = (x: number, z: number) => alturas.get(`${x},${z}`) ?? 0
  for (let x = -radio; x <= radio; x++) for (let z = -radio; z <= radio; z++) {
    if (!enMundo(x, z)) continue
    const h = altura(x, z), piso = Math.min(h, altura(x + 1, z), altura(x - 1, z), altura(x, z + 1), altura(x, z - 1)) - 1
    for (let y = Math.max(0, piso); y <= h; y++) cubos.push([x, y, z, elegir(y === h ? ARENA : PIEDRA, x * 3 + y + z)])
  }
  for (let i = 0; i < 30; i++) {
    const a = i * 2.399, d = 110 + (i * 37) % 40
    roca(cubos, altura, Math.round(Math.cos(a) * d), Math.round(Math.sin(a) * d), 6 + (i % 8), 0.8)
  }
  for (let i = 0; i < 10; i++) {
    const a = i * 2.399, d = 130, cx = Math.round(Math.cos(a) * d), cz = Math.round(Math.sin(a) * d), alto = 25 + (i * 13) % 36, base = altura(cx, cz)
    for (let y = 0; y < alto; y++) {
      const r = Math.max(1.5, 5 * (1 - y / alto * 0.7))
      for (let x = -6; x <= 6; x++) for (let z = -6; z <= 6; z++) if (Math.hypot(x, z) < r && Math.hypot(x, z) > r - 1.5) cubos.push([cx + x, base + y, cz + z, elegir(PIEDRA, x + y + z)])
    }
  }
  const decoracion = [0xf39c12, 0xe4572e, 0xffd166, 0xd96aa7, 0xff8fb1]
  for (let i = 0; i < 55; i++) {
    const a = i * 2.399, d = 25 + (i * 19) % 105, x0 = Math.round(Math.cos(a) * d), z0 = Math.round(Math.sin(a) * d), h = altura(x0, z0) + 1, color = decoracion[i % decoracion.length]!
    if (i % 3) {
      const alto = 4 + i % 8, r = i % 4 ? 1 : 2
      for (let y = 0; y < alto; y++) for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) if (Math.max(Math.abs(x), Math.abs(z)) === r || y === 0) cubos.push([x0 + x, h + y, z0 + z, color])
    } else for (let k = 0; k < 5; k++) for (let l = 0; l <= 4; l++) { const g = k / 5 * Math.PI * 2; cubos.push([x0 + Math.round(Math.cos(g) * l), h, z0 + Math.round(Math.sin(g) * l), color]) }
  }
  const techo = 76
  const alturaTecho = (x: number, z: number) => Math.round(1 + Math.abs(Math.sin(x * 0.12) * Math.cos(z * 0.1)) * 4)
  for (let x = -radio; x <= radio; x++) for (let z = -radio; z <= radio; z++) {
    if (!enMundo(x, z) || (Math.abs(x - 30) < 14 && Math.abs(z) < radio) || (Math.abs(z + 40) < 10 && Math.abs(x) < radio)) continue
    const grosor = alturaTecho(x, z)
    cubos.push([x, techo - grosor, z, elegir(HIELO, x + z)])
    const borde = Math.abs(Math.abs(x - 30) - 14) < 1 || Math.abs(Math.abs(z + 40) - 10) < 1 || !enMundo(x + 1, z) || alturaTecho(x + 1, z) !== grosor || alturaTecho(x, z + 1) !== grosor
    if (borde) for (let y = 0; y < grosor; y++) cubos.push([x, techo - y, z, elegir(HIELO, x + y + z)])
    if ((x * 7 + z * 13) % 37 === 0) { const largo = 6 + Math.abs((x + z) % 15); for (let y = 0; y < largo; y++) cubos.push([x, techo - grosor - y, z, 0xbfe2f5]) }
  }
  const geometria = new THREE.BoxGeometry(VOXEL, VOXEL, VOXEL)
  escena.add(instanciar(cubos, geometria))

  const rayos: THREE.Mesh[] = []
  const rayoMaterial = sinContorno(new THREE.MeshBasicMaterial({ color: 0xd8f3ff, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }))
  for (let i = 0; i < 14; i++) {
    const rayo = new THREE.Mesh(new THREE.BoxGeometry(1.5 + (i % 3) * 0.7, 19, 1.5 + (i % 2) * 0.8), rayoMaterial)
    const enX = i < 8
    rayo.position.set(enX ? 6 + (i % 4) * 0.25 : (i % 7) - 3, 9.5, enX ? (i % 9) - 4 : -8 + (i % 3) * 0.4)
    rayo.rotation.z = 0.12
    escena.add(rayo)
    rayos.push(rayo)
  }
  const posiciones = new Float32Array(900 * 3)
  for (let i = 0; i < 900; i++) { posiciones[i * 3] = ((i * 17) % 400 - 200) / 10; posiciones[i * 3 + 1] = ((i * 29) % 190) / 10; posiciones[i * 3 + 2] = ((i * 23) % 400 - 200) / 10 }
  const geometriaNieve = new THREE.BufferGeometry()
  geometriaNieve.setAttribute('position', new THREE.BufferAttribute(posiciones, 3))
  const nieve = new THREE.Points(geometriaNieve, sinContorno(new THREE.PointsMaterial({ color: 0xffffff, size: 0.09, transparent: true, opacity: 0.7, depthWrite: false })))
  escena.add(nieve)
  return { rayos, nieve }
}

export function crearPersonajeVoxel(escena: THREE.Scene, canvas: HTMLCanvasElement, tamaño = PIXEL_VOXEL, profundidad = 1): THREE.InstancedMesh {
  const contexto = canvas.getContext('2d')
  if (!contexto) throw new Error('No se pudo leer el personaje pixelado')
  const imagen = contexto.getImageData(0, 0, canvas.width, canvas.height).data
  const cubos: Cubo[] = []
  for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
    const indice = (y * canvas.width + x) * 4
    if (imagen[indice + 3]! < 128) continue
    const color = new THREE.Color(`rgb(${imagen[indice]},${imagen[indice + 1]},${imagen[indice + 2]})`).getHex()
    for (let z = -profundidad; z <= profundidad; z++) cubos.push([x - canvas.width / 2, canvas.height / 2 - y, z, color])
  }
  const malla = new THREE.InstancedMesh(new THREE.BoxGeometry(tamaño, tamaño, tamaño), sinContorno(new THREE.MeshLambertMaterial()), cubos.length)
  const matriz = new THREE.Matrix4(), color = new THREE.Color()
  cubos.forEach(([x, y, z, hexadecimal], indice) => { matriz.setPosition(x * tamaño, y * tamaño, z * tamaño); malla.setMatrixAt(indice, matriz); malla.setColorAt(indice, color.setHex(hexadecimal)) })
  malla.instanceMatrix.needsUpdate = true
  malla.instanceColor!.needsUpdate = true
  escena.add(malla)
  return malla
}

const GIRO_MAX = THREE.MathUtils.degToRad(28)
const tmpDerecha = new THREE.Vector3(), tmpMov = new THREE.Vector3()
const angulo = (d: number) => Math.atan2(Math.sin(d), Math.cos(d))

/** El personaje siempre muestra su frente a la cámara; solo se desvía un poco (máx. ±28°) según hacia dónde gire la vista respecto al encuadre inicial, con suavizado. */
export function mirarALaCamara(malla: THREE.Object3D, camara: THREE.Camera): void {
  const haciaCamara = Math.atan2(camara.position.x - malla.position.x, camara.position.z - malla.position.z)
  const datos = malla.userData as { azimutBase?: number; previa?: THREE.Vector3; espejo?: number }
  datos.azimutBase ??= haciaCamara
  // Espejo directo (sin giro): si el personaje se mueve hacia la derecha o la izquierda de la pantalla, se voltea al instante.
  const derecha = tmpDerecha.set(1, 0, 0).applyQuaternion(camara.quaternion)
  if (datos.previa) {
    const dx = tmpMov.subVectors(malla.position, datos.previa).dot(derecha)
    if (Math.abs(dx) > 0.004) datos.espejo = dx < 0 ? -1 : 1
  }
  datos.previa = (datos.previa ?? new THREE.Vector3()).copy(malla.position)
  malla.scale.x = Math.abs(malla.scale.x) * (datos.espejo ?? 1)
  const desvio = THREE.MathUtils.clamp(angulo(haciaCamara - datos.azimutBase) * 0.35, -GIRO_MAX, GIRO_MAX)
  const objetivo = haciaCamara + desvio
  malla.rotation.y += angulo(objetivo - malla.rotation.y) * 0.15
}

/** Lecho voxel para el corredor costero peruano; comparte escala y paleta del prototipo. */
export function crearFondoCardumenVoxel(escena: THREE.Scene, zMin: number, zMax: number): void {
  const cubos: Cubo[] = []
  // Contiguous 0.8 m blocks, one exposed surface per cell instead of five buried layers.
  // Highest terrain remains below Y_MIN (-12.5); decorative geometry cannot hide food.
  for (let x = -100; x <= 56; x += 4) for (let z = Math.floor(zMin / VOXEL); z <= Math.ceil(zMax / VOXEL); z += 4) {
    const h = -1 + Math.round(Math.sin(x * 0.09) + Math.cos(z * 0.04) + Math.sin((x + z) * 0.035))
    cubos.push([x, h, z, elegir(ARENA, x + z)])
  }
  // Afloramientos laterales voxel fuera del corredor navegable principal.
  for (let i = 0; i < 32; i++) {
    const cx = i % 2 ? -100 - (i % 9) : 66 + (i % 8), cz = Math.floor(zMin / VOXEL) + Math.floor((i + 1) * (zMax - zMin) / (VOXEL * 34)), radio = 3 + i % 4
    for (let x = -radio; x <= radio; x++) for (let z = -radio; z <= radio; z++) for (let y = 0; y < radio; y++) if (Math.hypot(x, z, y / 0.8) < radio && Math.hypot(x, z, y / 0.8) > radio - 1.5) cubos.push([cx + x, 5 + y, cz + z, elegir(PIEDRA, x + y + z)])
  }
  const lecho = instanciar(cubos, new THREE.BoxGeometry(VOXEL * 4, VOXEL * 4, VOXEL * 4))
  // Los índices Y del terreno y los afloramientos describen relieve relativo al lecho.
  // Sin este desplazamiento quedaban alrededor de y=0 y formaban una rejilla sobre la superficie.
  lecho.position.y = -14
  escena.add(lecho)
}

/** Fondo rocoso y placas de hielo para Lumi, ajustado a su corredor lateral original. */
export function crearEntornoLumiVoxel(escena: THREE.Scene): void {
  const cubos: Cubo[] = []
  // El lecho se extiende mucho mas que el pasillo jugable y sus bordes se funden con el color del agua,
  // para que no se vea un corte seco donde termina.
  const agua = new THREE.Color(0x1b5f86), mezcla = new THREE.Color()
  const fundir = (hex: number, x: number, z: number) => {
    const t = THREE.MathUtils.clamp(Math.max((Math.abs(z) - 22) / 50, (Math.abs(x) - 60) / 30), 0, 1)
    return t <= 0 ? hex : mezcla.setHex(hex).lerp(agua, t * t * (3 - 2 * t)).getHex()
  }
  for (let x = -90; x <= 90; x++) for (let z = -80; z <= 80; z++) {
    const relieve = Math.round(2 + Math.sin(x * 0.08) * 1.4 + Math.cos(z * 0.19) * 0.8)
    for (let y = 0; y <= relieve; y++) cubos.push([x, y, z, fundir(elegir(y === relieve ? ARENA : PIEDRA, x + y + z), x, z)])
  }
  for (let i = 0; i < 16; i++) {
    const cx = -82 + i * 11, cz = i % 2 ? -14 : 14, radio = 3 + i % 3
    for (let x = -radio; x <= radio; x++) for (let z = -radio; z <= radio; z++) for (let y = 0; y < radio; y++) {
      const d = Math.hypot(x, z, y / 0.8)
      if (d < radio && d > radio - 1.5) cubos.push([cx + x, 3 + y, cz + z, elegir(PIEDRA, x + y + z)])
    }
  }
  // Unidades del corredor de Lumi: cubo de escena de 0.2, suelo bajo Y_MIN.
  const malla = instanciar(cubos, new THREE.BoxGeometry(VOXEL, VOXEL, VOXEL))
  malla.position.set(0, Y_MIN_LUMI, -4)
  escena.add(malla)
}

const Y_MIN_LUMI = -14

/** Placa formada por cubos y carámbanos cortos; la escena anima su grupo como antes. */
export function crearPlacaHieloVoxel(escena: THREE.Scene, ancho: number, profundidad: number): THREE.Group {
  const grupo = new THREE.Group()
  const cubos: Cubo[] = []
  const semiancho = 2
  const semiprof = Math.ceil(profundidad / VOXEL / 2)
  for (let x = -semiancho; x <= semiancho; x++) for (let z = -semiprof; z <= semiprof; z++) {
    cubos.push([x, 0, z, elegir(HIELO, x + z)])
    if ((x * 7 + z * 13) % 11 === 0) cubos.push([x, -1, z, 0xbfe2f5])
  }
  const placa = instanciar(cubos, new THREE.BoxGeometry(VOXEL, VOXEL, VOXEL))
  placa.position.y = 0.5
  grupo.add(placa)
  grupo.scale.x = ancho
  escena.add(grupo)
  return grupo
}
