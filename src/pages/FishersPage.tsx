import { lazy, useEffect } from 'react'
import '../App.css'
import '../estilos.css'
import '../features/explorer/explorer.css'
import '../features/research/research.css'
import AppShell from '../layouts/AppShell'
import { CargarAlVer } from '../components/ui/CargarAlVer'

const PerspectivaTemperatura = lazy(() => import('../features/prediccion/PerspectivaTemperatura'))
const PescadoresSection = lazy(() => import('../features/pescadores/PescadoresSection'))
const GraficosPescadores = lazy(() => import('../features/pescadores/GraficosPescadores'))
const GuiasPescadores = lazy(() => import('../features/pescadores/GuiasPescadores'))

export default function FishersPage() {
  useEffect(() => {
    document.title = 'Chaski Polar · For artisanal fishers'
    document.querySelector('meta[name="description"]')?.setAttribute('content', "A tested sea-temperature outlook and documented species context for artisanal fishers. Not a catch forecast.")
    document.documentElement.lang = 'en'
    if (!location.hash) window.scrollTo(0, 0)
  }, [])
  return <AppShell>
    <main id="contenido" className="research-page">
      <section className="research-intro" aria-labelledby="fishers-title">
        <p className="research-eyebrow">FOR ARTISANAL FISHERS · CHASKI POLAR</p>
        <h1 id="fishers-title">What the sea data can and cannot tell you</h1>
        <p>A sea-temperature outlook that has been tested on past years, and documented context for each species. This page does not forecast catches or fish locations, and it is not guidance on sea safety.</p>
      </section>
      <CargarAlVer id="how-to-use" alto={160}><GuiasPescadores /></CargarAlVer>
      <CargarAlVer id="temperature-outlook" alto={160}><PerspectivaTemperatura /></CargarAlVer>
      <CargarAlVer id="fishers-charts" alto={160}><GraficosPescadores /></CargarAlVer>
      <CargarAlVer id="species" alto={160}><PescadoresSection /></CargarAlVer>
      <footer className="pie">Chaski Polar · Species information comes from cited public sources, mostly IMARPE. The relationships shown here are associations, not proof of causation.</footer>
    </main>
  </AppShell>
}
