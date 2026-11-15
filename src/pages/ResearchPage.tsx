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

// las secciones con gráficos se descargan cuando el usuario se acerca a ellas
const InsightsSection = lazy(() => import('../features/insights/InsightsSection'))
const EventosNinoSection = lazy(() => import('../features/eventos/EventosNinoSection'))
const CrucerosSection = lazy(() => import('../features/cruceros/CrucerosSection'))
const PhysicalChainSection = lazy(() => import('../features/physical-chain/PhysicalChainSection'))
const TendenciasSection = lazy(() => import('../features/tendencias/TendenciasSection'))
const MapaTendencias = lazy(() => import('../features/tendencias/MapaTendencias'))
const PrediccionSection = lazy(() => import('../features/prediccion/PrediccionSection'))

import '../features/research/research.css'

export default function ResearchPage() {
  useEffect(() => {
    document.title = 'Chaski Polar · Research'
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
                <a href="#hallazgos">Findings</a><a href="#trends">Test a trend</a><a href="#cruceros">Anchoveta surveys</a><a href="#fuentes">Sources &amp; methods</a>
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
            <CargarAlVer id="hallazgos" alto={2600}><InsightsSection /></CargarAlVer>
            <CargarAlVer id="eventos-nino" alto={760}><EventosNinoSection /></CargarAlVer>
            <CargarAlVer id={/^#nino-link-(sst|seaLevel|deepTemperature|deepOxygen|oxygen|phosphate|chlorophyll)$/.test(location.hash) ? location.hash.slice(1) : "physical-chain"} alto={1100}><PhysicalChainSection /></CargarAlVer>
            <CargarAlVer id="cruceros" alto={820}><CrucerosSection /></CargarAlVer>
            <CargarAlVer id="trends" alto={1100}><TendenciasSection /></CargarAlVer>
            <CargarAlVer id="trend-map" alto={900}><MapaTendencias /></CargarAlVer>
            <CargarAlVer id="prediction" alto={1000}><PrediccionSection /></CargarAlVer>
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
