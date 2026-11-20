import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Mascot from './Mascot'
import ProgressBar from './ProgressBar'

// Liste des liens : un tableau + map() évite de répéter 5 fois le même JSX.
const LINKS = [
  { to: '/', label: 'Accueil', icon: 'house-door' },
  { to: '/ressources', label: 'Ressources', icon: 'book' },
  { to: '/favoris', label: 'Favoris', icon: 'heart', badge: 'favorites' },
  { to: '/revisions', label: 'Révisions', icon: 'check2-square', badge: 'pending' },
  { to: '/assistant', label: 'Assistant IA', icon: 'stars' },
]

function Brand({ onClick }) {
  return (
    <Link to="/" className="brand" onClick={onClick} aria-label="SkillUp, retour à l'accueil">
      <Mascot size={38} />
      <span className="brand__name">
        Skill<span className="brand__up">Up</span>
      </span>
    </Link>
  )
}

function Sidebar({ favoritesCount, pendingCount, progress, doneCount, totalCount }) {
  // Menu ouvert ou fermé (utile seulement sur mobile).
  const [open, setOpen] = useState(false)
  // Référence vers le bouton burger : on lui rend le focus quand on ferme avec Échap.
  const toggleRef = useRef(null)

  const badges = { favorites: favoritesCount, pending: pendingCount }

  function closeMenu() {
    setOpen(false)
  }

  // Touche Échap pour fermer le menu mobile.
  // L'écouteur est ajouté seulement quand le menu est ouvert, et retiré au nettoyage.
  useEffect(() => {
    if (!open) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <>
      {/* Barre du haut, visible uniquement sur mobile */}
      <header className="mobile-topbar d-lg-none">
        <button
          ref={toggleRef}
          type="button"
          className="icon-button"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          aria-controls="app-sidebar"
          onClick={() => setOpen((prev) => !prev)}
        >
          <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'}`} aria-hidden="true"></i>
        </button>
        <Brand onClick={closeMenu} />
      </header>

      <aside id="app-sidebar" className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="d-none d-lg-block">
          <Brand onClick={closeMenu} />
        </div>

        <nav className="sidebar__nav" aria-label="Navigation principale">
          <p className="sidebar__section">Menu</p>
          <ul className="list-unstyled mb-0">
            {LINKS.map((link) => {
              const count = link.badge ? badges[link.badge] : 0
              return (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) => `sidebar__link ${isActive ? 'active' : ''}`}
                    onClick={closeMenu}
                  >
                    <i className={`bi bi-${link.icon}`} aria-hidden="true"></i>
                    <span className="flex-grow-1">{link.label}</span>
                    {count > 0 && (
                      <span className="sidebar__badge">
                        <span aria-hidden="true">{count}</span>
                        <span className="visually-hidden">
                          {link.badge === 'favorites' ? `${count} favori(s)` : `${count} tâche(s) en cours`}
                        </span>
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <Link to="/revisions" className="sidebar__progress" onClick={closeMenu}>
          <span className="d-flex justify-content-between align-items-baseline mb-2">
            <span className="small fw-semibold">Ta progression</span>
            <span className="sidebar__percent">{progress}%</span>
          </span>
          <ProgressBar value={progress} size="sm" label="Progression des révisions" />
          <span className="d-block small text-muted-soft mt-2">
            {totalCount === 0
              ? 'Aucune tâche pour le moment'
              : `${doneCount} / ${totalCount} tâche(s) terminée(s)`}
          </span>
        </Link>

        <p className="sidebar__footer">
          Données livres : <a href="https://openlibrary.org" target="_blank" rel="noreferrer">Open Library</a>
        </p>
      </aside>

      {/* Fond sombre cliquable derrière le menu mobile */}
      {open && <div className="sidebar-backdrop d-lg-none" onClick={closeMenu} aria-hidden="true"></div>}
    </>
  )
}

export default Sidebar
