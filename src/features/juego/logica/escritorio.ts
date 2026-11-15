/* Escritorio de fin de año, al estilo de Papers, Please: el jugador es analista del mar y revisa papeles.
   Todo sale de los datos reales del año jugado: el reporte satelital (comida en la costa central y
   Niño 1+2 por mes), la solicitud de la flota, notas de prensa con cifras (algunas falsas) y afirmaciones
   de causa. Cada expediente tiene una respuesta correcta que se puede comprobar cruzando los papeles. */
import type { Mar } from "../motor/mar";
import { anioDelMar, diagnosticar, type AnioDelMar } from "./cardumen";

const MESES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export interface FilaReporte { mes: string; comida: number | null; nino: number | null }

export type Decision = "si" | "no";
export interface Expediente {
  id: string;
  tipo: "solicitud" | "prensa" | "causa";
  remitente: string;
  titulo: string;
  cuerpo: string;
  /** texto de cada sello */
  sellos: Record<Decision, string>;
  correcta: Decision;
  /** qué se le explica al jugador si se equivoca (la citación) */
  explicacion: string;
}

export type Bandeja = "nino" | "normal" | "variabilidad" | "tendencia";
export const BANDEJAS: { id: Bandeja; texto: string }[] = [
  { id: "nino", texto: "El Niño" },
  { id: "normal", texto: "Normal year" },
  { id: "variabilidad", texto: "Variability" },
  { id: "tendencia", texto: "Trend" },
];

export interface Turno {
  anio: number;
  reporte: FilaReporte[];
  resumen: AnioDelMar;
  expedientes: Expediente[];
  bandejaCorrecta: Bandeja;
  /** reglas del manual */
  reglas: string[];
  /** cuántas reglas se marcan como nuevas (el primer año, todas) */
  reglasNuevas: number;
}

/** Azar reproducible por año: el mismo año siempre trae los mismos papeles */
function azarDe(semilla: number) {
  let s = semilla >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
}

const pct = (x: number) => `${Math.round(x * 100)} %`;
const signo = (x: number) => `${x > 0 ? "+" : x < 0 ? "−" : ""}${Math.abs(x).toFixed(1)} °C`;

const REGLAS = [
  "Every figure in a file must match the satellite report (±10 points allowed). Reject figures that do not match.",
  "Fishing season: if food on the central coast averages below 50% from April through July, deny it (fishing ban).",
  "El Niño: the game identifies El Niño if the Niño 1+2 index reaches +1 °C or more and food falls.",
  "Two things happening together do not prove causation. No data in the report show that Antarctica causes changes in Peru.",
  "A trend requires many years of data. Since 1998 chlorophyll off Peru shows no significant trends.",
];

