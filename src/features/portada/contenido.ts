// Textos de cada tramo del descenso. "de" y "a" son el progreso del scroll (0 = arriba, 1 = fondo)
// en el que aparece cada texto. Las cifras provienen de análisis exploratorios con datos satelitales
// (clorofila ESA OC-CCI, temperatura NOAA, índice Niño 1+2 NOAA) para cinco zonas de la costa peruana.

export interface Boton {
  texto: string;
  accion?: "entrar";
  href?: string;
}

export interface Seccion {
  de: number;
  a: number;
  principal?: boolean;
  titulo: string;
  texto: string;
  botones?: Boton[];
}

export const SECCIONES: readonly Seccion[] = [
  {
    de: 0, a: 0.05, principal: true,
    titulo: "Chaski Polar",
    texto: "Explore a changing ocean, from satellite to seafloor",
    botones: [{ texto: "Enter the explorer →", accion: "entrar" }, { texto: "Play Cardumen", href: "/juego" }],
  },
  {
    de: 0.08, a: 0.19,
    titulo: "Seen from space",
    texto: "Satellites measure sea temperature and color every day. Chlorophyll, and therefore phytoplankton, is estimated from that color.",
  },
  {
    de: 0.27, a: 0.39,
    titulo: "The Peruvian coast",
    texto: "Wind pushes surface water offshore and brings up cold, nutrient-rich water: upwelling. That is why this sea is among the most productive in the world.",
  },
  {
    de: 0.43, a: 0.54,
    titulo: "0–50 m · Phytoplankton",
    texto: "In the central and southern zones, chlorophyll falls by about 18% to 30% per degree of warming. Cooling responses differ by zone: this is an observed pattern, not a forecast.",
  },
  {
    de: 0.58, a: 0.69,
    titulo: "25–45 m · The school",
    texto: "Anchoveta live in this layer and depend on phytoplankton and zooplankton. During El Niño years, their food declines along the central coast.",
  },
  {
    de: 0.74, a: 0.85,
    titulo: "50–150 m · Oxygen minimum zone",
    texto: "In normal years this layer rises and compresses the school toward the surface. During El Niño it sinks: there is more space, but less food.",
  },
  {
    de: 0.9, a: 1.05,
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
  titulo: "The challenge we are solving",
  subtitulo: "NASA Space Apps Challenge 2026: Be An Earth System Trend Detective!",
  retos: "Current challenges",
  herramienta: "Our tool",
  filas: [
    {
      reto: "Earth system trends are hard to verify. A change can look real or disappear depending on the start year you choose.",
      herramienta: "A trend detector. Pick a variable, a region and a period, and see the rate of change and whether it is statistically significant.",
      pesca: false,
    },
    {
      reto: "El Niño can hide or imitate a trend.",
      herramienta: "Robustness checks. Test several start years and exclude the extreme El Niño years.",
      pesca: false,
    },
    {
      reto: "Small-scale fishers have little clear information about the sea.",
      herramienta: "A fishing alert in plain language.",
      pesca: true,
    },
  ],
  boton: "Open the trend detector",
  enlace: "/explorer#trends",
} as const;

export const HALLAZGOS_PORTADA = {
  titulo: "What we found",
  subtitulo: "Measured results, with their limits.",
  tarjetas: [
    { cifra: "About 1,100", etiqueta: "statistical tests run", nota: "Controlled for El Niño, with false-discovery correction." },
    { cifra: "+2.6 cm", etiqueta: "sea level rise per decade, Peru coast, 1998–2025", nota: "From a reanalysis (model-based), not a direct observation." },
    { cifra: "28 years", etiqueta: "of satellite and reanalysis data (1998–2025)", nota: "Plus longer records for sea-ice extent and sea surface temperature." },
    { cifra: "7 zones", etiqueta: "5 on the Peru coast and 2 in Antarctica", nota: "" },
  ],
  limite: "A result with no significant trend is also a result, and we show it the same way.",
} as const;

export const DATOS_PORTADA = {
  titulo: "Built on open data",
  subtitulo: "Open-source tool, with every source cited.",
  tarjetas: [
    { icono: "series", titulo: "Time series by zone", texto: "Monthly series of chlorophyll, temperature, sea level, oxygen and sea ice, from NASA and other agencies." },
    { icono: "tests", titulo: "Significance tests", texto: "Mann–Kendall test, Sen's slope with a 95% interval, and false-discovery correction." },
    { icono: "checks", titulo: "Robustness checks", texto: "We test whether a trend survives a change of start year and the removal of extreme El Niño years." },
  ],
  fuentes: "Data: NASA (MODIS-Aqua via Giovanni), ESA OC-CCI, NOAA (ERSST v5, Coral Reef Watch), Copernicus Marine, NSIDC.",
} as const;

// Nombre de la capa según la altura de la cámara (y = 0 es la superficie; 1 unidad = 5 m bajo el agua)
export function nombreCapa(y: number): string {
  if (y > 30) return "Space";
  if (y > 0) return "Surface";
  if (y > -10) return "Light and phytoplankton";
  if (y > -30) return "Oxygen minimum zone";
  return "Seafloor";
}
