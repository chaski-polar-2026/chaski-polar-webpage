import { lazy, Suspense, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import '../App.css'
import '../estilos.css'
import '../features/explorer/explorer.css'
import '../features/tendencias/evidence.css'
import { DataState } from '../components/ui/DataState'
import { DataProvider, useData } from '../contexts/DataContext'
import { ExplorerProvider } from '../features/explorer/ExplorerContext'
import AppShell from '../layouts/AppShell'

const GlobePanel = lazy(() => import('../features/explorer/components/GlobePanel'))
/** Explorador: los datos se cargan solo al entrar a esta página */
export default function HomePage() {
  const { hash, search } = useLocation()
  const researchAnchors = ['#hallazgos', '#eventos-nino', '#physical-chain', '#cruceros', '#trends', '#trend-map', '#prediction', '#fuentes', '#method', '#trend-glossary']
  useEffect(() => {
    document.title = 'Chaski Polar · Explorer'
    document.documentElement.classList.add('explorer-page')
    const previous = document.documentElement.lang
    document.documentElement.lang = 'en'
    return () => { document.documentElement.lang = previous; document.documentElement.classList.remove('explorer-page') }
  }, [])
  if (researchAnchors.includes(hash)) return <Navigate to={`/research${search}${hash}`} replace />
  return <DataProvider><Explorador /></DataProvider>
}

function Explorador() {
  const { loading, error } = useData()
  return (
    <AppShell>
      <DataState loading={loading} error={error}>
        <ExplorerProvider>
          <main id="contenido"><Suspense fallback={<div className="data-state">
            <p>Preparing the interactive globe…</p>
          </div>}>
            <GlobePanel />
          </Suspense></main>

        </ExplorerProvider>
      </DataState>
    </AppShell>
  )
}
