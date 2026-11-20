import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ResourcesPage from './pages/ResourcesPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import RevisionsPage from './pages/RevisionsPage'
import AssistantPage from './pages/AssistantPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/ressources" element={<ResourcesPage />} />
          <Route path="/ressources/:id" element={<ResourceDetailPage />} />
          <Route path="/favoris" element={<FavoritesPage />} />
          <Route path="/revisions" element={<RevisionsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App