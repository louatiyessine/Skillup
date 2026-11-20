import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

function NotFoundPage() {
  useDocumentTitle('Page introuvable')

  return (
    <section className="not-found">
      <Mascot size={140} mood="sad" animated />
      <p className="not-found__code">404</p>
      <h1 className="h3">Cette page n'existe pas</h1>
      <p className="text-muted-soft">Skilly a cherché partout, mais cette adresse ne mène nulle part.</p>
      <div className="d-flex flex-wrap gap-2 justify-content-center">
        <Link to="/" className="btn btn-primary">
          <i className="bi bi-house-door me-2" aria-hidden="true"></i>
          Retour à l'accueil
        </Link>
        <Link to="/ressources" className="btn btn-outline-light">
          Parcourir les ressources
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
