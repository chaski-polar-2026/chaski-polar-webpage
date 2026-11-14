import type { GlobeView } from '../store'

type Props = {
  value: GlobeView
  onChange: (view: GlobeView) => void
}

const VISTAS: { id: GlobeView; nombre: string }[] = [
  { id: 'illustrated', nombre: 'Illustrated' },
  { id: 'detailed', nombre: 'Detailed' },
  { id: 'satellite', nombre: 'Satellite' },
]

export function GlobeViewToggle({ value, onChange }: Props) {
  return <div className="view-toggle" role="group" aria-label="Globe view">
    {VISTAS.map((v) => <button key={v.id} className={value === v.id ? 'is-active' : ''} type="button" aria-pressed={value === v.id} onClick={() => onChange(v.id)}><b>{v.nombre}</b></button>)}
  </div>
}
