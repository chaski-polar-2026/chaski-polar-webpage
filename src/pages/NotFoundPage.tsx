import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return <main className="game-placeholder">
    <h1>Page not found</h1>
    <p>The page you opened does not exist or has moved. Try one of these:</p>
    <p><Link className="btn" to="/">Return home</Link> <Link className="btn" to="/explorer">Open the explorer</Link> <Link className="btn" to="/research">Read the research</Link></p>
  </main>
}
