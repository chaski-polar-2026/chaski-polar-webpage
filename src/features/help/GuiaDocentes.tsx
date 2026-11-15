const ACTIVITIES = [
  {
    title: 'Does the trend survive?',
    objective: 'Compare how a trend changes when the selected start year changes.',
    steps: ['Open the explorer and choose a variable and place.', 'Open the research page and its trend panel.', 'Record the slope and p-value for the first period.', 'Change the start year and compare the result.'],
    questions: ['Did the direction or significance change?', 'How many years are in each period?', 'What can this comparison tell us, and what can it not tell us?'],
    expected: 'Students should report whether the result is sensitive to the chosen period. A changing result is a limit on how robust the trend is; it does not identify a cause. All results are associations.',
  },
  {
    title: 'Reading a chart',
    objective: 'Use the illustrated example in “How to read this page” on the research page to identify the parts of a trend chart.',
    steps: ['Open /research and find “How to read this page.”', 'Point out the dots, dashed line, shaded band, and orange start-year marker.', 'Read the figure caption together.', 'Explain what may happen when the start year changes.'],
    questions: ['What does each dot show?', 'What does the shaded band represent?', 'Why is the example labelled as made-up numbers?'],
    expected: 'The dots are yearly averages, the dashed line shows a typical rate of change, and the shaded band is a 95% interval. The figure is illustrative and does not present observed project results. All results discussed are associations.',
  },
  {
    title: 'What can a sea-temperature outlook tell us?',
    objective: 'Read the sea-temperature outlook on the For fishers page and state what it measures and what it cannot tell us.',
    steps: ['Open /fishers and pick one coastal zone.', 'Read the result for one time ahead: how many of every 10 months the outlook was right about warmer or cooler.', 'Open “Show the technical numbers” and find the 95% interval.', 'Use the limits note to write one supported conclusion and one unsupported conclusion.'],
    questions: ['What is being estimated?', 'Why does the page compare the result with guessing by chance?', 'Can this table predict catches, fish locations, or safe conditions?'],
    expected: 'The outlook was tested on past months: how often it was right about whether the sea would be warmer or cooler than normal, compared with guessing by chance. It cannot predict catches or fish locations, or provide safety guidance. Any relationships shown are associations.',
  },
]

export function GuiaDocentes() {
  return <section className="seccion help-section" id="teachers" aria-labelledby="help-teachers-title">
    <p className="puente-kicker">45 minutes each</p>
    <h2 id="help-teachers-title">Short guide for teachers</h2>
    <p className="help-teacher-intro">Each activity uses the site to practice reading evidence. The site shows associations, not causes.</p>
    <div className="help-activities">
      {ACTIVITIES.map((activity) => <article className="help-activity" key={activity.title}>
        <h3>{activity.title}</h3>
        <p><strong>Objective:</strong> {activity.objective}</p>
        <h4>Steps</h4><ol>{activity.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <h4>Questions for students</h4><ul>{activity.questions.map((question) => <li key={question}>{question}</li>)}</ul>
        <p className="help-expected"><strong>Expected answer:</strong> {activity.expected}</p>
      </article>)}
    </div>
  </section>
}
