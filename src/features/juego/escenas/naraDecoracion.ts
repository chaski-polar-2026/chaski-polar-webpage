/* Decorado puramente visual para la escena de Nara: espuma, hielo a la deriva, cardúmenes y krill,
   manchas de fitoplancton y algas en la zona de afloramiento, aves, barcos, playas, montañas y bosques
   en la costa. No interviene en la jugabilidad: solo añade mallas instanciadas y animaciones baratas. */
import * as THREE from "three";
import { sinContorno } from "../motor/escena";

const AGUA = 0x0f3352;
const K = 2; // unidades por grado (igual que nara.ts)
const aX = (lon: number) => (lon + 80) * K;
const aZ = (lat: number) => -(lat + 35) * K;
const aLon = (x: number) => x / K - 80;
const aLat = (z: number) => -z / K - 35;
const V = { lonO: -105, latN: 15, lonE: -30, latS: -70 };
const RECORRIDO = { lonO: -105, latN: 0, lonE: -55, latS: -70 };

const PIEDRA = [0x5b6b78, 0x6b7d8c, 0x4d5d6b, 0x76818a];
const ARENA = [0xc9b48a, 0xd6c299, 0xbfa97f];
const HIELO = [0xeaf6fd, 0xd8eef8, 0xffffff, 0xc4e4f2];
const VERDE = [0x4f8a4b, 0x5f9b55, 0x3f7a45, 0x7aa64f];
const elegir = (c: number[], i: number) => c[Math.abs(Math.floor(i)) % c.length]!;

