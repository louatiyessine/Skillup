import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import Spinner from '../components/Spinner'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { friendlyNetworkError, getCoverUrl, getWork, pickDomain } from '../services/openLibrary'
import { addDays, todayISO } from '../utils/dates'
import { STATUS } from '../utils/tasks'

const SHORT_DESCRIPTION = 600

function ResourceDetailPage({ favorites, tasks, onToggleFavorite, onAddTask, onAsk, assistantBusy }) {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  // Livre transmis par la carte (Link state). Absent si on arrive par l'URL directement.
  const preview = location.state?.book?.id === id ? location.state.book : null

  const [work, setWork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [coverFailed, setCoverFailed] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadWork() {
      setLoading(true)
      setError(null)
      setExpanded(false)
      setCoverFailed(false)
      try {
        const data = await getWork(id)
        if (!ignore) setWork(data)
      } catch (err) {
        if (!ignore) {
          setWork(null)
          setError(err instanceof TypeError ? friendlyNetworkError(err) : err.message)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadWork()
    return () => {
      ignore = true
    }
  }, [id, reloadCount])

  // Données à afficher : celles de l'API si elles sont arrivées, sinon l'aperçu.
  const current = work?.id === id ? work : null
  const title = current?.title ?? preview?.title ?? 'Ressource'
  const author = current?.authors.length ? current.authors.join(', ') : preview?.author ?? 'Auteur inconnu'
  const year = preview?.year ?? current?.year ?? null
  const coverId = current?.coverId ?? preview?.coverId ?? null
  const subjects = current?.subjects ?? preview?.subjects ?? []

  useDocumentTitle(title)

  // Tant qu'on n'a ni l'aperçu ni les données de l'API, les boutons sont désactivés :
  // sinon on enregistrerait « Ressource » / « Auteur inconnu ».
  const ready = Boolean(current || preview)

  const isFavorite = favorites.some((favorite) => favorite.id === id)
  const hasTask = tasks.some((task) => task.resourceId === id)

  // Objet « livre » au même format que les cartes du catalogue.
  const book = { id, title, author, year, coverId, subjects: subjects.slice(0, 8) }

  function handleBack() {
    // S'il y a une page précédente dans l'application, on y retourne (recherche conservée).
    if (location.key !== 'default') navigate(-1)
    else navigate('/ressources')
  }

  function handleAddTask() {
    onAddTask({
      title: `Lire « ${title} »`,
      description: `Ressource du catalogue : ${title}, de ${author}.`,
      dueDate: addDays(todayISO(), 7),
      status: STATUS.PENDING,
      resourceId: id,
    })
  }

  function handleAsk() {
    const sent = onAsk(
      `Présente-moi le livre « ${title} » de ${author} : de quoi parle-t-il et qu'est-ce que je peux y apprendre ?`,
    )
    if (sent) navigate('/assistant')
  }

  const description = current?.description ?? ''
  const isLong = description.length > SHORT_DESCRIPTION
  const visibleDescription =
    isLong && !expanded ? `${description.slice(0, SHORT_DESCRIPTION).trimEnd()}…` : description

  // Erreur sans aperçu : rien d'autre à montrer.
  if (error && !preview) {
    return (
      <section>
        <button type="button" className="btn btn-link back-link" onClick={handleBack}>
          <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
          Retour
        </button>
        <ErrorMessage
          title="Ressource indisponible"
          message={error}
          onRetry={() => setReloadCount((count) => count + 1)}
        />
        <Link to="/ressources" className="btn btn-primary mt-3">
          Parcourir le catalogue
        </Link>
      </section>
    )
  }

  return (
    <section>
      <button type="button" className="btn btn-link back-link" onClick={handleBack}>
        <i className="bi bi-arrow-left me-1" aria-hidden="true"></i>
        Retour
      </button>

      <div className="detail">
        <div className="detail__cover">
          <div className="resource-card__placeholder detail__placeholder" aria-hidden="true">
            <i className="bi bi-book-half"></i>
            <span>{title.charAt(0)}</span>
          </div>
          {coverId && !coverFailed && (
            <img
              src={getCoverUrl(coverId, 'L')}
              alt={`Couverture de « ${title} »`}
              onError={() => setCoverFailed(true)}
            />
          )}
        </div>

        <div className="detail__info">
          {subjects.length > 0 && <span className="domain-badge">{pickDomain(subjects)}</span>}
          <h1 className="detail__title">{title}</h1>
          <p className="detail__author">
            <i className="bi bi-person me-1" aria-hidden="true"></i>
            {loading && !preview ? 'Chargement...' : author}
            {year && <span className="text-muted-soft"> · {year}</span>}
          </p>

          <div className="detail__actions">
            <button
              type="button"
              className={`btn ${isFavorite ? 'btn-favorite' : 'btn-outline-light'}`}
              aria-pressed={isFavorite}
              disabled={!ready}
              onClick={() => onToggleFavorite(book)}
            >
              <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} me-2`} aria-hidden="true"></i>
              {isFavorite ? 'Dans mes favoris' : 'Ajouter aux favoris'}
            </button>

            {hasTask ? (
              <Link to="/revisions" className="btn btn-outline-light">
                <i className="bi bi-check2-circle me-2" aria-hidden="true"></i>
                Déjà dans mes révisions
              </Link>
            ) : (
              <button type="button" className="btn btn-outline-light" disabled={!ready} onClick={handleAddTask}>
                <i className="bi bi-calendar-plus me-2" aria-hidden="true"></i>
                Planifier la lecture
              </button>
            )}

            <button
              type="button"
              className="btn btn-accent"
              disabled={!ready || assistantBusy}
              title={assistantBusy ? "Skilly répond déjà à une question" : undefined}
              onClick={handleAsk}
            >
              <i className="bi bi-stars me-2" aria-hidden="true"></i>
              Demander à Skilly
            </button>
          </div>

          <h2 className="detail__heading">Description</h2>
          {loading && <Spinner label="Chargement de la description..." />}
          {!loading && error && (
            <ErrorMessage message={error} onRetry={() => setReloadCount((count) => count + 1)} />
          )}
          {!loading && !error && (
            <>
              {description ? (
                <p className="detail__description">{visibleDescription}</p>
              ) : (
                <p className="text-muted-soft">Aucune description n'est disponible pour cette ressource.</p>
              )}
              {isLong && (
                <button
                  type="button"
                  className="btn btn-link px-0"
                  aria-expanded={expanded}
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  {expanded ? 'Réduire' : 'Lire la suite'}
                </button>
              )}
            </>
          )}

          {subjects.length > 0 && (
            <>
              <h2 className="detail__heading">Sujets</h2>
              <ul className="subject-list">
                {subjects.map((subject) => (
                  <li key={subject}>
                    <Link to={`/ressources?q=${encodeURIComponent(subject)}`} className="chip chip--small">
                      {subject}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {current && (
            <a href={current.url} target="_blank" rel="noreferrer" className="detail__external">
              Voir la fiche sur Open Library
              <i className="bi bi-box-arrow-up-right ms-1" aria-hidden="true"></i>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export default ResourceDetailPage
