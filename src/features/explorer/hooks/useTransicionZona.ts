import { useEffect, useRef, type RefObject } from 'react'
import type { GlobeMethods } from 'react-globe.gl'
import { useExplorer } from '../ExplorerContext'
import type { Pov } from '../lib/estado'
import { useExplorerStore } from '../store'

/** One cancellable camera animation. The saved viewpoint survives interrupted entries. */
export function useTransicionZona(globe: RefObject<GlobeMethods | undefined>, ready: boolean) {
  const { modelo } = useExplorer()
  const request = useExplorerStore(s => s.zoneRequest)
  const previous = useRef<Pov | null>(null)
  useEffect(() => {
    if (!request) { previous.current = null; return }
    const g = globe.current
    if (!g || !ready) return
    const st = useExplorerStore.getState()
    const from = g.pointOfView()
    const entering = request.z != null
    if (entering && !previous.current) previous.current = { ...from }
    const z = request.z ? modelo.zona(request.z) : null
    const to = z ? { lat: z.lat, lng: z.lon, altitude: 0.3 } : previous.current ?? from
    const motion = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0, start: number | null = null, revealed = false
    g.controls().autoRotate = false
    g.pointOfView(from, 0)
    const finish = () => {
      g.pointOfView(to, 0)
      st.setZonePhase(entering ? 'map' : 'globe')
      if (!entering) previous.current = null
    }
    const instant = () => { if (motion.matches) { cancelAnimationFrame(frame); finish() } }
    if (motion.matches) { finish(); return }
    const longitude = ((to.lng - from.lng + 540) % 360) - 180
    const animate = (time: number) => {
      start ??= time
      const elapsed = time - start, t = Math.min(1, elapsed / 1500)
      const eased = t * t * (3 - 2 * t)
      g.pointOfView({ lat: from.lat + (to.lat - from.lat) * eased, lng: from.lng + longitude * eased, altitude: from.altitude + (to.altitude - from.altitude) * eased }, 0)
      if (entering && !revealed && elapsed >= 1000) { revealed = true; st.setZonePhase('map') }
      if (t < 1) frame = requestAnimationFrame(animate)
      else finish()
    }
    frame = requestAnimationFrame(animate)
    motion.addEventListener('change', instant)
    return () => { cancelAnimationFrame(frame); motion.removeEventListener('change', instant) }
  }, [request, ready, globe, modelo])
}
