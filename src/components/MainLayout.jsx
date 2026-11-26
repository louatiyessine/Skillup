import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import ChatWidget from './ChatWidget'
import Sidebar from './Sidebar'
import Toast from './Toast'

/**
 * MainLayout = le "cadre" commun à toutes les pages (chapitre 7 : layouts imbriqués).
 * La Sidebar, la bulle de chat et le Toast restent affichés en permanence.
 * <Outlet /> est l'emplacement où React Router affiche la page de la route enfant active.
 */
function MainLayout({ sidebarProps, chatProps, toast, onCloseToast }) {
  const { pathname } = useLocation()

  // À chaque changement de page, on remonte en haut (comme un site classique).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Sur /assistant, le chat est déjà en pleine page : pas de bulle flottante.
  const showChatWidget = pathname !== '/assistant'

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Aller au contenu
      </a>

      <Sidebar {...sidebarProps} />

      <main id="main-content" className="app-main" tabIndex={-1}>
        <div className="app-container">
          {/* Ici s'affiche HomePage, ResourcesPage, FavoritesPage... selon l'URL */}
          <Outlet />
        </div>
      </main>

      {showChatWidget && <ChatWidget {...chatProps} />}
      <Toast toast={toast} onClose={onCloseToast} />
    </div>
  )
}

export default MainLayout
