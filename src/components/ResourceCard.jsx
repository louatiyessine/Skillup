import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCoverUrl } from '../services/openLibrary'

/**
 * Carte d'une ressource (livre).
 * Elle ne modifie rien elle-même : elle prévient le parent avec onToggleFavorite(book).
 */
function ResourceCard({ book, domain, isFavorite, onToggleFavorite }) {
  // Si l'image ne charge pas, on affiche une couverture de remplacement.
  const [imageFailed, setImageFailed] = useState(false)
  const coverUrl = getCoverUrl(book.coverId, 'M')
  const showImage = coverUrl && !imageFailed

  return (
    <article className="resource-card">
      <div className="resource-card__cover">
        {/* Couverture de remplacement, visible tant que l'image n'est pas chargée (ou absente). */}
        <div className="resource-card__placeholder" aria-hidden="true">
          <i className="bi bi-book-half"></i>
          <span>{book.title.charAt(0)}</span>
        </div>
        {showImage && (
          <img
            src={coverUrl}
            alt=""
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}

        <button
          type="button"
          className={`favorite-button ${isFavorite ? 'is-active' : ''}`}
          aria-pressed={isFavorite}
          aria-label={`Favori : « ${book.title} »`}
          title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          onClick={() => onToggleFavorite(book)}
        >
          <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'}`} aria-hidden="true"></i>
        </button>
      </div>

      <div className="resource-card__body">
        <span className="domain-badge">{domain}</span>
        <h2 className="resource-card__title">
          {/* `state` transmet le livre à la page détail : affichage immédiat du titre. */}
          <Link to={`/ressources/${book.id}`} state={{ book }} className="stretched-link">
            {book.title}
          </Link>
        </h2>
        <p className="resource-card__author">{book.author}</p>
        {book.year && <p className="resource-card__year">{book.year}</p>}
      </div>
    </article>
  )
}

export default ResourceCard
