/* Datos que se pueden mostrar sobre el globo */
import type { ClaveCapa } from "./tipos";
import type { ExplorerSection } from "./estado";
import type { Nutriente } from "./tipos";

interface Comun {
  /** nombre corto para el enlace (#dato=...) */
  clave: string;
  nombre: string;
  corto: string;
  unidad: string;
  dec: number;
  escala: "rampa" | "diverge";
  /** capa del mapa del satélite que la acompaña, si existe */
  mapa?: ClaveCapa;
  /** multiplica el valor guardado para mostrarlo (por ejemplo, metros a centímetros) */
  factor?: number;
  que: string;
  lecturaCambio: string;
  lecturaLimite: string;
  fuente: string;
  periodo: string;
  cobertura: string;
  secciones: readonly ExplorerSection[];
}

/** Serie por zona: "log" compara con el mes normal en proporción, "dif" en diferencia y "directo" ya es una anomalía */
export interface VariableZona extends Comun {
  modo: "log" | "dif" | "directo";
  /** nombre de la serie en series.json */
  id: string;
  /** cuánto se aleja de lo normal para llegar al color más intenso */
  rango: number;
}

/** Índice de la Antártida (extensión del hielo marino) */
export interface VariableIndice extends Comun {
  modo: "indice";
  id: string;
  rango: number;
  indice: "hielo" | "sam";
}

export interface VariableNutriente extends Comun {
  id: string;
  modo: "nutriente";
  nutriente: Nutriente;
  rango: number;
}

export interface VariableRegional extends Comun {
  id: string;
  modo: "regional";
  campo: "oxygen_ml_l";
  rango: number;
}

export type Variable = VariableZona | VariableIndice | VariableNutriente | VariableRegional;

