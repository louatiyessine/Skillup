import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import PageHeader from '../components/PageHeader'
import ResourceCard from '../components/ResourceCard'
import SearchForm from '../components/SearchForm'
import Spinner from '../components/Spinner'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import {
  CATEGORIES,
  DEFAULT_SUBJECT,
  findCategory,
  friendlyNetworkError,
  MIN_QUERY_LENGTH,
  pickDomain,
  searchBooks,
} from '../services/openLibrary'

function ResourcesPage({ favorites, onToggleFavorite }) {
  useDocumentTitle('Ressources')

  // La recherche et le domaine sont gardés dans l'URL (?q=react&cat=web) :
  // ils restent en place quand on revient de la page détail avec « Retour ».
  const [searchParams, setSearchParams] = useSearchParams()
  // Une recherche de moins de 3 caractères tapée dans l'URL est ignorée (l'API la refuserait).
  const rawQuery = (searchParams.get('q') ?? '').trim()
  const query = rawQuery.length >= MIN_QUERY_LENGTH ? rawQuery : ''
  const category = findCategory(searchParams.get('cat'))

  // Sans recherche ni domaine, on propose une sélection « programmation ».
  const isDiscovery = !query && category.id === 'all'
  const subject = category.subject || (query ? '' : DEFAULT_SUBJECT)

  const [books, setBooks] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0) // +1 = relancer la recherche

  const [loadingMore, setLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(null)

  // Numéro de la recherche en cours : sert à ignorer une réponse « Voir plus »
  // qui arriverait après un changement de recherche.
  const searchIdRef = useRef(0)

  // Appel à l'API à chaque changement de `query`, `subject` (ou clic sur Réessayer).
  useEffect(() => {
    let ignore = false // passe à true si la recherche change avant la réponse
    searchIdRef.current += 1

    async function loadBooks() {
      setLoading(true)
      setError(null)
      setLoadMoreError(null)
      setLoadingMore(false) // un ancien « Voir plus » en cours ne doit pas bloquer le bouton
      try {
        const result = await searchBooks(query, subject, 1)
        if (!ignore) {
          setBooks(result.books)
          setTotal(result.total)
          setPage(1)
        }
      } catch (err) {
        if (!ignore) {
          setError(friendlyNetworkError(err))
          setBooks([])
          setTotal(0)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadBooks()

    // Nettoyage : on ignore la réponse de l'ancienne recherche.
    return () => {
      ignore = true
    }
  }, [query, subject, reloadCount])

  async function handleLoadMore() {
    const searchId = searchIdRef.current
    const nextPage = page + 1
    setLoadingMore(true)
    setLoadMoreError(null)
    try {
      const result = await searchBooks(query, subject, nextPage)
      if (searchId !== searchIdRef.current) return // la recherche a changé entre-temps
      // Immutabilité : nouveau tableau = anciens livres + nouveaux (sans doublons).
      setBooks((prev) => {
        const knownIds = new Set(prev.map((book) => book.id))
        return [...prev, ...result.books.filter((book) => !knownIds.has(book.id))]
      })
      setPage(nextPage)
    } catch (err) {
      if (searchId === searchIdRef.current) setLoadMoreError(friendlyNetworkError(err))
    } finally {
      if (searchId === searchIdRef.current) setLoadingMore(false)
    }
  }

  function updateParams(nextQuery, nextCategoryId) {
    const params = {}
    if (nextQuery) params.q = nextQuery
    if (nextCategoryId !== 'all') params.cat = nextCategoryId
    setSearchParams(params)
  }

  function handleSearch(newQuery) {
    updateParams(newQuery, category.id)
  }

  function handleSelectCategory(categoryId) {
    updateParams(query, categoryId)
  }

  function isFavorite(bookId) {
    return favorites.some((favorite) => favorite.id === bookId)
  }

  const hasMore = !loading && !error && books.length > 0 && books.length < total

  function renderTitle() {
    if (isDiscovery) return 'Sélection pour bien démarrer : programmation'
    const count = `${total.toLocaleString('fr-FR')} résultat${total > 1 ? 's' : ''}`
    const parts = [count]
    if (query) parts.push(`pour « ${query} »`)
    if (category.id !== 'all') parts.push(`en ${category.label}`)
    return parts.join(' ')
  }

  return (
    <section>
      <PageHeader
        icon="book"
        title="Ressources"
        subtitle="Des milliers de livres d'Open Library pour apprendre à ton rythme."
      />

      <div className="panel mb-4">
        {/* key : si la recherche change dans l'URL (bouton Retour), le formulaire repart de la bonne valeur. */}
        <SearchForm key={query} initialValue={query} onSearch={handleSearch} />
        <CategoryFilter categories={CATEGORIES} selected={category.id} onSelect={handleSelectCategory} />
      </div>

      {loading && <Spinner label="Recherche des ressources..." />}

      {!loading && error && (
        <ErrorMessage
          title="Impossible de charger les ressources"
          message={error}
          onRetry={() => setReloadCount((count) => count + 1)}
        />
      )}

      {!loading && !error && books.length === 0 && (
        <EmptyState
          title="Aucun résultat"
          message={
            query
              ? `Aucune ressource ne correspond à « ${query} »${category.id !== 'all' ? ` en ${category.label}` : ''}. Essaie un autre mot ou un autre domaine.`
              : 'Aucune ressource dans ce domaine pour le moment.'
          }
        >
          <button type="button" className="btn btn-outline-light" onClick={() => updateParams('', 'all')}>
            Réinitialiser la recherche
          </button>
        </EmptyState>
      )}

      {!loading && !error && books.length > 0 && (
        <>
          <p className="results-title" aria-live="polite">
            {renderTitle()}
          </p>
          <div className="resource-grid">
            {books.map((book) => (
              <ResourceCard
                key={book.id}
                book={book}
                domain={category.id !== 'all' ? category.label : pickDomain(book.subjects)}
                isFavorite={isFavorite(book.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </>
      )}

      {loadMoreError && <ErrorMessage message={loadMoreError} onRetry={handleLoadMore} />}

      {hasMore && (
        <div className="text-center mt-4">
          <button type="button" className="btn btn-outline-light" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? (
              <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
            ) : (
              <i className="bi bi-plus-lg me-2" aria-hidden="true"></i>
            )}
            {loadingMore ? 'Chargement...' : 'Voir plus de ressources'}
          </button>
        </div>
      )}
    </section>
  )
}

export default ResourcesPage