function semilla(s: number) {
  return () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/** Acumula cajas (posición, tamaño, color) y las vuelca en un solo InstancedMesh. */
class Lote {
  datos: number[] = [];
  colores: number[] = [];
  caja(x: number, y: number, z: number, sx: number, sy: number, sz: number, color: number) {
    const t = fundir(x, z);
    this.datos.push(x, y, z, sx, sy, sz);
    this.colores.push(t > 0 ? new THREE.Color(color).lerp(new THREE.Color(AGUA), t).getHex() : color);
  }
  get n() { return this.colores.length; }
  construir(escena: THREE.Scene, material?: THREE.Material): THREE.InstancedMesh | null {
    if (!this.n) return null;
    const m = new THREE.InstancedMesh(UNIDAD, material ?? sinContorno(new THREE.MeshLambertMaterial()), this.n);
    const mat = new THREE.Matrix4(), c = new THREE.Color(), q = new THREE.Quaternion();
    for (let i = 0; i < this.n; i++) {
      const d = this.datos;
      mat.compose(new THREE.Vector3(d[i * 6], d[i * 6 + 1], d[i * 6 + 2]), q, new THREE.Vector3(d[i * 6 + 3], d[i * 6 + 4], d[i * 6 + 5]));
      m.setMatrixAt(i, mat);
      m.setColorAt(i, c.setHex(this.colores[i]!));
    }
    m.instanceMatrix.needsUpdate = true;
    m.instanceColor!.needsUpdate = true;
    m.computeBoundingSphere();
    m.frustumCulled = false;
    escena.add(m);
    return m;
  }
}
const UNIDAD = new THREE.BoxGeometry(1, 1, 1);

// los bordes del mapa se funden con el color del agua: 0 dentro, hasta 0.9 lejos del borde
const X0 = aX(V.lonO), X1 = aX(V.lonE), Z0 = aZ(V.latN), Z1 = aZ(V.latS);
function fundir(x: number, z: number): number {
  const dx = Math.max(X0 - x, x - X1), dz = Math.max(Z0 - z, z - Z1);
  const d = Math.max(dx, dz); // distancia con signo al borde del mapa
  return THREE.MathUtils.smoothstep(d, -8, 40) * 0.9;
}

export interface DecoradoNara { animar(dt: number, t: number): void }

export function crearDecoradoNara(escena: THREE.Scene, esTierra: (lat: number, lon: number) => boolean, listo: () => boolean): DecoradoNara {
  const reducido = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rnd = semilla(20260);
  const animadores: Array<(dt: number, t: number) => void> = [];
  let construido = false;

  const dentroV = (lat: number, lon: number) => lon >= V.lonO && lon <= V.lonE && lat <= V.latN && lat >= V.latS;
  const dentroRec = (lat: number, lon: number) => lon >= RECORRIDO.lonO && lon < RECORRIDO.lonE && lat <= RECORRIDO.latN && lat > RECORRIDO.latS;
  /** agua segura: dentro del recorrido según la máscara; fuera del mapa, fondo de agua; entre ambos, desconocido (no se usa) */
  const agua = (x: number, z: number) => { const lat = aLat(z), lon = aLon(x); return dentroRec(lat, lon) ? !esTierra(lat, lon) : !dentroV(lat, lon); };
  const tierraSegura = (x: number, z: number) => { const lat = aLat(z), lon = aLon(x); return dentroRec(lat, lon) && esTierra(lat, lon); };
  const cercaDeCosta = (x: number, z: number, r: number) => [[r, 0], [-r, 0], [0, r], [0, -r]].some(([a, b]) => tierraSegura(x + a!, z + b!));

  // marco que funde los bordes del mapa con el agua
  {
    const rings = [{ d: 12, a: 0 }, { d: 0, a: 1 }, { d: -90, a: 1 }]; // d: hacia dentro del mapa (+) o fuera (−)
    const pos: number[] = [], col: number[] = [], idx: number[] = [], c = new THREE.Color(AGUA);
    rings.forEach(({ d, a }) => {
      for (const [x, z] of [[X0 + d, Z0 + d], [X1 - d, Z0 + d], [X1 - d, Z1 - d], [X0 + d, Z1 - d]] as const) { pos.push(x, 0.3, z); col.push(c.r, c.g, c.b, a); }
    });
    for (let r = 0; r < 2; r++) for (let k = 0; k < 4; k++) {
      const a = r * 4 + k, b = r * 4 + (k + 1) % 4, a2 = a + 4, b2 = b + 4;
      idx.push(a, b, a2, b, b2, a2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 4));
    g.setIndex(idx);
    const marco = new THREE.Mesh(g, sinContorno(new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, fog: false, side: THREE.DoubleSide })));
    marco.renderOrder = 1;
    escena.add(marco);
  }

  // espuma: motas planas claras sobre el agua, hasta el margen exterior
  {
    const l = new Lote();
    for (let i = 0; i < 3200; i++) {
      const x = X0 - 50 + rnd() * (X1 - X0 + 100), z = Z0 - 40 + rnd() * (Z1 - Z0 + 80);
      if (!agua(x, z) && !(dentroV(aLat(z), aLon(x)) && !dentroRec(aLat(z), aLon(x)))) continue;
      const w = 0.25 + rnd() * 0.5;
      l.caja(x, 0.06, z, w, 0.03, 0.1 + rnd() * 0.12, i % 5 ? 0x6fa6c7 : 0xcfeaf5);
    }
    l.construir(escena);
  }

  const construir = () => {
    // hielo a la deriva en el sur y en el margen exterior
    {
      const l = new Lote();
      for (let i = 0; i < 90; i++) {
        const x = X0 - 40 + rnd() * (X1 - X0 + 80), z = (i % 3 ? 38 : -40) + rnd() * (i % 3 ? 62 : 70) + (i % 3 ? 0 : 0);
        const lat = aLat(z);
        const sur = lat < -52;
        if (!sur && dentroV(lat, aLon(x))) continue;
        if (!agua(x, z) || (dentroRec(lat, aLon(x)) && cercaDeCosta(x, z, 3))) continue;
        const n = 3 + Math.floor(rnd() * 4), w0 = 0.8 + rnd() * 1.6;
        for (let k = 0; k < n; k++) {
          const w = w0 * (1 - k * 0.2) * (0.8 + rnd() * 0.4);
          l.caja(x + (rnd() - 0.5) * 0.4, 0.12 + k * 0.28 + 0.14, z + (rnd() - 0.5) * 0.4, w, 0.28, w * (0.7 + rnd() * 0.5), k === 0 ? 0xb4dcef : elegir(HIELO, i + k));
        }
      }
      l.construir(escena);
    }

    // fitoplancton (afloramiento) y balsas de algas junto a la costa de Chile y el Perú
    {
      const l = new Lote();
      for (let i = 0, hechos = 0; i < 4000 && hechos < 60; i++) {
        const x = X0 + rnd() * (X1 - X0), z = aZ(-5 - rnd() * 42) + 0;
        if (!agua(x, z) || !cercaDeCosta(x, z, 5 + rnd() * 5)) continue;
        hechos++;
        const alga = hechos % 2 === 0;
        for (let k = 0; k < 14; k++) {
          const s = 0.2 + rnd() * 0.3;
          l.caja(x + (rnd() - 0.5) * 3, 0.08 + (alga ? 0.02 : 0), z + (rnd() - 0.5) * 3, s, 0.04, s, alga ? elegir([0x5a6b2d, 0x3f5a2a, 0x6b6a2f], k) : elegir([0x2f9c88, 0x3fb59a, 0x2a8a7f], k));
        }
      }
      l.construir(escena);
    }

    // costa: franja de arena, montañas escalonadas, vegetación, mogotes de hielo
    {
      const l = new Lote();
      for (let x = X0 + 1; x < aX(RECORRIDO.lonE); x += 0.5) for (let z = aZ(RECORRIDO.latN) + 1; z < aZ(RECORRIDO.latS); z += 0.5) {
        const lat = aLat(z);
        if (lat < -57 || !tierraSegura(x, z) || !cercaDeCosta(x, z, 0.7)) continue;
        l.caja(x, 0.29, z, 0.5, 0.06, 0.5, elegir(ARENA, x * 3 + z * 5));
      }
      let montes = 0, arboles = 0, hielos = 0;
      for (let i = 0; i < 9000 && (montes < 55 || arboles < 700 || hielos < 45); i++) {
        const x = X0 + rnd() * (aX(RECORRIDO.lonE) - X0), z = aZ(RECORRIDO.latN) + rnd() * (aZ(RECORRIDO.latS) - aZ(RECORRIDO.latN));
        if (!tierraSegura(x, z)) continue;
        const lat = aLat(z), lon = aLon(x);
        if (lat < -58) {
          if (hielos++ >= 45) continue;
          const w = 0.8 + rnd() * 1.4;
          l.caja(x, 0.26 + 0.14, z, w, 0.28, w, 0xeaf6fd); l.caja(x, 0.26 + 0.42, z, w * 0.6, 0.28, w * 0.6, 0xffffff);
          continue;
        }
        const interior = tierraSegura(x + 2.5, z) && tierraSegura(x + 5, z);
        if (interior && lon > -80 && lat > -56 && montes < 55) {
          montes++;
          const niveles = 4 + Math.floor(rnd() * 3), base = 1.0 + rnd() * 1.3;
          for (let k = 0; k < niveles; k++) {
            const w = base * (1 - k / (niveles + 0.5));
            l.caja(x, 0.26 + 0.15 + k * 0.3, z, w, 0.3, w, k >= niveles - 2 ? 0xf4fafd : elegir(PIEDRA, k + montes));
          }
        } else if (!interior && arboles < 700 && lat > -56) {
          arboles++;
          if (i % 4 === 0) { l.caja(x, 0.26 + 0.16, z, 0.32, 0.32, 0.32, elegir(VERDE, i)); }
          else { l.caja(x, 0.26 + 0.1, z, 0.1, 0.2, 0.1, 0x6b4a2f); l.caja(x, 0.26 + 0.34, z, 0.34, 0.3, 0.34, elegir(VERDE, i)); }
        }
      }
      l.construir(escena);
    }

    // barcos pesqueros anclados cerca de la costa (silueta voxel; ligeras olas con el tiempo)
    {
      const l = new Lote();
      const barcos: Array<[number, number]> = [];
      for (let i = 0; i < 3000 && barcos.length < 16; i++) {
        const x = X0 + rnd() * (aX(RECORRIDO.lonE) - X0), z = aZ(-5 - rnd() * 40);
        if (!agua(x, z) || !cercaDeCosta(x, z, 2.2) || barcos.some(([bx, bz]) => Math.hypot(bx - x, bz - z) < 8)) continue;
        barcos.push([x, z]);
        const col = [0xc8553d, 0x3f6ea8, 0xe0b04a, 0x5f9b55][barcos.length % 4]!;
        l.caja(x, 0.16, z, 1.1, 0.2, 0.4, col);
        l.caja(x + 0.55, 0.2, z, 0.2, 0.14, 0.26, col);
        l.caja(x - 0.15, 0.4, z, 0.36, 0.24, 0.3, 0xf4f1e8);
        l.caja(x + 0.15, 0.66, z, 0.05, 0.6, 0.05, 0x4a3b2c);
        l.caja(x - 0.55, 0.3, z, 0.08, 0.2, 0.3, 0x8b6f4a);
      }
      l.construir(escena);
    }

    // cardúmenes (anchoveta) y enjambres de krill, animados
    const bandada = (n: number, f: (i: number) => { hx: number; hz: number; r: number; y: number } | null, opciones: { cuerpo: THREE.Vector3; cola: boolean; colores: number[]; dispersion: number; velocidad: number }) => {
      const grupos = Array.from({ length: n }, (_, i) => f(i)).filter((g): g is NonNullable<typeof g> => g !== null);
      const porGrupo = 14, total = grupos.length * porGrupo;
      if (!total) return;
      const material = sinContorno(new THREE.MeshLambertMaterial());
      const cuerpos = new THREE.InstancedMesh(UNIDAD, material, total), colas = opciones.cola ? new THREE.InstancedMesh(UNIDAD, material, total) : null;
      const offs = Array.from({ length: total }, () => new THREE.Vector3((rnd() - 0.5) * opciones.dispersion * 1.4, (rnd() - 0.5) * 0.5, (rnd() - 0.5) * opciones.dispersion));
      const c = new THREE.Color();
      for (let i = 0; i < total; i++) {
        c.setHex(elegir(opciones.colores, i)); const t = fundir(grupos[Math.floor(i / porGrupo)]!.hx, grupos[Math.floor(i / porGrupo)]!.hz); if (t > 0) c.lerp(new THREE.Color(AGUA), t);
        cuerpos.setColorAt(i, c); colas?.setColorAt(i, c);
      }
      cuerpos.instanceColor!.needsUpdate = true; if (colas) colas.instanceColor!.needsUpdate = true;
      cuerpos.frustumCulled = false; if (colas) colas.frustumCulled = false;
      escena.add(cuerpos); if (colas) escena.add(colas);
      const mat = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), e = new THREE.Euler(), s = new THREE.Vector3(), eje = new THREE.Vector3(0, 1, 0);
      const poner = (t: number) => {
        for (let gi = 0; gi < grupos.length; gi++) {
          const g = grupos[gi]!, ang = t * opciones.velocidad / g.r + gi * 1.7, cx = g.hx + Math.cos(ang) * g.r, cz = g.hz + Math.sin(ang) * g.r;
          const rumbo = Math.atan2(Math.cos(ang), -Math.sin(ang)); // tangente del círculo
          q.setFromAxisAngle(eje, -rumbo);
          for (let j = 0; j < porGrupo; j++) {
            const i = gi * porGrupo + j, o = offs[i]!;
            const ox = o.x * Math.cos(-rumbo) + o.z * Math.sin(-rumbo), oz = -o.x * Math.sin(-rumbo) + o.z * Math.cos(-rumbo);
            p.set(cx + ox, g.y + o.y + Math.sin(t * 2.4 + i) * 0.04, cz + oz);
            s.copy(opciones.cuerpo);
            mat.compose(p, q, s); cuerpos.setMatrixAt(i, mat);
            if (colas) {
              const balanceo = Math.sin(t * 9 + i) * 0.5;
              e.set(0, -rumbo + balanceo, 0);
              const qc = new THREE.Quaternion().setFromEuler(e);
              const largo = opciones.cuerpo.x * 0.6;
              mat.compose(new THREE.Vector3(p.x - Math.cos(rumbo) * largo, p.y, p.z - Math.sin(rumbo) * largo), qc, new THREE.Vector3(0.1, opciones.cuerpo.y * 1.6, 0.05));
              colas.setMatrixAt(i, mat);
            }
          }
        }
        cuerpos.instanceMatrix.needsUpdate = true; if (colas) colas.instanceMatrix.needsUpdate = true;
      };
      poner(0);
      if (!reducido) animadores.push((_dt, t) => poner(t));
    };
    // anchovetas en la corriente de Humboldt y mar abierto
    bandada(34, () => {
      for (let k = 0; k < 40; k++) {
        const hx = X0 - 20 + rnd() * (X1 - X0 + 40), hz = aZ(-4 - rnd() * 52), r = 2 + rnd() * 3;
        if (![[r, 0], [-r, 0], [0, r], [0, -r]].every(([a, b]) => agua(hx + a!, hz + b!)) || !agua(hx, hz)) continue;
        return { hx, hz, r, y: 0.35 + rnd() * 0.5 };
      }
      return null;
    }, { cuerpo: new THREE.Vector3(0.32, 0.13, 0.12), cola: true, colores: [0xc9dbe8, 0x9fc0d6, 0xdde9f1, 0x7fb0cb], dispersion: 1.6, velocidad: 2.2 });
    // krill rosado en aguas antárticas
    bandada(24, () => {
      for (let k = 0; k < 40; k++) {
        const hx = X0 - 20 + rnd() * (X1 - X0 + 40), hz = aZ(-50 - rnd() * 20), r = 1 + rnd() * 2.5;
        if (![[r, 0], [-r, 0], [0, r], [0, -r]].every(([a, b]) => agua(hx + a!, hz + b!)) || !agua(hx, hz)) continue;
        return { hx, hz, r, y: 0.3 + rnd() * 0.4 };
      }
      return null;
    }, { cuerpo: new THREE.Vector3(0.11, 0.08, 0.08), cola: false, colores: [0xff8f6b, 0xf0a08a, 0xffb199], dispersion: 2.4, velocidad: 0.9 });

    // aves marinas que planean sobre la costa
    {
      const n = 12, centros: Array<{ x: number; z: number; r: number; y: number }> = [];
      for (let i = 0; i < 3000 && centros.length < n; i++) {
        const x = X0 + rnd() * (aX(RECORRIDO.lonE) - X0), z = aZ(-6 - rnd() * 48);
        if (agua(x, z) && cercaDeCosta(x, z, 2.5)) centros.push({ x, z, r: 2 + rnd() * 3, y: 3 + rnd() * 1.2 });
      }
      if (centros.length) {
        const alas = new THREE.InstancedMesh(UNIDAD, sinContorno(new THREE.MeshLambertMaterial({ color: 0xf2f4f6 })), centros.length * 2);
        alas.frustumCulled = false;
        escena.add(alas);
        const mat = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), p = new THREE.Vector3(), s = new THREE.Vector3(0.5, 0.05, 0.16);
        const poner = (t: number) => {
          centros.forEach((c, i) => {
            const a = t * 0.5 / c.r * 3 + i * 2, rumbo = Math.atan2(Math.cos(a), -Math.sin(a));
            const aleteo = reducido ? 0.25 : Math.sin(t * 6 + i * 1.3) * 0.5;
            for (const lado of [-1, 1]) {
              e.set(0, -rumbo, lado * aleteo);
              q.setFromEuler(e);
              p.set(c.x + Math.cos(a) * c.r - Math.sin(rumbo) * lado * 0.25 * 0, c.y + aleteo * 0.15, c.z + Math.sin(a) * c.r).add(new THREE.Vector3(0, 0, lado * 0.25).applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -rumbo, 0))));
              mat.compose(p, q, s);
              alas.setMatrixAt(i * 2 + (lado > 0 ? 1 : 0), mat);
            }
          });
          alas.instanceMatrix.needsUpdate = true;
        };
        poner(0);
        if (!reducido) animadores.push((_dt, t) => poner(t));
      }
    }

    // partículas de plancton a la deriva
    {
      const n = 1100, pos = new Float32Array(n * 3);
      const ancho = X1 - X0, largo = Z1 - Z0;
      for (let i = 0; i < n; i++) { pos[i * 3] = X0 + rnd() * ancho; pos[i * 3 + 1] = 0.3 + rnd() * 2.4; pos[i * 3 + 2] = Z0 + rnd() * largo; }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const puntos = new THREE.Points(g, sinContorno(new THREE.PointsMaterial({ color: 0xcfeaf2, size: 0.12, transparent: true, opacity: 0.45, depthWrite: false })));
      puntos.frustumCulled = false;
      escena.add(puntos);
      if (!reducido) animadores.push((dt, t) => {
        const a = g.attributes.position!.array as Float32Array;
        for (let i = 0; i < n; i++) {
          a[i * 3] += (0.12 + Math.sin(t * 0.3 + i) * 0.05) * dt;
          a[i * 3 + 1] += Math.sin(t * 0.7 + i * 1.7) * 0.03 * dt;
          a[i * 3 + 2] += 0.05 * dt;
          if (a[i * 3]! > X1) a[i * 3] = X0;
          if (a[i * 3 + 2]! > Z1) a[i * 3 + 2] = Z0;
        }
        g.attributes.position!.needsUpdate = true;
      });
    }
  };

  return {
    animar(dt, t) {
      if (!construido && listo()) { construido = true; construir(); }
      if (reducido) return;
      for (const a of animadores) a(dt, t);
    },
  };
}
