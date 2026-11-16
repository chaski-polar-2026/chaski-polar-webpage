/* Sonidos del juego, sintetizados en el navegador con Web Audio (sin archivos ni licencias de terceros).
   El navegador solo permite sonar después de que el jugador toca algo, por eso el audio se crea al primer gesto.
   La preferencia de silencio se recuerda en este navegador. */

import { iniciarMusica } from './musica';

export type Sonido = "comer" | "golpe" | "aviso" | "dialogo" | "division" | "exito" | "boton";

const CLAVE = "juego-silencio";
let ctx: AudioContext | null = null;
let principal: GainNode | null = null;
let ambiente: { detener(): void } | null = null;
let silencio = (() => { try { return localStorage.getItem(CLAVE) === "1"; } catch { return false; } })();
const oyentes = new Set<(s: boolean) => void>();

function contexto(): AudioContext | null {
  if (ctx) return ctx;
  const Clase = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Clase) return null;
  ctx = new Clase();
  principal = ctx.createGain();
  principal.gain.value = silencio ? 0 : 0.5;
  principal.connect(ctx.destination);
  return ctx;
}

/** Llamar en un gesto del jugador (clic, tecla) para habilitar el audio */
export function despertarAudio(): void {
  const c = contexto();
  if (c && c.state === "suspended") void c.resume();
}

export const estaEnSilencio = (): boolean => silencio;

export function alternarSilencio(): boolean {
  silencio = !silencio;
  try { localStorage.setItem(CLAVE, silencio ? "1" : "0"); } catch { /* sin almacenamiento */ }
  if (ctx && principal) principal.gain.setTargetAtTime(silencio ? 0 : 0.5, ctx.currentTime, 0.05);
  for (const f of oyentes) f(silencio);
  return silencio;
}

export function alCambiarSilencio(f: (s: boolean) => void): () => void {
  oyentes.add(f);
  return () => oyentes.delete(f);
}

/** Una nota con envolvente corta */
function nota(frecuencia: number, inicio: number, duracion: number, tipo: OscillatorType = "sine", volumen = 0.3, deslizar?: number): void {
  if (!ctx || !principal) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = tipo;
  o.frequency.setValueAtTime(frecuencia, inicio);
  if (deslizar) o.frequency.exponentialRampToValueAtTime(deslizar, inicio + duracion);
  g.gain.setValueAtTime(0.0001, inicio);
  g.gain.exponentialRampToValueAtTime(volumen, inicio + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);
  o.connect(g).connect(principal);
  o.start(inicio);
  o.stop(inicio + duracion + 0.02);
}

/** Voz de cada personaje: un "soniditos" corto por letra, al estilo de los juegos de rol. Cada uno tiene su timbre y tono */
type Voz = { onda: OscillatorType; base: number; variacion: number; dur: number; vol: number; desliz?: number };
const VOCES: Record<string, Voz> = {
  gaia: { onda: "triangle", base: 330, variacion: 70, dur: 0.06, vol: 0.14 },           // cálida, tono medio
  orbi: { onda: "square", base: 880, variacion: 140, dur: 0.045, vol: 0.06, desliz: 1.15 }, // robótica, aguda
  kiri: { onda: "sine", base: 200, variacion: 50, dur: 0.09, vol: 0.2, desliz: 0.8 },      // grave y redonda
  anchi: { onda: "sine", base: 620, variacion: 90, dur: 0.05, vol: 0.16, desliz: 1.2 },
  lumi: { onda: "triangle", base: 1000, variacion: 120, dur: 0.04, vol: 0.1 },
  nara: { onda: "sawtooth", base: 260, variacion: 40, dur: 0.07, vol: 0.05 },
};

/** Suena el blip de quien habla; se llama al aparecer una letra (se ignoran espacios y puntuación) */
export function hablar(quien: string, letra: string): void {
  if (!/[\p{L}\p{N}]/u.test(letra)) return;
  const c = contexto();
  if (!c || silencio || c.state !== "running") return;
  const v = VOCES[quien] ?? VOCES.gaia;
  const f = v.base + (letra.toLowerCase().charCodeAt(0) % 7) / 6 * v.variacion; // el tono depende de la letra
  nota(f, c.currentTime, v.dur, v.onda, v.vol, v.desliz ? f * v.desliz : undefined);
}

export function sonar(s: Sonido): void {
  const c = contexto();
  if (!c || silencio || c.state !== "running") return;
  const t = c.currentTime;
  switch (s) {
    case "comer": nota(520, t, 0.09, "sine", 0.25, 880); break; // burbuja que sube
    case "golpe": nota(220, t, 0.25, "square", 0.15, 90); break;
    case "aviso": nota(660, t, 0.12, "triangle", 0.2); nota(660, t + 0.16, 0.12, "triangle", 0.2); break;
    case "dialogo": nota(740 + Math.random() * 80, t, 0.05, "triangle", 0.08); break;
    case "division": [523, 659, 784].forEach((f, i) => nota(f, t + i * 0.07, 0.18, "sine", 0.2)); break;
    case "exito": [523, 659, 784, 1047].forEach((f, i) => nota(f, t + i * 0.1, 0.3, "triangle", 0.18)); break;
    case "boton": nota(880, t, 0.04, "sine", 0.12); break;
  }
}

/** Fondo submarino con música de consola y ruido filtrado que respira lentamente */
export function iniciarAmbiente(): void {
  const c = contexto();
  if (!c || !principal || ambiente) return;
  const largo = c.sampleRate * 2, buffer = c.createBuffer(1, largo, c.sampleRate), datos = buffer.getChannelData(0);
  for (let i = 0; i < largo; i++) datos[i] = Math.random() * 2 - 1;
  const ruido = c.createBufferSource();
  ruido.buffer = buffer;
  ruido.loop = true;
  const filtro = c.createBiquadFilter();
  filtro.type = "lowpass";
  filtro.frequency.value = 380;
  const g = c.createGain();
  g.gain.value = 0.05;
  const lfo = c.createOscillator(), profundidad = c.createGain();
  lfo.frequency.value = 0.12;
  profundidad.gain.value = 0.03;
  lfo.connect(profundidad).connect(g.gain);
  ruido.connect(filtro).connect(g).connect(principal);
  ruido.start();
  lfo.start();
  const detenerMusica = iniciarMusica(c, principal);
  ambiente = { detener() { detenerMusica(); ruido.stop(); lfo.stop(); g.disconnect(); } };
}

export function detenerAmbiente(): void {
  ambiente?.detener();
  ambiente = null;
}
