import { useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import PageHeader from '../components/PageHeader'
import ResourceCard from '../components/ResourceCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { pickDomain } from '../services/openLibrary'

const SORTS = {
  recent: { label: 'Ajoutés récemment', compare: (a, b) => (b.addedAt ?? '').localeCompare(a.addedAt ?? '') },
  title: { label: 'Titre (A → Z)', compare: (a, b) => a.title.localeCompare(b.title, 'fr') },
  author: { label: 'Auteur (A → Z)', compare: (a, b) => a.author.localeCompare(b.author, 'fr') },
}

function FavoritesPage({ favorites, onToggleFavorite }) {
  useDocumentTitle('Favoris')

  // Champs contrôlés pour filtrer et trier (ils ne modifient pas les favoris).
  const [filterText, setFilterText] = useState('')
  const [sortBy, setSortBy] = useState('recent')

  // Liste affichée = valeur DÉRIVÉE : calculée à chaque rendu, pas stockée dans le state.
  const search = filterText.trim().toLowerCase()
  const visibleFavorites = favorites
    .filter(
      (book) => book.title.toLowerCase().includes(search) || book.author.toLowerCase().includes(search),
    )
    .sort(SORTS[sortBy].compare) // filter() a déjà créé une copie : sort() ne touche pas au state

  if (favorites.length === 0) {
    return (
      <section>
        <PageHeader icon="heart" title="Favoris" subtitle="Tes ressources préférées, gardées au chaud." />
        <EmptyState
          title="Aucun favori pour l'instant"
          message="Clique sur le cœur d'une ressource pour la retrouver ici, même après avoir fermé le navigateur."
        >
          <Link to="/ressources" className="btn btn-primary">
            <i className="bi bi-book me-2" aria-hidden="true"></i>
            Explorer le catalogue
          </Link>
        </EmptyState>
      </section>
    )
  }

  return (
    <section>
      <PageHeader
        icon="heart"
        title="Favoris"
        subtitle={`${favorites.length} ressource${favorites.length > 1 ? 's' : ''} sauvegardée${favorites.length > 1 ? 's' : ''}.`}
      />

      <div className="panel toolbar mb-4">
        <div className="toolbar__search">
          <label htmlFor="favorites-filter" className="visually-hidden">
            Filtrer mes favoris
          </label>
          <i className="bi bi-funnel" aria-hidden="true"></i>
          <input
            id="favorites-filter"
            type="search"
            className="form-control"
            placeholder="Filtrer par titre ou auteur"
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
          />
        </div>
        <div className="toolbar__sort">
          <label htmlFor="favorites-sort" className="form-label mb-0 small text-muted-soft">
            Trier
          </label>
          <select
            id="favorites-sort"
            className="form-select"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            {Object.entries(SORTS).map(([value, sort]) => (
              <option key={value} value={value}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {visibleFavorites.length === 0 ? (
        <EmptyState title="Aucun favori ne correspond" message={`Rien trouvé pour « ${filterText} ».`} mood="thinking">
          <button type="button" className="btn btn-outline-light" onClick={() => setFilterText('')}>
            Effacer le filtre
          </button>
        </EmptyState>
      ) : (
        <div className="resource-grid">
          {visibleFavorites.map((book) => (
            <ResourceCard
              key={book.id}
              book={book}
              domain={pickDomain(book.subjects ?? [])}
              isFavorite
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default FavoritesPage
