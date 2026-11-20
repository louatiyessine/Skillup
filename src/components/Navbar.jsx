import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/ressources', label: 'Ressources' },
  { to: '/favoris', label: 'Favoris' },
  { to: '/revisions', label: 'Révisions' },
  { to: '/assistant', label: 'Assistant IA' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar navbar-expand-lg app-navbar" data-bs-theme="dark">
      <div className="container">
        <NavLink className="navbar-brand fw-bold" to="/" onClick={() => setOpen(false)}>
          SkillUp
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            {links.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar