import { SectionArt } from '../components/ui/SectionArt'
import { useSectionReveal } from '../components/ui/useSectionReveal'
import '../features/help/reading-pages.css'
import { useEffect } from 'react'
import '../App.css'
import '../estilos.css'
import '../features/tendencias/evidence.css'
import '../features/research/research.css'
import '../features/pescadores/pescadores.css'
import AppShell from '../layouts/AppShell'
import { PipelineDiagrama } from '../features/guias/GuiasInvestigacion'
import '../features/guias/guias.css'

const PENDIENTE = 'To be confirmed by the team.'

export default function AboutPage() {
  const reveal = useSectionReveal()
  useEffect(() => {
    document.title = 'Chaski Polar · About and methods'
    document.querySelector('meta[name="description"]')?.setAttribute('content', "What Chaski Polar tests, where the ocean data come from, the methods used and what the results cannot say.")
    document.documentElement.lang = 'en'
    if (!location.hash) window.scrollTo(0, 0)
  }, [])
  return <AppShell>
    <main ref={reveal} id="contenido" className="research-page reading-page about-page">
      <section className="research-intro" aria-labelledby="about-title">
        <div className="reading-hero" data-reveal><div><p className="research-eyebrow">ABOUT · CHASKI POLAR</p>
        <h1 id="about-title">About and methods</h1>
        <p>What this project is, what it tests, where the data come from and what it cannot say.</p>
        </div><SectionArt kind="satellite" /></div>
        <nav className="research-nav" aria-label="About sections">
          <a href="#what">What it is</a><a href="#question">The question</a><a href="#who">Who it is for</a><a href="#data">Data</a><a href="#methods">Methods</a><a href="#limits">Limits</a><a href="#ai">Use of AI</a><a href="#games">Games</a><a href="#credits">Credits</a>
        </nav>
      </section>

      <section data-reveal className="seccion pescadores" id="what" aria-labelledby="t-what">
        <h2 id="t-what">What Chaski Polar is</h2>
        <p>Chaski Polar is an open web tool and an analysis repository. You pick a variable, a region and a period, and the tool shows the yearly series, the rate of change per decade with a 95% interval and a significance test. It then shows how much the answer depends on the start year, on the data source and on the strong El Niño years 1998, 2016 and 2023.</p>
        <p>The variables are chlorophyll-a, sea surface temperature, sea level, temperature and oxygen at 100–200 m, and Antarctic sea-ice extent. Two games, a scroll-driven landing page and a 3D globe make the same evidence easier to read for non-specialists.</p>
      </section>

      <section data-reveal className="seccion guias" id="how" aria-labelledby="t-how"><h2 id="t-how">How it works, in five steps</h2><PipelineDiagrama /></section>

      <section data-reveal className="seccion pescadores" id="question" aria-labelledby="t-question">
        <h2 id="t-question">The question we test</h2>
        <p><strong>Is the Southern Ocean Connected to Peru&apos;s Upwelling System? Testing Trends and Long-Lag Associations, 1998–2025.</strong> On the site this appears as “Is the change real? Ocean trends off Peru, tested.”</p>
        <p>Main findings: sea level off Peru rises (+3.0 cm per decade from satellite altimetry, 95% interval 2.2–3.7). Several other trends change sign or lose significance when the start year changes. No robust Antarctic–Peru link was detected with these data. All results are associations, not proof of causation.</p>
      </section>

      <section data-reveal className="seccion pescadores" id="who" aria-labelledby="t-who">
        <h2 id="t-who">Who it is for</h2>
        <ul className="about-lista">
          <li><strong>Universities and research centres</strong> that want to understand how the Southern Ocean and the Peruvian sea relate. The tool gives a transparent baseline of what 28 years of satellite and reanalysis data can and cannot show, with every test, null result and method documented so it can be repeated and extended.</li>
          <li><strong>Students and teachers</strong> who need a worked example of how to test a trend and why a trend can disappear when the start year changes.</li>
          <li><strong>Analysts and citizen scientists</strong> who want open tables and a method they can reproduce.</li>
          <li><strong>Coastal and fishing communities</strong> as an informational audience: a tested sea-temperature outlook and documented context for each species. It is not a catch forecast or safety guidance. See <a href="/fishers">For fishers</a>.</li>
        </ul>
      </section>

      <section data-reveal className="seccion pescadores" id="data" aria-labelledby="t-data">
        <h2 id="t-data">Data sources</h2>
        <ul className="about-lista">
          <li><strong>NASA and ESA.</strong> Ocean colour (chlorophyll-a) from the ESA Ocean Colour CCI product, which merges several satellite sensors, including NASA sensors; NASA ocean-colour records and NASA POWER meteorology are also used in some analyses.</li>
          <li><strong>NOAA.</strong> Coral Reef Watch and ERSST v5 sea surface temperature, PSL climate indices (Niño 1+2 and the Southern Annular Mode) and the World Ocean Atlas for historical nutrient averages.</li>
          <li><strong>NSIDC.</strong> Sea Ice Index for Antarctic sea-ice extent.</li>
          <li><strong>Copernicus.</strong> GLORYS12 ocean reanalysis (model-based) and C3S/DUACS satellite altimetry for sea level.</li>
          <li><strong>Fisheries and national sources.</strong> FAO global capture production, BCRP monthly anchoveta landings, and IMARPE and PRODUCE publications for species context.</li>
        </ul>
        <p className="nota">The full list with links is in the Sources section of the <a href="/research#fuentes">research page</a>.</p>
      </section>

      <section data-reveal className="seccion pescadores" id="methods" aria-labelledby="t-methods">
        <h2 id="t-methods">Methods</h2>
        <ul className="about-lista">
          <li><strong>Trend tests.</strong> Mann–Kendall test for a rising or falling series and Sen slope with a 95% interval for the typical rate of change.</li>
          <li><strong>Many tests, one correction.</strong> When many relationships are tested, results are corrected for false discoveries (Benjamini–Hochberg), and the effective sample size accounts for autocorrelation.</li>
          <li><strong>El Niño control.</strong> Associations are re-tested after removing the coastal El Niño signal (Niño 1+2).</li>
          <li><strong>Robustness.</strong> Trends are re-tested with different start years and without the extreme El Niño years 1998, 2016 and 2023.</li>
          <li><strong>Outlooks.</strong> Retrospective forecasts with a moving origin compare simple models with predicting a normal month for each month.</li>
          <li><strong>Power.</strong> With 28 years of data, only strong links can be detected; weak or decade-long effects can neither be confirmed nor ruled out.</li>
        </ul>
      </section>

      <section data-reveal className="seccion pescadores" id="limits" aria-labelledby="t-limits">
        <h2 id="t-limits">Limits</h2>
        <ul className="about-lista">
          <li>The tool shows associations, not causes.</li>
          <li>It does not forecast fish catches or fish locations, and it is not guidance on sea safety.</li>
          <li>No robust Antarctic–Peru link was detected with the data available. This does not rule out weak or very slow links.</li>
          <li>Reanalysis products are models, not direct observations.</li>
          <li>Species information describes what was recorded in a given place and time. It is not a limit or an optimum.</li>
        </ul>
      </section>

      <section data-reveal className="seccion pescadores" id="ai" aria-labelledby="t-ai">
        <h2 id="t-ai">Use of AI</h2>
        <p><strong>AI as a development tool.</strong> AI assistants were used as support during development, analysis, debugging and writing. The team set the questions, the statistical criteria and the rules for results, and the assistants worked within them.</p>
        <p><strong>AI as part of the solution: no.</strong> The website, the games and the analyses do not call any AI service and contain no machine-learning model. The outlooks use simple regressions and persistence. All interface text is fixed.</p>
        <p className="nota">Details on the tools used and on any AI-generated design material: {PENDIENTE}</p>
      </section>

      <section data-reveal className="seccion pescadores" id="games" aria-labelledby="t-games">
        <h2 id="t-games">Games</h2>
        <p>The main game, <a href="/juego">Cardumen: the anchoveta saga</a>, is built for this project. The extra game, <a href="/extra-game/juego.html">From Ice to Anchovy</a>, is a small pixel-art game, adapted to English and integrated into this site for the event. It shows associations, not proven causes.</p>
      </section>

      <section data-reveal className="seccion pescadores" id="credits" aria-labelledby="t-credits">
        <h2 id="t-credits">Credits, license and code</h2>
        <ul className="about-lista">
          <li><strong>Team members and roles:</strong> {PENDIENTE}</li>
          <li><strong>Design tools and assets:</strong> {PENDIENTE}</li>
          <li><strong>License:</strong> {PENDIENTE}</li>
          <li><strong>Code and reproducibility:</strong> {PENDIENTE}</li>
        </ul>
      </section>
      <footer className="pie">Chaski Polar · The relationships shown here are associations, not proof of causation.</footer>
    </main>
  </AppShell>
}
