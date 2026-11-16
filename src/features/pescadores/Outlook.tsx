import { Icono } from '../../components/ui/Icono';
import data from '../prediccion/perspectiva_acierto.json';
import InfoTip from '../../components/ui/InfoTip';
export const clearlyImproves = (ci: number[]) => ci[0]! > 0;
export default function Outlook({
  zone
}: {
  zone: string;
}) {
  const rows = data.results.filter(r => r.variable === 'SST' && r.model === 'nino' && r.zone === zone);
  function download() {
    const csv = ['# Sea surface temperature tests, 2010-2025; model nino. Not a current forecast.', '# Source: ' + data.source, 'zone,months_ahead,sign_hit_rate,base_rate_positive,n,mae_improvement,ci95_low,ci95_high,status', ...rows.map(r => [r.zone, r.horizon_months, r.sign_hit_rate, r.base_rate_positive, r.n, r.mae_improvement, ...r.ci95, r.status].join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], {
      type: 'text/csv'
    }));
    const a = document.createElement('a');
    a.href = url;
    a.download = zone + '-temperature-tests.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <section id="outlook"><h2><Icono nombre="termometro" className="icono-titulo" />What may sea temperature do in the next months?</h2><p>An outlook estimates whether a month may be warmer or cooler than usual. Here we show how that estimate worked in past years, from 2010 to 2025. This is not a forecast for today.</p><figure className="temperature-key"><div>{['Cooler than normal', 'Normal for this month', 'Warmer than normal'].map((s, i) => <div key={s}><svg viewBox="0 0 70 90" width="60" height="78" role="img" aria-label={s}><path d="M25 55V18a10 10 0 0 1 20 0v37a20 20 0 1 1-20 0" fill="none" stroke="currentColor" strokeWidth="4" /><path d={'M35 70V' + [45, 30, 18][i]} stroke={['#17699a', '#445665', '#a64417'][i]} strokeWidth="9" /><circle cx="35" cy="70" r="10" fill={['#17699a', '#445665', '#a64417'][i]} /></svg><strong>{s}</strong></div>)}</div><figcaption>Normal means usual for that month. These drawings show meanings, not measured temperatures.</figcaption></figure><p><strong>What this means for you:</strong> these tests show how often the estimate matched warmer or cooler conditions.</p><div className="outlook-grid" aria-live="polite">{rows.map(r => {
        const x = Math.round(r.sign_hit_rate * 10);
        return <article key={r.horizon_months}><h3><Icono nombre="calendario" className="icono-sub" />{r.horizon_months} month{r.horizon_months > 1 ? 's' : ''} ahead</h3>{clearlyImproves(r.ci95) ? <><p>The outlook was right about whether the sea would be warmer or cooler than normal in about <strong>{x} of every 10 months</strong>.</p><div className="ten-marks" role="img" aria-label={`${x} of 10 correct, rounded from past tests`}>{Array.from({
                length: 10
              }, (_, i) => <span aria-hidden="true" key={i} className={i < x ? 'hit' : ''}>{i < x ? '✓' : '−'}</span>)}</div><p>Filled circle with tick: correct. Outline with dash: incorrect.</p></> : <p>? Not clearly better than guessing. The error test does not show a clear improvement over a normal month.</p>}<p>By chance, a warmer-or-cooler guess would be right about 5 of 10 times.</p></article>;
      })}</div><details><summary><Icono nombre="tabla" className="icono-sub" />Show the technical numbers</summary><p>Model: nino. {data.source}</p><p>The 95% interval<InfoTip term="95% interval">A range showing uncertainty in the estimated error reduction.</InfoTip> is for error reduction against a normal month. It does not test direction accuracy against chance.</p>{rows.map(r => <article key={r.horizon_months}><h3><Icono nombre="calendario" className="icono-sub" />{r.horizon_months} months ahead</h3><p>Direction accuracy: {(r.sign_hit_rate * 100).toFixed(1)}%. Months tested: {r.n}. Warmer-than-normal share: {(r.base_rate_positive * 100).toFixed(1)}%.</p><p>Error reduction: {(r.mae_improvement * 100).toFixed(1)}%. 95% interval: {r.ci95.map(v => (v * 100).toFixed(1) + '%').join(' to ')}.</p></article>)}<button onClick={download}>Download the data (CSV)</button></details></section>;
}
