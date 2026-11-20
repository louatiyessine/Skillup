import { Link, useNavigate } from 'react-router-dom'
import Mascot from '../components/Mascot'
import ProgressBar from '../components/ProgressBar'
import StatCard from '../components/StatCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getCoverUrl } from '../services/openLibrary'
import { describeDeadline } from '../utils/dates'
import { getTaskStats, sortTasks, STATUS } from '../utils/tasks'

const QUICK_QUESTIONS = [
  'Comment organiser mes révisions sur une semaine ?',
  'Explique-moi la différence entre props et state',
  'Donne-moi 3 astuces pour mieux mémoriser',
]

function greeting() {
  const hour = new Date().getHours()
  if (hour < 5 || hour >= 18) return 'Bonsoir'
  return 'Bonjour'
}

// Le message de Skilly change selon l'activité de l'utilisateur.
function mascotTip(stats, favoritesCount) {
  if (stats.overdue > 0) {
    return { mood: 'sad', text: `Tu as ${stats.overdue} tâche(s) en retard. On s'y met ensemble ?` }
  }
  if (stats.total > 0 && stats.percent === 100) {
    return { mood: 'proud', text: 'Toutes tes révisions sont terminées. Je suis fier de toi !' }
  }
  if (stats.total === 0 && favoritesCount === 0) {
    return { mood: 'happy', text: 'Commence par explorer le catalogue et garde tes livres préférés en favoris.' }
  }
  if (stats.total === 0) {
    return { mood: 'thinking', text: 'Tu as des favoris : planifie leur lecture dans tes révisions !' }
  }
  return { mood: 'happy', text: `Encore ${stats.pending} tâche(s) à faire. Tu avances bien !` }
}

/**
 * Accueil : toutes les statistiques sont CALCULÉES à partir de `favorites` et `tasks`
 * reçus en props. Rien n'est stocké en double.
 */
function HomePage({ favorites, tasks, onAsk, assistantBusy }) {
  useDocumentTitle('Accueil')
  const navigate = useNavigate()

  const stats = getTaskStats(tasks)
  const tip = mascotTip(stats, favorites.length)
  const upcoming = sortTasks(tasks.filter((task) => task.status === STATUS.PENDING)).slice(0, 4)
  const recentFavorites = favorites.slice(-4).reverse() // slice crée une copie : reverse est sans danger

  function handleQuickQuestion(question) {
    if (onAsk(question)) navigate('/assistant') // on change de page seulement si la question est partie
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__content">
          <p className="hero__eyebrow">{greeting()} 👋</p>
          <h1 className="hero__title">
            Apprends, révise, <span className="text-gradient">progresse.</span>
          </h1>
          <p className="hero__text">
            SkillUp réunit un catalogue de ressources, tes favoris, un planning de révisions et un assistant IA.
            Tout au même endroit.
          </p>
          <div className="d-flex flex-wrap gap-2">
            <Link to="/ressources" className="btn btn-primary btn-lg">
              <i className="bi bi-book me-2" aria-hidden="true"></i>
              Explorer le catalogue
            </Link>
            <Link to="/revisions" className="btn btn-outline-light btn-lg">
              <i className="bi bi-calendar-check me-2" aria-hidden="true"></i>
              Planifier mes révisions
            </Link>
          </div>
        </div>

        <div className="hero__mascot">
          <p className="speech-bubble">{tip.text}</p>
          <Mascot size={170} mood={tip.mood} animated title="Skilly, la mascotte de SkillUp" />
        </div>
      </section>

      <h2 className="section-title">Ton activité</h2>
      <div className="stat-grid">
        <StatCard icon="heart" label="Favoris" value={favorites.length} tone="pink" to="/favoris" />
        <StatCard
          icon="hourglass-split"
          label="Tâches en cours"
          value={stats.pending}
          hint={stats.overdue > 0 ? `${stats.overdue} en retard` : null}
          tone="primary"
          to="/revisions"
        />
        <StatCard icon="check2-circle" label="Tâches terminées" value={stats.done} tone="accent" to="/revisions" />
        <StatCard icon="graph-up-arrow" label="Progression" value={`${stats.percent}%`} tone="amber" to="/revisions" />
      </div>

      <div className="panel mt-3">
        <div className="d-flex justify-content-between mb-2">
          <span className="fw-semibold">Progression des révisions</span>
          <span className="text-muted-soft small">
            {stats.done} / {stats.total} tâche(s)
          </span>
        </div>
        <ProgressBar value={stats.percent} label="Progression globale des révisions" />
      </div>

      <div className="row g-4 mt-1">
        <div className="col-lg-6">
          <section className="panel h-100">
            <div className="panel__header">
              <h2 className="panel__title mb-0">Prochaines échéances</h2>
              <Link to="/revisions" className="small">
                Tout voir
              </Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-muted-soft mb-0">Aucune tâche en cours. Profites-en pour en planifier une !</p>
            ) : (
              <ul className="mini-list">
                {upcoming.map((task) => {
                  const deadline = describeDeadline(task.dueDate)
                  return (
                    <li key={task.id}>
                      <span className="mini-list__title">{task.title}</span>
                      <span className={`deadline deadline--${deadline.tone}`}>{deadline.label}</span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>

        <div className="col-lg-6">
          <section className="panel h-100">
            <div className="panel__header">
              <h2 className="panel__title mb-0">Derniers favoris</h2>
              <Link to="/favoris" className="small">
                Tout voir
              </Link>
            </div>
            {recentFavorites.length === 0 ? (
              <p className="text-muted-soft mb-0">Pas encore de favori. Clique sur le cœur d'une ressource.</p>
            ) : (
              <ul className="cover-strip">
                {recentFavorites.map((book) => (
                  <li key={book.id}>
                    <Link to={`/ressources/${book.id}`} state={{ book }} className="cover-strip__item">
                      {book.coverId ? (
                        <img
                          src={getCoverUrl(book.coverId, 'M')}
                          alt=""
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.visibility = 'hidden' // garde le fond dégradé
                          }}
                        />
                      ) : (
                        <span className="cover-strip__placeholder" aria-hidden="true">
                          <i className="bi bi-book-half"></i>
                        </span>
                      )}
                      <span className="cover-strip__title">{book.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <section className="panel ask-card mt-4">
        <Mascot size={64} mood="thinking" />
        <div className="flex-grow-1">
          <h2 className="panel__title mb-1">Une question ? Demande à Skilly</h2>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {QUICK_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                className="chip"
                disabled={assistantBusy}
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
