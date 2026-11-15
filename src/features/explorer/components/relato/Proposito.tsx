import './proposito.css'

const BLOQUES = [
  { titulo: 'What it is for', texto: 'To check whether ocean trends off Peru are real before anyone acts on them.' },
  { titulo: 'The problem', texto: 'Ocean trends are often reported as facts. Many change or disappear when the start year changes or when El Niño is taken into account, and it is hard for non-specialists to tell.' },
  { titulo: 'Who it is for', texto: 'Universities and research centres studying how the Southern Ocean and the Peruvian sea relate; teachers and students; coastal and fishing communities, as information only.' },
  { titulo: 'What changes', texto: 'You can see the trend, how sure we are, and whether it holds up, in one place and with every test documented, including the ones that found nothing.' },
]

/** Explicación breve y visible del propósito del explorador. */
export default function Proposito() {
  return (
    <details className="proposito" open>
      <summary>What is this page for?</summary>
      <dl>
        {BLOQUES.map((b) => <div key={b.titulo}><dt>{b.titulo}</dt><dd>{b.texto}</dd></div>)}
      </dl>
      <p><a href="/about">About and methods</a> · <a href="/fishers">For fishers</a></p>
    </details>
  )
}
