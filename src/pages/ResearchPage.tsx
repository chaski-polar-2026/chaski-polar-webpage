import { lazy, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import '../estilos.css'
import '../features/explorer/explorer.css'
import '../features/tendencias/evidence.css'
import { DataState } from '../components/ui/DataState'
import { DataProvider, useData } from '../contexts/DataContext'
import { ExplorerProvider } from '../features/explorer/ExplorerContext'
import { CargarAlVer } from '../components/ui/CargarAlVer'
import FuentesSection from '../features/fuentes/FuentesSection'
import AppShell from '../layouts/AppShell'
import BiologiaResearch from '../features/explorer/components/relato/BiologiaResearch'

// las secciones con gráficos se descargan cuando el usuario se acerca a ellas
const InsightsSection = lazy(() => import('../features/insights/InsightsSection'))
const EventosNinoSection = lazy(() => import('../features/eventos/EventosNinoSection'))
const CrucerosSection = lazy(() => import('../features/cruceros/CrucerosSection'))
const PhysicalChainSection = lazy(() => import('../features/physical-chain/PhysicalChainSection'))
const TendenciasSection = lazy(() => import('../features/tendencias/TendenciasSection'))
const MapaTendencias = lazy(() => import('../features/tendencias/MapaTendencias'))
const PrediccionSection = lazy(() => import('../features/prediccion/PrediccionSection'))
const PerspectivaTemperatura = lazy(() => import('../features/prediccion/PerspectivaTemperatura'))

import '../features/research/research.css'

export default function ResearchPage() {
  useEffect(() => {
    document.title = 'Chaski Polar · Research'
    document.querySelector('meta[name="description"]')?.setAttribute('content', "Ocean trends off Peru, tested: trends, El Niño, robustness checks and sources.")
    document.documentElement.lang = 'en'
    if (!location.hash) window.scrollTo(0, 0)
  }, [])
  return <DataProvider><Research /></DataProvider>
}

function Research() {
  const { loading, error } = useData()
  return <AppShell><DataState loading={loading} error={error}><ExplorerProvider>
          <main id="contenido" className="research-page">
          <section className="puente-explorador" aria-label="From the globe to the evidence">
            <div className="puente-hilo" aria-hidden="true"><span /></div>
            <div className="puente-copy">
              <p className="puente-kicker">The view is only the beginning</p>
              <h2>From a living ocean to evidence we can compare</h2>
              <p>Explore our findings, test trends and trace each result to its source.</p>
            </div>
            <div className="puente-steps" aria-hidden="true">
              <span><i>01</i>Observe</span>
              <b />
              <span><i>02</i>Compare</span>
              <b />
              <span><i>03</i>Interpret</span>
            </div>
          </section>
            <section className="research-intro" aria-labelledby="research-title">
              <p className="research-eyebrow">RESEARCH · CHASKI POLAR</p>
              <h1 id="research-title">What the ocean records reveal</h1>
              <p>El Niño, phytoplankton and a changing sea. Explore what the evidence supports—and where it remains uncertain.</p>
              <nav className="research-nav" aria-label="Research sections">
                <a href="#hallazgos">Findings</a><a href="#trends">Test a trend</a><a href="#anchoveta-response">Anchoveta response</a><a href="#cruceros">Anchoveta surveys</a><a href="#fuentes">Sources &amp; methods</a>
              </nav>
              <div className="research-results">
                <article><span>01 · SUPPORTED ASSOCIATION</span><h2>El Niño and Peru’s phytoplankton</h2><p>Warmer Niño 1+2 conditions are associated with lower modeled phytoplankton carbon and lower satellite chlorophyll in Chimbote and Callao.</p><a href="#hallazgos">Explore the evidence →</a></article>
                <article><span>02 · NO ROBUST DIRECT LINK</span><h2>No robust Antarctic–Peruvian link</h2><p>The tested Antarctic–Peruvian phytoplankton links did not survive the robustness checks. This does not prove that no connection exists.</p><a href="#hallazgos">See the comparisons →</a></article>
                <article><span>03 · PERIOD MATTERS</span><h2>A trend depends on the record</h2><p>Regional sea-level reanalysis shows a rising signal. Other trends depend on the period or product; annual autocorrelation remains a limitation.</p><a href="#trends">Compare periods →</a></article>
              </div>
              <p className="research-limit">Associations are not proof of causation. Chlorophyll is a pigment indicator; landings are not fish biomass. Monthly zone averages cannot identify harmful algal blooms (“red tides”).</p>
            </section>

            <details className="seccion pregunta research-question"><summary>Research question and scope</summary>
              <blockquote>Do changes in the Southern Ocean show up in the Peruvian sea? What the tests found.</blockquote>
              <div className="cuerpo">
                <p>
                  <strong>Phytoplankton</strong> are microscopic algae floating in the sea. They support the food web: zooplankton eat them, anchoveta eat zooplankton, and birds, sea lions and fisheries depend on anchoveta.
                </p>
                <p>
                  Satellites estimate phytoplankton from the color of the water: greener means more <strong>chlorophyll</strong>. The research brings together monthly records since 1998 for five Peruvian zones and two Antarctic zones, plus temperature, turbidity, wind, sea ice, nutrients and annual catches.
                </p>
                <p>
                  The goal is to find <strong>associations</strong>. Two things changing together does not prove that one causes the other, and lower catches do not mean the species has disappeared.
                </p>
              </div>
            </details>
            <details className="seccion pregunta research-question" id="conexion-antartida"><summary>Is there a physical link between the Southern Ocean and Peru?</summary>
              <div className="cuerpo">
                <p><strong>In principle, yes, through the ocean.</strong> Subantarctic Mode Water forms at the northern edge of the Southern Ocean, travels north below the surface, and is a main source of nutrients for the thermocline of much of the ocean (<a href="https://www.nature.com/articles/nature02127" target="_blank" rel="noreferrer">Sarmiento et al., 2004</a>). A model study found that more than half of each mode-water tracer reaches the subtropical thermocline within 50 years, with large differences between regions (<a href="https://doi.org/10.1002/2016JC011680" target="_blank" rel="noreferrer">Jones et al., 2016</a>). Models estimate that nutrients exported from the Southern Ocean support between 33% and 75% of low-latitude productivity. Other methods give different results, and the figure is not specific to Peru (<a href="https://doi.org/10.1029/2018GB005977" target="_blank" rel="noreferrer">Hauck et al., 2018</a>).</p>
                <p><strong>Off Peru, much of the upwelled nitrate does not stay near the surface.</strong> A study combining ship observations and a model estimates that 30% to 40% of upwelled nitrate sinks again within 20 days. In a cold filament, surface chlorophyll was about four times lower than at the upwelling front, while primary production was about twice as high (<a href="https://doi.org/10.5194/bg-18-3605-2021" target="_blank" rel="noreferrer">Hauschildt et al., 2021</a>). Chlorophyll, nutrients and production are not the same thing.</p>
                <p><strong>In the atmosphere, the documented direction mostly runs the other way.</strong> El Niño changes tropical convection, which drives the Pacific–South America pattern that affects the Antarctic Peninsula and West Antarctica (<a href="https://doi.org/10.1175/JCLI-D-11-00273.1" target="_blank" rel="noreferrer">Schneider et al., 2012</a>). So El Niño can influence both regions, which is why our tests control for it.</p>
                <p><strong>What our tests found.</strong> In more than 1,000 tests at monthly and yearly scales (Antarctic sea ice, the SAM index, and Antarctic and South Pacific temperatures against chlorophyll, temperature and nutrients off Peru), none showed a robust link once El Niño was taken into account. The ocean pathways act over decades and do not tell us how much of Peru's upwelled nitrate is Antarctic in origin. A slow link is possible, but 28 years of satellite and reanalysis data cannot test it.</p>
              </div>
            </details>
            <CargarAlVer id="hallazgos" alto={160}><InsightsSection /></CargarAlVer>
            <CargarAlVer id="eventos-nino" alto={160}><EventosNinoSection /></CargarAlVer>
            <CargarAlVer id={/^#nino-link-(sst|seaLevel|deepTemperature|deepOxygen|oxygen|phosphate|chlorophyll)$/.test(location.hash) ? location.hash.slice(1) : "physical-chain"} alto={160}><PhysicalChainSection /></CargarAlVer>
            <section className="seccion" id="anchoveta-response"><BiologiaResearch /></section>
            <CargarAlVer id="cruceros" alto={160}><CrucerosSection /></CargarAlVer>
            <CargarAlVer id="trends" alto={160}><TendenciasSection /></CargarAlVer>
            <CargarAlVer id="trend-map" alto={160}><MapaTendencias /></CargarAlVer>
            <CargarAlVer id="prediction" alto={160}><PrediccionSection /></CargarAlVer>
            <CargarAlVer id="temperature-outlook" alto={160}><PerspectivaTemperatura /></CargarAlVer>
            <section className="seccion">
              <div className="llamada">
                <div>
                  <h2>The complete journey</h2>
                  <p>Return home and descend from satellite orbit to the seafloor: phytoplankton, anchoveta schools and the oxygen minimum zone, layer by layer.</p>
                  <Link className="button-primary" to="/">Return home</Link>
                </div>
              </div>
            </section>
            <FuentesSection />
          </main>
          <footer className="pie">Chaski Polar · Open satellite data from NASA, ESA and NOAA. The relationships shown here are associations, not proof of causation.</footer>
  </ExplorerProvider></DataState></AppShell>
}