export function crearTurno(mar: Mar, anio: number, meses: number, generacion: number): Turno {
  const azar = azarDe(anio * 7919);
  const reporte: FilaReporte[] = [];
  for (let m = 1; m <= meses; m++) {
    const i = mar.indice(anio, m);
    if (i < 0) continue;
    const ch = mar.estado("chimbote", i), ca = mar.estado("callao", i);
    reporte.push({ mes: MESES[m - 1]!, comida: (ch.alimento + ca.alimento) / 2, nino: ch.nino12 });
  }
  const resumen = anioDelMar(mar, anio, meses);
  const diag = diagnosticar(resumen);
  const expedientes: Expediente[] = [];

  // 1. Solicitud de la flota: abrir la temporada de abril a julio
  const temporada = reporte.slice(3, 7).map((f) => f.comida).filter((x): x is number => x != null);
  if (temporada.length) {
    const prom = temporada.reduce((a, b) => a + b, 0) / temporada.length;
    expedientes.push({
      id: "flota", tipo: "solicitud", remitente: "North-Central Fleet",
      titulo: `Season request · April to July ${anio}`,
      cuerpo: `We request opening the anchoveta fishing season from April to July ${anio}. Our captains say “the sea is as usual”.`,
      sellos: { si: "APPROVED", no: "DENIED" },
      correcta: prom >= 0.5 ? "si" : "no",
      explicacion: `From April to July food on the central coast averaged ${pct(prom)}. ${prom >= 0.5 ? "That was sufficient: no fishing ban was required." : "Below 50%: a fishing ban was required."}`,
    });
  }

  // 2. Nota de prensa con una cifra: a veces verdadera, a veces inventada
  const conDato = reporte.map((f, k) => ({ ...f, k })).filter((f) => f.comida != null);
  const elegido = conDato.reduce((a, f) => ((f.comida ?? 9) < (a.comida ?? 9) ? f : a), conDato[0]!);
  if (elegido?.comida != null) {
    const real = elegido.comida;
    const falsa = azar() < 0.5;
    const citada = falsa ? (real < 0.6 ? real + 0.45 + azar() * 0.2 : real - 0.4) : real + (azar() - 0.5) * 0.08;
    expedientes.push({
      id: "prensa-cifra", tipo: "prensa", remitente: "El Litoral newspaper",
      titulo: "Press report to verify",
      cuerpo: `“In ${elegido.mes} ${anio}, phytoplankton on the central coast reached ${pct(Math.max(0.05, citada))} of normal,” the report says.`,
      sellos: { si: "SUPPORTED", no: "REJECTED" },
      correcta: falsa ? "no" : "si",
      explicacion: `The satellite report shows ${pct(real)} in ${elegido.mes}. ${falsa ? "The report used a figure that does not match." : "The figure in the report matched."}`,
    });
  }

  // 3. Afirmaciones de causa: una sobre El Niño o una comparación de zonas, y otra que no se puede respaldar
  const zonas = (z: "paita" | "callao") => {
    const v = reporte.map((_, k) => { const i = mar.indice(anio, k + 1); return i >= 0 ? mar.estado(z, i).alimento : null; }).filter((x): x is number => x != null);
    return v.reduce((a, b) => a + b, 0) / Math.max(1, v.length);
  };
  if (azar() < 0.5) {
    expedientes.push({
      id: "causa-nino", tipo: "causa", remitente: "OceanData consultants",
      titulo: "Technical report",
      cuerpo: `“The phytoplankton decline off Chimbote in ${anio} is associated with El Niño.”`,
      sellos: { si: "SUPPORTED", no: "NOT PROVEN" },
      correcta: diag === "nino" ? "si" : "no",
      explicacion: diag === "nino" ? `Niño 1+2 reached ${signo(resumen.ninoMax ?? 0)} and food fell: the report supports this.` : `Niño 1+2 did not exceed +1 °C alongside falling food: the report does not support this.`,
    });
  } else {
    const p = zonas("paita"), c = zonas("callao");
    expedientes.push({
      id: "causa-zonas", tipo: "causa", remitente: "Artisanal fishers’ association",
      titulo: "Letter",
      cuerpo: `“Paita did better than Callao this year: there was more food for anchoveta there.”`,
      sellos: { si: "SUPPORTED", no: "NOT PROVEN" },
      correcta: p > c ? "si" : "no",
      explicacion: `Average food this year: Paita ${pct(p)}, Callao ${pct(c)}.`,
    });
  }
  const trampa = azar() < 0.5
    ? { remitente: "Mar Abierto magazine", cuerpo: `“Antarctic ice melt caused the anchoveta decline in ${anio}.”`, explicacion: "Nothing in the report shows that Antarctica causes changes in Peru. Coincidence does not prove causation." }
    : { remitente: "Mar y Pesca radio show", cuerpo: "“The Peruvian sea gets a little poorer each year: it is a trend.”", explicacion: "One year does not show a trend; since 1998 chlorophyll off Peru has no significant trend." };
  expedientes.push({ id: "trampa", tipo: "prensa", titulo: "Public claim", sellos: { si: "SUPPORTED", no: "NOT PROVEN" }, correcta: "no", ...trampa });

  // los papeles llegan desordenados
  for (let i = expedientes.length - 1; i > 0; i--) { const j = Math.floor(azar() * (i + 1)); [expedientes[i], expedientes[j]] = [expedientes[j]!, expedientes[i]!]; }

  return {
    anio, reporte, resumen, expedientes,
    bandejaCorrecta: diag === "nino" ? "nino" : diag === "suerte" ? "variabilidad" : "normal",
    reglas: REGLAS,
    reglasNuevas: generacion === 0 ? REGLAS.length : 0,
  };
}

/** Cada decisión correcta protege al cardumen siguiente; cada error lo perjudica (efecto ilustrativo) */
export const EFECTO_ACIERTO = 0.04;
export const EFECTO_ERROR = -0.05;
