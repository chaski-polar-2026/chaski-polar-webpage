import { SectionArt } from '../components/ui/SectionArt'
import { useSectionReveal } from '../components/ui/useSectionReveal'
import '../features/help/reading-pages.css'
import { useEffect } from 'react'
import '../App.css'
import '../estilos.css'
import '../features/tendencias/evidence.css'
import AppShell from '../layouts/AppShell'
import { Faq } from '../features/help/Faq'
import { Glosario } from '../features/help/Glosario'
import { GuiaDocentes } from '../features/help/GuiaDocentes'
import '../features/research/research.css'
import '../features/help/help.css'

export default function HelpPage() {
  const reveal = useSectionReveal()
  useEffect(() => {
    document.title = 'Chaski Polar · Help'
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Answers, ocean and statistics terms, and short classroom activities for using Chaski Polar.')
    document.documentElement.lang = 'en'
    if (!location.hash) window.scrollTo(0, 0)
  }, [])

  return <AppShell>
    <main ref={reveal} id="contenido" className="research-page reading-page help-page">
      <section className="research-intro" aria-labelledby="help-title">
        <div className="reading-hero" data-reveal><div><p className="research-eyebrow">HELP · CHASKI POLAR</p>
        <h1 id="help-title">Help and learning guide</h1>
        <p>Find answers, learn key terms, and use the site in a short classroom activity.</p>
        </div><SectionArt kind="book" /></div>
        <nav className="research-nav" aria-label="Help sections">
          <a href="#faq">Questions</a><a href="#glossary">Glossary</a><a href="#teachers">For teachers</a>
        </nav>
      </section>
      <Faq />
      <Glosario />
      <GuiaDocentes />
      <footer className="pie">Chaski Polar · All results shown here are associations, not proof of causes.</footer>
    </main>
  </AppShell>
}
