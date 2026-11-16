import { create } from 'zustand'
import type { Comparacion, ExplorerSection, MapStyle, Panel, Pov, SidebarTab } from './lib/estado'
import type { IdZona } from './lib/tipos'

/** id de una de las variables de lib/variables.ts */
export type ExplorerVariable = string
/** illustrated: atlas plano con zonas. detailed: relieve y mapa del satélite. satellite: foto de la Tierra con el mapa encima */
export type GlobeView = 'illustrated' | 'detailed' | 'satellite'

/** Pedido de movimiento de cámara: el globo lo ejecuta cuando cambia el id */
type CameraRequest = { pov: Pov; ms: number; id: number }

type ExplorerState = {
  zoneView: IdZona | null
  zonePhase: 'globe' | 'zooming' | 'map' | 'returning'
  zoneRequest: { z: IdZona | null; id: number } | null
  openZone: (z: IdZona) => void
  closeZone: () => void
  setZonePhase: (phase: 'globe' | 'zooming' | 'map' | 'returning') => void
  variable: ExplorerVariable
  section: ExplorerSection
  sidebarTab: SidebarTab
  sidebarOpen: boolean
  view: GlobeView
  month: number
  playing: boolean
  panel: Panel
  mapStyle: MapStyle
  comparison: Comparacion
  camera: CameraRequest | null
  /** zona elegida en el monitor de condiciones (null = promedio de la costa) */
  monitorZone: IdZona | null
  setVariable: (variable: ExplorerVariable) => void
  setSection: (section: ExplorerSection) => void
  setSidebarTab: (sidebarTab: SidebarTab) => void
  setSidebarOpen: (open: boolean) => void
  setView: (view: GlobeView) => void
  setMonth: (month: number) => void
  setPlaying: (playing: boolean) => void
  setPanel: (panel: Panel) => void
  setMapStyle: (mapStyle: MapStyle) => void
  setComparison: (comparison: Comparacion) => void
  flyTo: (pov: Pov, ms?: number) => void
  setMonitorZone: (zone: IdZona | null) => void
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  zoneView: null,
  zonePhase: 'globe',
  zoneRequest: null,
  openZone: (z) => set((s) => ({ zoneView: z, zonePhase: 'zooming', zoneRequest: { z, id: (s.zoneRequest?.id ?? 0) + 1 } })),
  closeZone: () => set((s) => ({ zonePhase: 'returning', zoneRequest: { z: null, id: (s.zoneRequest?.id ?? 0) + 1 } })),
  setZonePhase: (zonePhase) => set({ zonePhase, ...(zonePhase === 'globe' ? { zoneView: null } : {}) }),
  variable: 'clorofila_mg_m3',
  section: 'humboldt',
  sidebarTab: 'parametro',
  sidebarOpen: false,
  view: 'detailed',
  month: 364, // mayo de 2023 (las series empiezan en enero de 1993)
  playing: false,
  panel: { tipo: 'general' },
  mapStyle: 'bandas',
  comparison: { region: 'peru', mes: 4, a: 'prom', b: 2023 },
  camera: null,
  monitorZone: null,
  setVariable: (variable) => set({ variable }),
  setSection: (section) => set({ section, zonePhase: 'globe', zoneView: null, zoneRequest: null }),
  setSidebarTab: (sidebarTab) => set({ sidebarTab }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setView: (view) => set({ view }),
  setMonth: (month) => set({ month }),
  setPlaying: (playing) => set({ playing }),
  setPanel: (panel) => set({ panel, ...(panel.tipo !== 'zona' ? { zonePhase: 'globe' as const, zoneView: null, zoneRequest: null } : {}) }),
  setMapStyle: (mapStyle) => set({ mapStyle }),
  setComparison: (comparison) => set({ comparison }),
  flyTo: (pov, ms = 1500) => set((s) => ({ camera: { pov, ms, id: (s.camera?.id ?? 0) + 1 } })),
  setMonitorZone: (monitorZone) => set({ monitorZone }),
}))
