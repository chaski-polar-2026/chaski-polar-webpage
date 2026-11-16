import { Icono, Divisor } from '../components/ui/Icono'
import '../components/ui/decoracion.css'
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
import BibliografiaEspecies from '../features/research/BibliografiaEspecies'

// las secciones con gráficos se descargan cuando el usuario se acerca a ellas
const InsightsSection = lazy(() => import('../features/insights/InsightsSection'))
const EventosNinoSection = lazy(() => import('../features/eventos/EventosNinoSection'))
const CrucerosSection = lazy(() => import('../features/cruceros/CrucerosSection'))
const PhysicalChainSection = lazy(() => import('../features/physical-chain/PhysicalChainSection'))
const TendenciasSection = lazy(() => import('../features/tendencias/TendenciasSection'))
const MapaTendencias = lazy(() => import('../features/tendencias/MapaTendencias'))
const PrediccionSection = lazy(() => import('../features/prediccion/PrediccionSection'))
const PerspectivaTemperatura = lazy(() => import('../features/prediccion/PerspectivaTemperatura'))
const GuiasInvestigacion = lazy(() => import('../features/guias/GuiasInvestigacion'))

import '../features/research/research.css'
import '../features/research/research-vida.css'

// Resumen descriptivo de OC-CCI, enero de 1998 a diciembre de 2025; sin rellenar huecos.
const CLOROFILA_ANTARTIDA_PERU = [
  { zona: 'Pisco', media: '2.81', maximo: 'March', minimo: 'August', meses: 336 },
  { zona: 'Chimbote', media: '2.25', maximo: 'March', minimo: 'June', meses: 334 },
  { zona: 'Callao', media: '2.13', maximo: 'April', minimo: 'August', meses: 335 },
  { zona: 'Paita–Sechura', media: '1.66', maximo: 'April', minimo: 'September', meses: 336 },
  { zona: 'Ilo', media: '1.41', maximo: 'May', minimo: 'August', meses: 336 },
  { zona: 'King George Island', media: '0.44', maximo: 'February', minimo: 'August', meses: 226 },
  { zona: 'Antarctic Peninsula', media: '0.24', maximo: 'December', minimo: 'August', meses: 245 },
]

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
              <span><i>01</i><Icono nombre="ojo" className="icono-sub" />Observe</span>
              <b />
              <span><i>02</i><Icono nombre="barras" className="icono-sub" />Compare</span>
              <b />
              <span><i>03</i><Icono nombre="lupa" className="icono-sub" />Interpret</span>
            </div>
          </section>
            <section className="research-intro" aria-labelledby="research-title">
              <p className="research-eyebrow"><Icono nombre="ola" className="icono-sub" />RESEARCH · CHASKI POLAR</p>
              <h1 id="research-title">What the ocean records reveal</h1>
              <p>El Niño, phytoplankton and a changing sea. Explore what the evidence supports—and where it remains uncertain.</p>
              <nav className="research-nav" aria-label="Research sections">
                <a href="#hallazgos"><Icono nombre="lupa"  />Findings</a><a href="#conexion-antartida"><Icono nombre="brujula"  />Antarctica &amp; Peru</a><a href="#trends"><Icono nombre="tendencia"  />Test a trend</a><a href="#anchoveta-response"><Icono nombre="pez"  />Anchoveta response</a><a href="#cruceros"><Icono nombre="bote"  />Anchoveta surveys</a><a href="#fuentes"><Icono nombre="base"  />Sources &amp; methods</a><a href="#species-bibliography"><Icono nombre="libro"  />Species bibliography</a>
              </nav>
              <div className="research-results">
                <article><span>01 · SUPPORTED ASSOCIATION</span><h2>El Niño and Peru’s phytoplankton</h2><p>Warmer Niño 1+2 conditions are associated with lower modeled phytoplankton carbon and lower satellite chlorophyll in Chimbote and Callao.</p><a href="#hallazgos">Explore the evidence →</a></article>
                <article><span>02 · NO ROBUST DIRECT LINK</span><h2>No robust Antarctic–Peruvian link</h2><p>The tested Antarctic–Peruvian phytoplankton links did not survive the robustness checks. This does not prove that no connection exists.</p><a href="#hallazgos">See the comparisons →</a></article>
                <article><span>03 · PERIOD MATTERS</span><h2>A trend depends on the record</h2><p>Regional sea-level reanalysis shows a rising signal. Other trends depend on the period or product; annual autocorrelation remains a limitation.</p><a href="#trends">Compare periods →</a></article>
              </div>
              <p className="research-limit"><Icono nombre="aviso" className="icono-sub" />Associations are not proof of causation. Chlorophyll is a pigment indicator; landings are not fish biomass. Monthly zone averages cannot identify harmful algal blooms (“red tides”).</p>
            </section>

            <details className="seccion pregunta research-question"><summary><Icono nombre="lupa" className="icono-sub" />Research question and scope</summary>
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
            <details className="seccion pregunta research-question" id="conexion-antartida"><summary><Icono nombre="brujula" className="icono-sub" />Antarctica &amp; Peru: is there a physical ocean connection?</summary>
              <div className="cuerpo">
                <h2><Icono nombre="hoja" className="icono-sub" />Chlorophyll in the two regions</h2>
                <div className="antartida-tabla" role="region" aria-label="Chlorophyll by zone, 1998–2025" tabIndex={0}>
                  <table>
                    <caption>ESA OC-CCI monthly series · January 1998–December 2025</caption>
                    <thead><tr><th scope="col"><Icono nombre="pin" className="icono-th" />Zone</th><th scope="col"><Icono nombre="grafico" className="icono-th" />Mean (mg/m³)</th><th scope="col"><Icono nombre="calendario" className="icono-th" />Peak month</th><th scope="col"><Icono nombre="calendario" className="icono-th" />Lowest month</th><th scope="col"><Icono nombre="tabla" className="icono-th" />Months with data</th></tr></thead>
                    <tbody>{CLOROFILA_ANTARTIDA_PERU.map((fila) => <tr key={fila.zona}>
                      <th scope="row">{fila.zona}</th><td>{fila.media}</td><td>{fila.maximo}</td><td>{fila.minimo}</td><td>{fila.meses} / 336</td>
                    </tr>)}</tbody>
                  </table>
                </div>
                <p>Peruvian coastal chlorophyll is higher in these sampled zones, with peaks in March–May; the Antarctic zones peak in December–February. Peak and lowest months refer to averages for each calendar month across the record. The overall means use only available observations, without filling gaps.</p>
                <p>About 27–33% of Antarctic months are missing, with sea ice and low winter light limiting ocean-colour observations. Winter minima and regional means therefore need caution: the available months do not represent every season equally. August is the lowest observed monthly average in both Antarctic zones, but the Peruvian minimum varies by zone.</p>
                <h2><Icono nombre="gota" className="icono-sub" />Water origin, nutrient supply and biological response</h2>
                <p><strong>In principle, yes, through the ocean.</strong> Subantarctic Mode Water forms at the northern edge of the Southern Ocean, travels north below the surface, and is a main source of nutrients for the thermocline of much of the ocean (<a href="https://www.nature.com/articles/nature02127" target="_blank" rel="noreferrer">Sarmiento et al., 2004</a>). A model study found that more than half of each mode-water tracer reaches the subtropical thermocline within 50 years, with large differences between regions (<a href="https://doi.org/10.1002/2016JC011680" target="_blank" rel="noreferrer">Jones et al., 2016</a>). Models estimate that nutrients exported from the Southern Ocean support between 33% and 75% of low-latitude productivity. Other methods give different results, and the figure is not specific to Peru (<a href="https://doi.org/10.1029/2018GB005977" target="_blank" rel="noreferrer">Hauck et al., 2018</a>).</p>
                <p><strong>The Eastern Pacific pathway is especially efficient in the tracer model:</strong> roughly 80% of its mode-water tracer enters the subtropical thermocline within 50 years (<a href="https://doi.org/10.1002/2016JC011680" target="_blank" rel="noreferrer">Jones et al., 2016</a>). This describes modeled water-mass ventilation, not the percentage of nitrate off Peru supplied by Antarctica.</p>
                <p><strong>Local nitrate supply is a separate step.</strong> Observations off Peru report 15–20 µmol/L of nitrate in subsurface waters brought up by coastal upwelling (<a href="https://doi.org/10.5194/bg-18-3605-2021" target="_blank" rel="noreferrer">Hauschildt et al., 2021</a>, section 3.1). A synthesis of the Peruvian margin cites nutrient-rich source waters near 30 µmol/L and identifies the Peru–Chile Undercurrent as the local subsurface supply (<a href="https://doi.org/10.5194/bg-16-2163-2019" target="_blank" rel="noreferrer">Doering et al., 2019</a>, “Regional setting”). These concentrations do not identify an Antarctic fraction; the 15–20 µmol/L value is not the concentration in the filament's mixed layer.</p>
                <p><strong>Off Peru, much of the upwelled nitrate does not stay near the surface.</strong> A study combining ship observations and a model estimates that 30% to 40% of upwelled nitrate sinks again within 20 days. In a cold filament, surface chlorophyll was about four times lower than at the upwelling front, while primary production was about twice as high (<a href="https://doi.org/10.5194/bg-18-3605-2021" target="_blank" rel="noreferrer">Hauschildt et al., 2021</a>). Chlorophyll, nutrients and production are not the same thing.</p>
                <p><strong>Nitrate-supported production is another distinct measure.</strong> The f-ratio describes new production relative to total primary production. <a href="https://doi.org/10.1002/2016GB005554" target="_blank" rel="noreferrer">Kadko, 2017</a> (section 3.4) discusses a regional estimate of 0.29 ± 0.11 from earlier work and a separate calculation of 0.48 using another production estimate. These are different estimates, not a single uncertainty interval or a coast-wide constant. Neither measures the Antarctic share of Peru's nitrate.</p>
                <p><strong>In the atmosphere, the documented direction mostly runs the other way.</strong> El Niño changes tropical convection, which drives the Pacific–South America pattern that affects the Antarctic Peninsula and West Antarctica (<a href="https://doi.org/10.1175/JCLI-D-11-00273.1" target="_blank" rel="noreferrer">Schneider et al., 2012</a>). So El Niño can influence both regions, which is why our tests control for it.</p>
                <p><strong>What our tests found.</strong> In more than 1,000 tests at monthly and yearly scales (Antarctic sea ice, the SAM index, and Antarctic and South Pacific temperatures against chlorophyll, temperature and nutrients off Peru), none showed a robust link once El Niño was taken into account. The ocean pathways act over decades and do not tell us how much of Peru's upwelled nitrate is Antarctic in origin. A slow link is possible, but 28 years of satellite and reanalysis data cannot test it.</p>
                <p>Specifically, none of the project's 208 regional-current comparisons was robust. The strongest reported signal was zonal current versus Peruvian temperature one month later (r = 0.29; FDR-adjusted q = 0.057), below the evidence required by the q &lt; 0.05 criterion. It concerned temperature, not nitrate (<a href="https://github.com/chaski-polar-2026/data-treatment/blob/main/docs/pruebas_pendientes/RESULTADOS_PRUEBAS_PENDIENTES.md#b4-corrientes" target="_blank" rel="noreferrer">project report, B4</a>).</p>
                <h2><Icono nombre="lupa" className="icono-sub" />What would test the slow pathway?</h2>
                <p>A future study would need to distinguish subsurface water-mass transport, the local nitrate flux supplied by upwelling, and the subsequent response of chlorophyll, phytoplankton carbon and acoustically observed anchoveta biomass. Longer records and independent transport or tracer observations would be needed to evaluate the proposed route. The published percentages describe different steps and cannot be combined into one Antarctic contribution to Peruvian fisheries.</p>
              </div>
            </details>
            <CargarAlVer id="how-to-read" alto={160}><GuiasInvestigacion /></CargarAlVer>
            <CargarAlVer id="hallazgos" alto={160}><InsightsSection /></CargarAlVer>
            <CargarAlVer id="eventos-nino" alto={160}><EventosNinoSection /></CargarAlVer>
            <CargarAlVer id={/^#nino-link-(sst|seaLevel|deepTemperature|deepOxygen|oxygen|phosphate|chlorophyll)$/.test(location.hash) ? location.hash.slice(1) : "physical-chain"} alto={160}><PhysicalChainSection /></CargarAlVer>
            <Divisor nombre="pez" />
            <section className="seccion" id="anchoveta-response"><BiologiaResearch /></section>
            <CargarAlVer id="cruceros" alto={160}><CrucerosSection /></CargarAlVer>
            <Divisor nombre="tendencia" />
            <CargarAlVer id="trends" alto={160}><TendenciasSection /></CargarAlVer>
            <CargarAlVer id="trend-map" alto={160}><MapaTendencias /></CargarAlVer>
            <CargarAlVer id="prediction" alto={160}><PrediccionSection /></CargarAlVer>
            <CargarAlVer id="temperature-outlook" alto={160}><PerspectivaTemperatura /></CargarAlVer>
            <section className="seccion">
              <div className="llamada">
                <div>
                  <h2><Icono nombre="brujula" className="icono-titulo" />The complete journey</h2>
                  <p>Return home and descend from satellite orbit to the seafloor: phytoplankton, anchoveta schools and the oxygen minimum zone, layer by layer.</p>
                  <Link className="button-primary" to="/">Return home<Icono nombre="flecha" className="icono icono-fin" /></Link>
                </div>
              </div>
            </section>
            <Divisor nombre="base" />
            <FuentesSection />
            <BibliografiaEspecies />
          </main>
          <footer className="pie">Chaski Polar · Open satellite data from NASA, ESA and NOAA. The relationships shown here are associations, not proof of causation.</footer>
  </ExplorerProvider></DataState></AppShell>
}
