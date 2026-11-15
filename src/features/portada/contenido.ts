// Textos de cada tramo del descenso. "de" y "a" son el progreso del scroll (0 = arriba, 1 = fondo)
// en el que aparece cada texto. Las cifras provienen de análisis exploratorios con datos satelitales
// (clorofila ESA OC-CCI, temperatura NOAA, índice Niño 1+2 NOAA) para cinco zonas de la costa peruana.

import acierto from '../prediccion/perspectiva_acierto.json'

export interface Boton {
  texto: string;
  accion?: "entrar";
  href?: string;
}

export interface Seccion {
  variante?: 'reto' | 'cifras' | 'metodo';
  de: number;
  a: number;
  principal?: boolean;
  titulo: string;
  texto: string;
  botones?: Boton[];
}

export const SECCIONES: readonly Seccion[] = [
  {
    de: 0, a: 0.03, principal: true,
    titulo: "Chaski Polar",
    texto: "Explore a changing ocean, from satellite to seafloor",
    botones: [{ texto: "Enter the explorer →", accion: "entrar" }, { texto: "Play Cardumen", href: "/juego" }],
  },
  {
    de: 0.04, a: 0.11,
    titulo: "Seen from space",
    texto: "Satellites measure sea temperature and color every day. Chlorophyll, and therefore phytoplankton, is estimated from that color.",
  },
  {
    de: 0.12, a: 0.22, variante: 'reto', titulo: '', texto: '',
  },
  {
    de: 0.24, a: 0.31,
    titulo: "The Peruvian coast",
    texto: "Wind pushes surface water offshore and brings up cold, nutrient-rich water: upwelling. That is why this sea is among the most productive in the world.",
  },
  {
    de: 0.33, a: 0.40,
    titulo: "0–50 m · Phytoplankton",
    texto: "In the central and southern zones, chlorophyll falls by about 18% to 30% per degree of warming. Cooling responses differ by zone: this is an observed pattern, not a forecast.",
  },
  {
    de: 0.42, a: 0.52, variante: 'cifras', titulo: '', texto: '',
  },
  {
    de: 0.54, a: 0.61,
    titulo: "25–45 m · The school",
    texto: "Anchoveta live in this layer and depend on phytoplankton and zooplankton. During El Niño years, their food declines along the central coast.",
  },
  {
    de: 0.63, a: 0.70,
    titulo: "50–150 m · Oxygen minimum zone",
    texto: "In normal years this layer rises and compresses the school toward the surface. During El Niño it sinks: there is more space, but less food.",
  },
  {
    de: 0.72, a: 0.82, variante: 'metodo', titulo: '', texto: '',
  },
  {
    de: 0.85, a: 1.05,
    titulo: "200 m · The seafloor",
    texto: "What changes, where, and how much? Explore the satellite record and test whether a trend is significant.",
    botones: [{ texto: "Enter the explorer →", accion: "entrar" }, { texto: "Play Cardumen", href: "/juego" }],
  },
];

// La propuesta de pesca queda preparada, pero no se muestra sin la decisión del equipo.
export const MOSTRAR_PESCA = false;

export const NAVEGACION_PORTADA = {
  etiqueta: "Homepage sections",
  desafio: "Challenge",
  saltar: "Skip to the challenge",
  volver: "Back to top",
  proyecto: "Chaski Polar",
  lienzo: "Descent from space to the seafloor of the Peruvian sea",
  region: "Peruvian sea",
  capa: "LAYER",
  desplazamiento: "Scroll to descend",
} as const;

export const DESAFIO = {
  titulo: "The question we are answering",
  subtitulo: "NASA SPACE APPS CHALLENGE 2026",
  resumen: "Is the ocean changing, or are we seeing a short-lived shift?",
  retos: "The problem today",
  herramienta: "What our tool does",
  filas: [
    {
      reto: "Earth system trends are hard to verify. A change can look real or disappear depending on the start year you choose.",
      herramienta: "A trend detector. Pick a variable, a region and a period, and see the rate of change and whether it is statistically significant.",
      pesca: false,
    },
    {
      reto: "El Niño can hide or imitate a trend.",
      herramienta: "Check the effect of El Niño, try different start years and remove extreme years. We also show when no significant trend is detected.",
      pesca: false,
    },
    {
      reto: "Small-scale fishers have little clear information about the sea.",
      herramienta: "A fishing alert in plain language.",
      pesca: true,
    },
  ],
  boton: "Open the trend detector",
  enlace: "/research#trends",
} as const;

// Verified counts and altimetry provenance: docs/PORTADA_IMPACTO_FUENTES.md.
// Skill is a retrospective MAE reduction against monthly climatology, not a future guarantee.
const mejorasSST = acierto.results.filter(r => r.variable === 'SST' && r.model === 'nino' && r.horizon_months === 1).map(r => r.mae_improvement * 100)
const rangoSST = `${Math.min(...mejorasSST).toFixed(0)}–${Math.max(...mejorasSST).toFixed(0)}%`

export const HALLAZGOS_PORTADA = {
  titulo: "Our results in numbers",
  tarjetas: [
    { icono: 'nivel', cifra: "+3.0 cm", etiqueta: "Sea level rise per decade", nota: "C3S satellite altimetry, 1998–2025. 95% interval: 2.2–3.7 cm/decade." },
    { icono: 'periodo', cifra: "28 years", etiqueta: "Six variables reviewed", nota: "Core record: 1998–2025; some checks use longer records." },
    { icono: 'pruebas', prefijo: "More than", cifra: "2,300", etiqueta: "Statistical tests run", nota: "Four published test families, including null results." },
    { icono: 'temperatura', cifra: rangoSST, etiqueta: "Less error at one month", nota: "Approx. range across zones vs a normal month in past tests. Outlook for sea temperature only." },
  ],
  limite: "No robust Antarctic link was detected with these data. Past accuracy does not guarantee future results.",
} as const;

export const DATOS_PORTADA = {
  titulo: "Powered by open data",
  tarjetas: [
    { icono: 'satelite', titulo: "Satellites and open records", texto: "ESA OC-CCI with NASA sensors for chlorophyll; NOAA for temperature; Copernicus Marine reanalyses; NSIDC for Antarctic ice." },
    { icono: 'pruebas', titulo: "Tests, not assumptions", texto: "Mann–Kendall checks for a trend. Multiple-test correction limits false positives when many relationships are tested." },
    { icono: 'codigo', titulo: "A traceable analysis", texto: "Source records, code and published tables let us trace and reproduce the results." },
  ],
  fuentes: "Read the sources and methods",
  enlace: "/research#fuentes",
} as const;

// Nombre de la capa según la altura de la cámara (y = 0 es la superficie; 1 unidad = 5 m bajo el agua)
export function nombreCapa(y: number): string {
  if (y > 30) return "Space";
  if (y > 0) return "Surface";
  if (y > -10) return "Light and phytoplankton";
  if (y > -34) return "Oxygen minimum zone";
  return "Seafloor";
}