export const VARIABLES: readonly Variable[] = [
  { id: "clorofila_mg_m3", clave: "chlorophyll", nombre: "Phytoplankton (chlorophyll-a)", corto: "phytoplankton", unidad: "mg/m³", dec: 2, modo: "log", rango: 1.2, escala: "rampa", mapa: "clorofila", periodo: "1998–2026", cobertura: "Peru and Antarctica", secciones: ["austral", "humboldt"],
    lecturaCambio: "A rise means more pigment; a fall means less pigment.",
    lecturaLimite: "Chlorophyll is a pigment indicator. It does not measure how many fish there are.",
    que: "The amount of chlorophyll-a pigment estimated from sea color.",
    fuente: "Chlorophyll-a from ESA Ocean Colour CCI v6, combining several satellites including NASA SeaWiFS and MODIS-Aqua. Monthly zone median." },
  { id: "temperatura_superficial_C", clave: "temperature", nombre: "Sea surface temperature", corto: "sea temperature", unidad: "°C", dec: 1, modo: "dif", rango: 3, escala: "diverge", mapa: "temperatura", periodo: "1998–2026", cobertura: "Peru and Antarctica", secciones: ["austral", "humboldt"],
    lecturaCambio: "A rise means warmer surface water; a fall means cooler surface water.",
    lecturaLimite: "This is surface water only. It does not describe conditions at fishing depth.",
    que: "The temperature at the sea surface.",
    fuente: "Sea surface temperature from NOAA Coral Reef Watch v3.1." },
  { id: "turbidez_kd490_m-1", clave: "turbidity", nombre: "Water turbidity (Kd490)", corto: "turbidity", unidad: "m⁻¹", dec: 3, modo: "log", rango: 0.8, escala: "diverge", periodo: "1998–2026", cobertura: "Peru and Antarctica", secciones: [],
    lecturaCambio: "A rise means light fades faster with depth; a fall means it fades more slowly.",
    lecturaLimite: "It describes how fast light fades with depth. It is not a direct measure of pollution or of any single substance.",
    que: "How quickly light fades with depth.",
    fuente: "Kd490 from ESA OC-CCI v6." },
  { id: "viento", clave: "wind", nombre: "Wind over the sea", corto: "wind", unidad: "m/s", dec: 1, modo: "dif", rango: 1.5, escala: "diverge", periodo: "1998–2026 Peru; 1993–2018 Antarctica", cobertura: "Peru and Antarctica", secciones: ["humboldt"],
    lecturaCambio: "A rise means faster wind; a fall means slower wind. Do not compare years across the 2017–2019 break in the Peruvian series.",
    lecturaLimite: "Monthly average speed over the sea, not gusts, waves or sailing conditions. The Peruvian series has a break around 2017–2019.",
    que: "Wind speed over the sea.",
    fuente: "10 m wind over the sea: ERA5 (ECMWF/Copernicus) in Peruvian zones, 1998–2026, sea points only; CCMP v2 in Antarctica, through 2018. Caution: the Peruvian wind series drops and recovers around 2017–2019 in every zone, which looks like a change of source rather than a change in the wind. Do not compare years across that break." },
  { id: "salinidad_psu", clave: "salinity", nombre: "Salinity", corto: "salinity", unidad: "PSU", dec: 2, modo: "dif", rango: 0.35, escala: "diverge", periodo: "2010–2026", cobertura: "Peru and Antarctica", secciones: ["austral", "humboldt"],
    lecturaCambio: "A rise means saltier water; a fall means less salty water.",
    lecturaLimite: "Surface values only. A single value does not identify a water mass.",
    que: "How salty surface water is.",
    fuente: "Surface salinity from the SMOS satellite (since 2010)." },
  { id: "nivel_mar_anomalia_m", clave: "sea level", nombre: "Sea level", corto: "sea level", unidad: "cm", dec: 1, modo: "directo", rango: 0.12, escala: "diverge", factor: 100, periodo: "2012–2018", cobertura: "Peru and Antarctica", secciones: ["humboldt"],
    lecturaCambio: "A rise means a higher sea level relative to the product reference; a fall means a lower level.",
    lecturaLimite: "Anomaly relative to the product reference. It is not tide height or the water depth under a boat.",
    que: "Sea height relative to the reference used by the data source.",
    fuente: "NOAA/NESDIS sea level anomaly (2012–2018)." },
  { id: "hielo", clave: "ice", nombre: "Antarctic sea ice extent", corto: "sea ice", unidad: "million km²", dec: 2, modo: "indice", indice: "hielo", rango: 1.5, escala: "diverge", periodo: "1979–2026", cobertura: "Entire Antarctica", secciones: ["austral"],
    lecturaCambio: "A rise means a larger ice-covered area; a fall means a smaller area.",
    lecturaLimite: "Extent of floating sea ice only. It does not include ice on land.",
    que: "The area covered by sea ice around Antarctica.",
    fuente: "Monthly Antarctic sea ice extent, NSIDC Sea Ice Index G02135." },
  { id: "sam", clave: "sam", nombre: "SAM/AAO index", corto: "SAM/AAO", unidad: "index", dec: 2, modo: "indice", indice: "sam", rango: 2, escala: "diverge", periodo: "1998–2026", cobertura: "Southern atmosphere; not a local measurement", secciones: ["austral"],
    lecturaCambio: "A rise or fall describes a change in the atmospheric index.",
    lecturaLimite: "It describes a pressure pattern around Antarctica. It is not a measure of local weather.",
    que: "An index describing the southern atmosphere.", fuente: "Monthly SAM/AAO index from NOAA PSL." },
  { id: "corriente_m_s", clave: "currents", nombre: "Ocean circulation", corto: "circulation", unidad: "m/s", dec: 2, modo: "directo", rango: 0.2, escala: "rampa", periodo: "1993–2018", cobertura: "Peru and Antarctica", secciones: ["austral"],
    lecturaCambio: "A rise means faster near-surface flow; a fall means slower flow.",
    lecturaLimite: "Monthly average flow near the surface (about 15 m deep). The series ends in January 2018, and that month is incomplete. It is not the current at a given moment.",
    que: "Current speed near the surface, at about 15 m deep.", fuente: "OSCAR current components at about 15 m deep (NASA/ESR). The monthly series ends in January 2018; that month is incomplete." },
  { id: "nitrato", clave: "nitrate", nombre: "Nitrate", corto: "nitrate", unidad: "µmol/kg", dec: 1, modo: "nutriente", nutriente: "nitrato", rango: 12, escala: "rampa", periodo: "1955–2022", cobertura: "Zones with World Ocean Atlas data", secciones: ["humboldt"],
    lecturaCambio: "A rise means more nitrate per unit of seawater; a fall means less.",
    lecturaLimite: "A historical monthly average (climatology) built from observations, for a broad area. It does not show a given year or a local measurement.",
    que: "The historical monthly amount of nitrate in seawater.", fuente: "World Ocean Atlas 2023 (NOAA NCEI), historical monthly climatology." },
  { id: "fosfato", clave: "phosphate", nombre: "Phosphate", corto: "phosphate", unidad: "µmol/kg", dec: 1, modo: "nutriente", nutriente: "fosfato", rango: 2, escala: "rampa", periodo: "1955–2022", cobertura: "Zones with World Ocean Atlas data", secciones: ["humboldt"],
    lecturaCambio: "A rise means more phosphate per unit of seawater; a fall means less.",
    lecturaLimite: "A historical monthly average (climatology) built from observations, for a broad area. It does not show a given year or a local measurement.",
    que: "The historical monthly amount of phosphate in seawater.", fuente: "World Ocean Atlas 2023 (NOAA NCEI), historical monthly climatology." },
  { id: "oxigeno_disuelto", clave: "dissolved oxygen", nombre: "Dissolved oxygen", corto: "dissolved oxygen", unidad: "ml/L", dec: 2, modo: "regional", campo: "oxygen_ml_l", rango: 10, escala: "rampa", periodo: "1998–2026", cobertura: "Peruvian coastal average; not zone-specific", secciones: ["humboldt"],
    lecturaCambio: "A rise means more dissolved oxygen per unit of seawater; a fall means less.",
    lecturaLimite: "Model-based value averaged over the Peruvian coast. It is not specific to a zone and not a local measurement.",
    que: "The regional monthly amount of oxygen dissolved in seawater.", fuente: "CMEMS environmental reanalysis, summarized in the regional monitor." },
];

export const variablePorId = (id: string): Variable => VARIABLES.find((v) => v.id === id) ?? (VARIABLES[0] as Variable);
export const esRegional = (v: Variable): boolean => v.modo === "indice" || v.modo === "regional";
export const variablesDeSeccion = (seccion: ExplorerSection): readonly Variable[] => VARIABLES.filter((v) => v.secciones.includes(seccion));
