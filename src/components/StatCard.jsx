import { Link } from 'react-router-dom'

// Carte de statistique de l'accueil. Toute la carte est un lien vers le module concerné.
function StatCard({ icon, label, value, hint, tone = 'primary', to }) {
  return (
    <Link to={to} className={`stat-card stat-card--${tone}`}>
      <span className="stat-card__icon" aria-hidden="true">
        <i className={`bi bi-${icon}`}></i>
      </span>
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__label">{label}</span>
      {hint && <span className="stat-card__hint">{hint}</span>}
    </Link>
  )
}

export default StatCard
