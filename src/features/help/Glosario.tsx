import { SectionArt } from '../../components/ui/SectionArt'

const TERMS = [
  { term: 'Anomaly', definition: 'The difference between a measured value and what is normal for that month.' },
  { term: 'Chlorophyll', definition: 'A pigment in phytoplankton. Satellites estimate chlorophyll from water color; it is an indicator, not a direct count of fish or food.' },
  { term: 'Climatology', definition: 'The usual value for each month of the year, used here as a normal-month reference.' },
  { term: 'Confidence interval', definition: 'A range that describes uncertainty around an estimate under the method’s assumptions. The trend panel reports a 95% interval.' },
  { term: 'El Niño', definition: 'A climate event represented in the site’s analyses through the coastal Niño 1+2 index, among other records.' },
  { term: 'Hindcast', definition: 'A forecast test on past data: each past month is estimated using only earlier data, then compared with what was observed.' },
  { term: 'Humboldt Current', definition: 'A current that carries cold water north along the coast. The explorer presents it as context for the Peruvian upwelling system.' },
  { term: 'Mann–Kendall test', definition: 'A test of whether values tend to rise or fall consistently over time, without assuming a straight-line relationship.' },
  { term: 'Outlook', definition: 'The site’s tested estimate of sea-surface temperature. It is not a forecast of fish or fishing.' },
  { term: 'p-value or q-value', definition: 'A p-value measures how unusual a result would be if there were no trend and the test assumptions held. A q-value is an adjusted p-value used to account for many tests; neither is the probability that a hypothesis is true.' },
  { term: 'Reanalysis', definition: 'A model-based estimate that combines available observations with a model; it is not a direct observation.' },
  { term: 'Sen slope', definition: 'The median rate of change calculated from pairs of yearly observations. The trend panel reports it per decade.' },
  { term: 'Start year', definition: 'The first year included in a selected trend period. Changing it changes which yearly values are tested.' },
  { term: 'Trend', definition: 'A general rising or falling pattern in a series over time. It does not by itself show what caused the change.' },
  { term: 'Upwelling', definition: 'The rise of cold, nutrient-rich water from below the surface near Peru. The explorer describes wind pushing surface water offshore as part of this process.' },
]

export function Glosario() {
  return <section className="seccion help-section" id="glossary" aria-labelledby="help-glossary-title">
    <header className="lab-heading" data-reveal><SectionArt kind="book" /><div><p className="puente-kicker">Words used on this site</p>
    <h2 id="help-glossary-title">Glossary</h2></div></header>
    <dl className="help-glossary" data-stagger>
      {TERMS.map(({ term, definition }) => <div className="help-term" key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}
    </dl>
  </section>
}
