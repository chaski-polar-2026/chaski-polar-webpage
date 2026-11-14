/* Escena de Kiri, el krill: fondo antártico bajo el hielo. Kiri come manchas de fitoplancton
   y esquiva a los pingüinos. Es la escena con la que se prueba la base del juego. */
import * as THREE from "three";
import { crearSeguidor } from "../motor/camara";
import type { Entrada } from "../motor/entrada";
import { azar, type Escena, type Motor } from "../motor/escena";
import { crearPersonaje, type Personaje } from "../motor/personaje";
import { dibujarFito, dibujarKiri, dibujarPinguino } from "../personajes/antartida";
import { sonar } from "../motor/sonido";
import { sprite } from "../personajes/sprites";
import { crearFondoKiriVoxel, crearPersonajeVoxel } from "../motor/voxel";

const ALTURA_NADO = 4;
const LIMITE = 28;
const VELOCIDAD = 7;
// Persecución original: 9 unidades/s. Se reduce un 25 % sin cambiar la ronda ni las colisiones.
const VELOCIDAD_PERSECUCION_PINGUINO = 6.75;

export interface AvisosKiri {
  comio(total: number): void;
  golpe(): void;
}

interface Pinguino { p: Personaje; voxel: THREE.InstancedMesh; ang: number; estado: "ronda" | "ataque"; dur: number }

/** Crea la escena. "pausa" devuelve true mientras hay un diálogo abierto */
export function escenaKiri(entrada: Entrada, avisos: AvisosKiri, pausa: () => boolean): (motor: Motor) => Escena {
  return (motor) => {
    const { escena, camara, renderer } = motor;
    escena.background = new THREE.Color(0x0d4468);
    escena.fog = new THREE.Fog(0x0d4468, 12, 48);
    escena.add(new THREE.HemisphereLight(0xcfeaff, 0x1b3550, 1));
    const sol = new THREE.DirectionalLight(0xfff4e0, 2);
    sol.position.set(14, 30, 8);
    escena.add(sol);
    const { rayos, nieve } = crearFondoKiriVoxel(escena);
    const dibujoKiri = sprite("kiri", dibujarKiri);
    const kiri = crearPersonaje(escena, dibujoKiri, { ancho: 2.6, alto: 2.6, suelo: 0 });
    kiri.sprite.visible = false;
    const kiriVoxel = crearPersonajeVoxel(escena, dibujoKiri, 0.08, 2);
    kiri.posicion.set(0, ALTURA_NADO, 0);
    const seguidor = crearSeguidor(camara, renderer.domElement, kiri.posicion, { libre: true });

    const dibujoPinguino = sprite("pinguino", dibujarPinguino), dibujoFito = sprite("fito", dibujarFito);
    const pinguinos: Pinguino[] = Array.from({ length: 3 }, (_, i) => {
      const p = crearPersonaje(escena, dibujoPinguino, { ancho: 2.4, alto: 2.4, suelo: 0 });
      p.sprite.visible = false;
      return { p, voxel: crearPersonajeVoxel(escena, dibujoPinguino, 0.035, 1), ang: i * 2.1, estado: "ronda" as const, dur: 0 };
    });
    const colocar = (f: Personaje) => { const a = azar(0, Math.PI * 2), d = azar(3, 22); f.posicion.set(Math.cos(a) * d, azar(2, 9), Math.sin(a) * d); };
    const fitos = Array.from({ length: 14 }, () => {
      const f = crearPersonaje(escena, dibujoFito, { ancho: 1.4, alto: 1.4, suelo: 0 });
      f.sprite.visible = false;
      const voxel = crearPersonajeVoxel(escena, dibujoFito, 0.025, 1);
      colocar(f);
      return { f, voxel, fase: azar(0, 6) };
    });

    const vel = new THREE.Vector3(), mov = new THREE.Vector3(), quieto = new THREE.Vector3(), hacia = new THREE.Vector3();
    let comidos = 0, aturdido = 0;

    return {
      actualizar(dt, t) {
        const detenido = pausa();
        const d = detenido ? { x: 0, y: 0 } : entrada.direccion();
        mov.set(0, 0, 0).addScaledVector(seguidor.adelante, d.y).addScaledVector(seguidor.derecha, d.x);
        if (mov.lengthSq() > 1) mov.normalize();
        mov.multiplyScalar(aturdido > 0 ? 2 : VELOCIDAD);
        vel.lerp(mov, 1 - Math.pow(0.002, dt));
        kiri.posicion.addScaledVector(vel, dt);
        if (!detenido) kiri.posicion.y = THREE.MathUtils.clamp(kiri.posicion.y + entrada.vertical() * VELOCIDAD * dt, 1.5, 11);
        const horizontal = Math.hypot(kiri.posicion.x, kiri.posicion.z);
        if (horizontal > LIMITE) { kiri.posicion.x *= LIMITE / horizontal; kiri.posicion.z *= LIMITE / horizontal; }
        seguidor.seguir(kiri.posicion);
        kiri.animar(t, vel, seguidor.derecha, VELOCIDAD);
        kiriVoxel.position.copy(kiri.posicion);
        kiriVoxel.rotation.y = vel.x < 0 ? Math.PI : 0;
        kiri.parpadear(aturdido > 0, t);
        aturdido = Math.max(0, aturdido - dt);

        for (const { f, voxel, fase } of fitos) {
          f.posicion.y += Math.sin(t * 1.5 + fase) * 0.004;
          voxel.position.copy(f.posicion);
          f.sprite.material.rotation = Math.sin(t + fase) * 0.2;
          f.animar(t, quieto, seguidor.derecha, 1);
          if (!detenido && f.posicion.distanceTo(kiri.posicion) < 1.6) { sonar("comer"); comidos++; avisos.comio(comidos); colocar(f); }
        }
        // pingüinos: dan vueltas y de vez en cuando se lanzan sobre Kiri
        for (const u of pinguinos) {
          if (u.estado === "ronda" || detenido) {
            u.ang += dt * 0.5;
            u.p.posicion.set(Math.cos(u.ang) * 14, 9 + Math.sin(t + u.ang) * 0.6, Math.sin(u.ang) * 14);
            if (!detenido && Math.random() < dt / 6) { u.estado = "ataque"; u.dur = 0; }
          } else {
            u.dur += dt;
            hacia.subVectors(kiri.posicion, u.p.posicion).normalize();
            u.p.posicion.addScaledVector(hacia, dt * VELOCIDAD_PERSECUCION_PINGUINO);
            if (aturdido <= 0 && u.p.posicion.distanceTo(kiri.posicion) < 1.5) {
              aturdido = 1.5; comidos = Math.max(0, comidos - 2); sonar("golpe");
              avisos.comio(comidos); avisos.golpe(); u.estado = "ronda";
            }
            if (u.dur > 3) u.estado = "ronda";
          }
          u.p.animar(t, quieto, seguidor.derecha, 1);
          u.p.sprite.material.rotation = Math.sin(t * 6 + u.ang) * 0.1;
          u.voxel.position.copy(u.p.posicion);
        }

        const arr = nieve.geometry.getAttribute("position");
        for (let i = 0; i < arr.count; i++) { let y = arr.getY(i) - dt * 0.4; if (y < 0) y = 14; arr.setY(i, y); }
        arr.needsUpdate = true;
        rayos.forEach((r, i) => { (r.material as THREE.MeshBasicMaterial).opacity = 0.06 + 0.02 * Math.sin(t * 0.8 + i); });
      },
      destruir: () => seguidor.destruir(),
    };
  };
}
