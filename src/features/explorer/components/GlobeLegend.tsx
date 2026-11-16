import { COVERAGE_TEXT, NINO_HELP, TESTED_RESULT } from '../lib/globeLayers'
import './globe-legend.css'

export type GlobeLayers = { coverage: boolean; nino: boolean; tested: boolean; basins: boolean }
export const INITIAL_LAYERS: GlobeLayers = { coverage: true, nino: true, tested: false, basins: true }

export default function GlobeLegend({ layers, onChange, distance }: { layers: GlobeLayers; onChange: (layers: GlobeLayers) => void; distance: number }) {
  const check = (key: keyof GlobeLayers, label: string, description: string) => <label className="globe-layer-control">
    <input type="checkbox" checked={layers[key]} onChange={e => onChange({ ...layers, [key]: e.target.checked })} aria-describedby={`layer-${key}-help`} />
    <span><b>{label}</b><span id={`layer-${key}-help`}>{description}</span></span>
  </label>
  return <details className="globe-legend">
    <summary>Globe layers and coverage</summary>
    <div className="globe-legend-content">
      {check('coverage', 'Data outline', COVERAGE_TEXT)}
      {check('nino', 'Where El Niño is measured · Reference regions', NINO_HELP)}
      {check('tested', 'Tested link', 'Shows the link between the Southern Ocean and Peru that this project tested. Nothing robust was found.')}
      <p className="tested-result" aria-live="polite">{layers.tested ? <><strong>{TESTED_RESULT}</strong> About {distance.toLocaleString('en')} km along a great circle. This line shows the pair studied; it does not show a cause or a confirmed connection.</> : 'Tested link is off. Turn it on to see the pair studied and the result.'}</p>
      {check('basins', 'Ocean names', 'Faint labels for the South Pacific, Southern and South Atlantic oceans.')}
    </div>
  </details>
}
