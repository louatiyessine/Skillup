import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import { useAssistant } from './hooks/useAssistant'
import { useLocalStorage } from './hooks/useLocalStorage'
import AssistantPage from './pages/AssistantPage'
import FavoritesPage from './pages/FavoritesPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ResourceDetailPage from './pages/ResourceDetailPage'
import ResourcesPage from './pages/ResourcesPage'
import RevisionsPage from './pages/RevisionsPage'
import { isValidBook } from './services/openLibrary'
import { createId } from './utils/id'
import { getTaskStats, isValidTask, STATUS } from './utils/tasks'

/**
 * App possède l'état PARTAGÉ (favoris, tâches, conversation IA)
 * et le transmet aux pages par props, avec les fonctions pour le modifier.
 * Le cadre commun (Sidebar, chat, Toast) est dans MainLayout, qui affiche les pages avec <Outlet />.
 */
function App() {
  const [savedFavorites, setFavorites] = useLocalStorage('skillup.favorites', [])
  const [savedTasks, setTasks] = useLocalStorage('skillup.tasks', [])
  const assistant = useAssistant()

  // On ignore les éléments abîmés (données anciennes ou modifiées à la main) : ils feraient planter l'affichage.
  const favorites = savedFavorites.filter(isValidBook)
  const tasks = savedTasks.filter(isValidTask)
  const [toast, setToast] = useState(null)

  // La notification disparaît seule après 3 secondes.
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  function showToast(message, icon = 'check-circle-fill') {
    setToast({ id: createId(), message, icon })
  }

  // --- Favoris ---------------------------------------------------------------

  function handleToggleFavorite(book) {
    const alreadyFavorite = favorites.some((favorite) => favorite.id === book.id)

    if (alreadyFavorite) {
      // Retrait : filter() renvoie un NOUVEAU tableau sans ce livre.
      setFavorites((prev) => prev.filter((favorite) => favorite.id !== book.id))
      showToast('Retiré des favoris', 'heartbreak')
    } else {
      // Ajout sans doublon : on vérifie encore dans `prev` (valeur la plus récente).
      setFavorites((prev) =>
        prev.some((favorite) => favorite.id === book.id)
          ? prev
          : [...prev, { ...book, addedAt: new Date().toISOString() }],
      )
      showToast('Ajouté aux favoris', 'heart-fill')
    }
  }

  // --- Tâches ----------------------------------------------------------------

  function handleAddTask(taskData) {
    const newTask = {
      id: createId(), // identifiant unique et stable pour la `key`
      ...taskData,
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, newTask])
    showToast('Tâche ajoutée à tes révisions')
  }

  function handleToggleTask(taskId) {
    // map() + spread : on crée une copie modifiée de la tâche, jamais de mutation.
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === STATUS.DONE ? STATUS.PENDING : STATUS.DONE }
          : task,
      ),
    )
  }

  function handleDeleteTask(taskId) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    showToast('Tâche supprimée', 'trash3')
  }

  function handleClearCompleted() {
    setTasks((prev) => prev.filter((task) => task.status !== STATUS.DONE))
    showToast('Tâches terminées supprimées', 'trash3')
  }

  const stats = getTaskStats(tasks)

  // Props communes à la bulle flottante et à la page /assistant.
  const chatProps = {
    messages: assistant.messages,
    loading: assistant.loading,
    error: assistant.error,
    onAsk: assistant.ask,
    onRetry: assistant.retry,
    onClear: assistant.clear,
  }

  // Props de la barre latérale (badges et progression).
  const sidebarProps = {
    favoritesCount: favorites.length,
    pendingCount: stats.pending,
    progress: stats.percent,
    doneCount: stats.done,
    totalCount: stats.total,
  }

  return (
    <Routes>
      {/* Route PARENTE : MainLayout affiche le cadre commun (Sidebar, chat, Toast)
          et place la page enfant active dans son <Outlet />. */}
      <Route
        path="/"
        element={
          <MainLayout
            sidebarProps={sidebarProps}
            chatProps={chatProps}
            toast={toast}
            onCloseToast={() => setToast(null)}
          />
        }
      >
        {/* Routes ENFANTS : chemins relatifs au parent "/" */}
        <Route
          index
          element={
            <HomePage
              favorites={favorites}
              tasks={tasks}
              onAsk={assistant.ask}
              assistantBusy={assistant.loading}
            />
          }
        />
        <Route
          path="ressources"
          element={<ResourcesPage favorites={favorites} onToggleFavorite={handleToggleFavorite} />}
        />
        <Route
          path="ressources/:id"
          element={
            <ResourceDetailPage
              favorites={favorites}
              tasks={tasks}
              onToggleFavorite={handleToggleFavorite}
              onAddTask={handleAddTask}
              onAsk={assistant.ask}
              assistantBusy={assistant.loading}
            />
          }
        />
        <Route
          path="favoris"
          element={<FavoritesPage favorites={favorites} onToggleFavorite={handleToggleFavorite} />}
        />
        <Route
          path="revisions"
          element={
            <RevisionsPage
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onClearCompleted={handleClearCompleted}
            />
          }
        />
        <Route path="assistant" element={<AssistantPage {...chatProps} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
