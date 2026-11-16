import { RECUADRO } from './mapa'

export type ReferencePath = {
  reference: true
  nombre: string
  pts: [number, number][]
  color: string
  help: string
}
export type ReferenceLabel = { lat: number; lng: number; text: string; help: string; basin?: boolean }

// Sample parallels, rather than joining distant corners with great-circle edges.
export function boxOutline(south: number, north: number, west: number, east: number): [number, number][] {
  const corners: [number, number][] = [[south, west], [north, west], [north, east], [south, east], [south, west]]
  return corners.slice(0, -1).flatMap((a, i) => {
    const b = corners[i + 1]!
    const steps = Math.ceil(Math.max(Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])) / 2)
    return Array.from({ length: steps }, (_, k): [number, number] => [a[0] + (b[0] - a[0]) * k / steps, a[1] + (b[1] - a[1]) * k / steps])
  }).concat([corners[0]!])
}

export const COVERAGE_TEXT = 'Data coverage: South-east Pacific and Antarctica. The rest of the globe is shown for context.'
export const COVERAGE: ReferencePath = {
  reference: true, nombre: 'Data coverage', help: COVERAGE_TEXT,
  pts: boxOutline(RECUADRO.lat - RECUADRO.h / 2, RECUADRO.lat + RECUADRO.h / 2, RECUADRO.lng - RECUADRO.w / 2, RECUADRO.lng + RECUADRO.w / 2),
  color: 'rgba(205,229,239,0.48)',
}

// NOAA PSL: https://psl.noaa.gov/data/timeseries/month/
// Niño 1+2: 0–10°S, 90–80°W. Niño 3.4: 5°N–5°S, 170–120°W.
export const NINO_HELP = "Niño 1+2 is the index used in this project's analyses. Niño 3.4 is shown for reference."
export const NINO_REGIONS: ReferencePath[] = [
  { reference: true, nombre: 'Niño 1+2', pts: boxOutline(-10, 0, -90, -80), color: 'rgba(242,217,159,0.4)', help: NINO_HELP },
  { reference: true, nombre: 'Niño 3.4', pts: boxOutline(-5, 5, -170, -120), color: 'rgba(242,217,159,0.4)', help: 'Niño 3.4: an El Niño reference region. The project uses Niño 1+2 in its analyses.' },
]
export const NINO_LABELS: ReferenceLabel[] = [
  { lat: 4, lng: -85, text: 'Niño 1+2', help: NINO_HELP },
  { lat: 9, lng: -145, text: 'Niño 3.4', help: 'Niño 3.4: El Niño reference region' },
]
export const BASIN_LABELS: ReferenceLabel[] = [
  { lat: -28, lng: -126, text: 'South Pacific Ocean', help: 'South Pacific Ocean', basin: true },
  { lat: -61, lng: -130, text: 'Southern Ocean', help: 'Southern Ocean', basin: true },
  { lat: -31, lng: -28, text: 'South Atlantic Ocean', help: 'South Atlantic Ocean', basin: true },
]
export const TESTED_RESULT = 'Link tested: no robust association found in the available data. The project covers 28 years and more than 2,300 tests overall. Weak or very slow links are still possible.'
