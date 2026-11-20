import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="text-center py-5">
      <h1 className="display-4">404</h1>
      <p>Cette page n'existe pas.</p>
      <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
    </section>
  )
}

export default NotFoundPage