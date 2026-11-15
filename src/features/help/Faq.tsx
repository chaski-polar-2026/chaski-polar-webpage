const QUESTIONS = [
  { q: 'What is Chaski Polar?', a: <>It is an open web tool and analysis project. It lets you explore ocean records and test trends and relationships in the available data. The results show associations, not proof of causes.</> },
  { q: 'Can I use it to decide when or where to fish?', a: <>No. Chaski Polar does not predict catches or fish locations, and it does not give safety guidance. The temperature outlook is about sea temperature only.</> },
  { q: 'Does it use artificial intelligence?', a: <>The website, games, and analyses do not use AI or machine learning. AI assistants were used to help develop, analyze, debug, and write the project.</> },
  { q: 'Where does the data come from?', a: <>The project uses several satellite, model, and agency records. See the <a href="/research#fuentes">research sources and methods</a> for the full list.</> },
  { q: 'What does “not significant” mean?', a: <>The test did not find enough evidence for a consistent trend in the selected period. It does not prove that no change exists.</> },
  { q: 'Why can a trend disappear when I change the start year?', a: <>Each start year gives the test a different set of yearly values and a different record length. Some results depend on that choice, so a trend in one period may not hold across other periods.</> },
  { q: 'Is the Southern Ocean connected to Peru’s upwelling?', a: <>A physical pathway is possible, but the project did not detect a robust link in the available data. This does not rule out weak or very slow links.</> },
  { q: 'Can I download the data?', a: <>Yes. The sea-temperature results on the <a href="/fishers">For fishers page</a> have a download button for the data as a CSV file.</> },
]

export function Faq() {
  return <section className="seccion help-section" id="faq" aria-labelledby="help-faq-title">
    <p className="puente-kicker">Quick answers</p>
    <h2 id="help-faq-title">Frequently asked questions</h2>
    <div className="help-faq-list">
      {QUESTIONS.map(({ q, a }) => <details className="help-faq-item" key={q}>
        <summary>{q}</summary>
        <div className="help-answer"><p>{a}</p></div>
      </details>)}
    </div>
  </section>
}
