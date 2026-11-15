import * as THREE from 'three'
import { sinContorno } from './escena'

/** Original decorative geometry only: no collisions, resources or game state. */
export function crearDiorama(escena: THREE.Scene, limites: {
  xMin: number; xMax: number; zMin: number; zMax: number; suelo: number
}): (t: number) => void {
  const reducido = matchMedia('(prefers-reduced-motion: reduce)')
  const tiempo = { value: 0 }
  const cubos: { x: number; y: number; z: number; s: number; color: number; vegetal: boolean }[] = []
  const verdes = [0x3fc28c, 0x238c78, 0x63cde8]
  const agregar = (x: number, y: number, z: number, s: number, color: number, vegetal = false) =>
    cubos.push({ x, y, z, s, color, vegetal })
  const largo = limites.zMax - limites.zMin
  // Tall silhouettes sit outside the navigable corridor. The center remains open.
  const grupos = Math.max(12, Math.ceil(largo / 4))
  for (let i = 0; i < grupos; i++) {
    const x = i % 2 ? limites.xMin - 1.5 : limites.xMax + 1.5
    const z = limites.zMin + (i + 0.5) / grupos * largo
    // Far terraces form a darker silhouette behind the smaller plants and coral.
    const fondoX = i % 2 ? limites.xMin - 4 : limites.xMax + 4
    for (let escalon = 0; escalon < 3; escalon++) {
      for (let j = 0; j <= escalon; j++) agregar(fondoX + escalon * (i % 2 ? -0.8 : 0.8),
        limites.suelo + j * 0.8, z, 0.8, escalon % 2 ? 0x244a60 : 0x30566a)
    }
    for (let k = 0; k < 3; k++) {
      const alto = 3 + (i * 7 + k * 3) % 8
      for (let j = 0; j < alto; j++) {
        const lado = k === 0 ? 0.32 : 0.24
        agregar(x + k * 0.42 + Math.floor(j / 3) * 0.16, limites.suelo + j * lado, z + k * 0.3,
          lado, verdes[(i + k) % verdes.length]!, true)
        if (j > 1 && j % 3 === 0) agregar(x + k * 0.42 - 0.28, limites.suelo + j * lado,
          z + k * 0.3, lado, verdes[(i + k + 1) % verdes.length]!, true)
      }
    }
    // Small warm coral branches, confined to the same decorative margins.
    for (let j = 0; j < 4; j++) {
      agregar(x - 0.7, limites.suelo + j * 0.25, z - 0.8, 0.25, j % 2 ? 0xf08a4b : 0xb9a077)
      if (j > 1) agregar(x - 0.45, limites.suelo + j * 0.25, z - 0.8, 0.25, 0xf08a4b)
    }
  }
  // Shell fragments and pebbles stay below the playable lower depth.
  for (let i = 0; i < grupos * 3; i++) {
    const f = (Math.sin(i * 127.1 + 7) * 43758.5453) % 1
    const x = limites.xMin + Math.abs(f) * (limites.xMax - limites.xMin)
    const z = limites.zMin + ((i * 0.61803398875) % 1) * largo
    agregar(x, limites.suelo - 0.1, z, 0.12 + (i % 3) * 0.06, i % 4 ? 0xb9a077 : 0x8fe3f2)
  }
  for (const vegetal of [false, true]) {
    const lista = cubos.filter((c) => c.vegetal === vegetal)
    const material = sinContorno(new THREE.MeshLambertMaterial())
    if (vegetal) {
      material.onBeforeCompile = (shader) => {
        shader.uniforms.uDioramaTime = tiempo
        shader.vertexShader = 'uniform float uDioramaTime;\n' + shader.vertexShader.replace('#include <begin_vertex>',
          '#include <begin_vertex>\ntransformed.x += sin(uDioramaTime * 0.45 + instanceMatrix[3].z * 0.7) * 0.12;')
      }
      material.customProgramCacheKey = () => 'diorama-kelp-v1'
    }
    const malla = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material, lista.length)
    const matriz = new THREE.Matrix4(), color = new THREE.Color()
    lista.forEach((c, i) => {
      matriz.makeScale(c.s, c.s, c.s).setPosition(c.x, c.y, c.z)
      malla.setMatrixAt(i, matriz)
      malla.setColorAt(i, color.setHex(c.color))
    })
    malla.instanceMatrix.needsUpdate = true
    if (malla.instanceColor) malla.instanceColor.needsUpdate = true
    malla.computeBoundingSphere()
    if (malla.boundingSphere) malla.boundingSphere.radius += 0.2
    escena.add(malla)
  }
  // Light shafts: a single instanced batch, no shadows or post-processing.
  const rayos = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1),
    sinContorno(new THREE.MeshBasicMaterial({ color: 0x8fe3f2, transparent: true,
      opacity: 0.025, blending: THREE.AdditiveBlending, depthWrite: false })), 12)
  const rayoMatriz = new THREE.Matrix4()
  for (let i = 0; i < 12; i++) {
    rayoMatriz.makeScale(0.7 + (i % 3) * 0.3, 10, 0.7)
      .setPosition(limites.xMin - 2, limites.suelo + 7, limites.zMin + (i + 0.5) / 12 * largo)
    rayos.setMatrixAt(i, rayoMatriz)
  }
  rayos.instanceMatrix.needsUpdate = true
  rayos.computeBoundingSphere()
  escena.add(rayos)
  // Two particle batches. Vertex motion happens on the GPU; no per-frame buffer uploads.
  for (const burbujas of [false, true]) {
    const n = Math.min(burbujas ? 120 : 600, grupos * (burbujas ? 3 : 12))
    const posiciones = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      posiciones.set([
        limites.xMin + ((i * 0.754877666) % 1) * (limites.xMax - limites.xMin),
        ((i * 0.569840296) % 1) * 11,
        limites.zMin + ((i * 0.618033989) % 1) * largo,
      ], i * 3)
    }
    const geometria = new THREE.BufferGeometry()
    geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3))
    const material = sinContorno(new THREE.PointsMaterial({
      color: burbujas ? 0x8fe3f2 : 0xc0e2de, size: burbujas ? 0.09 : 0.035,
      transparent: true, opacity: burbujas ? 0.38 : 0.42, depthWrite: false,
    }))
    material.onBeforeCompile = (shader) => {
      shader.uniforms.uDioramaTime = tiempo
      shader.vertexShader = 'uniform float uDioramaTime;\n' + shader.vertexShader.replace('#include <begin_vertex>',
        `#include <begin_vertex>\ntransformed.y = ${limites.suelo.toFixed(3)} + mod(position.y + uDioramaTime * ${burbujas ? '0.24' : '0.055'}, 11.0);`)
      shader.fragmentShader = shader.fragmentShader.replace('#include <clipping_planes_fragment>',
        '#include <clipping_planes_fragment>\nfloat d = length(gl_PointCoord - vec2(0.5));\nif (d > 0.48) discard;\n' +
        (burbujas ? 'if (d < 0.28) discard;\n' : ''))
    }
    material.customProgramCacheKey = () => `diorama-${burbujas ? 'bubbles' : 'snow'}-${limites.suelo}`
    const puntos = new THREE.Points(geometria, material)
    // Shader-displaced particles need a bound including their full vertical path.
    geometria.boundingBox = new THREE.Box3(
      new THREE.Vector3(limites.xMin, limites.suelo, limites.zMin),
      new THREE.Vector3(limites.xMax, limites.suelo + 11, limites.zMax))
    geometria.boundingSphere = geometria.boundingBox.getBoundingSphere(new THREE.Sphere())
    escena.add(puntos)
  }
  return (t) => { tiempo.value = reducido.matches ? 0 : t }
}
