import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import Mascot from '../components/Mascot'
import PageHeader from '../components/PageHeader'
import ProgressBar from '../components/ProgressBar'
import TaskFilters from '../components/TaskFilters'
import TaskForm from '../components/TaskForm'
import TaskList from '../components/TaskList'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getTaskStats, sortTasks, STATUS } from '../utils/tasks'

function progressMessage(stats) {
  if (stats.total === 0) return 'Ajoute ta première tâche pour commencer.'
  if (stats.percent === 100) return 'Tout est terminé, bravo ! 🎉'
  if (stats.overdue > 0) return `${stats.overdue} tâche(s) en retard : on s'y met ?`
  if (stats.percent >= 50) return 'Plus de la moitié, continue comme ça !'
  return 'Chaque tâche cochée te rapproche du but.'
}

function RevisionsPage({ tasks, onAddTask, onToggleTask, onDeleteTask, onClearCompleted }) {
  useDocumentTitle('Révisions')

  const [filter, setFilter] = useState('all')

  function handleClearCompleted() {
    // Confirmation, comme pour la suppression d'une seule tâche.
    if (window.confirm(`Supprimer les ${stats.done} tâche(s) terminée(s) ?`)) onClearCompleted()
  }

  // Valeurs dérivées (calculées) : pas de state en double.
  const stats = getTaskStats(tasks)
  const counts = { all: stats.total, [STATUS.PENDING]: stats.pending, [STATUS.DONE]: stats.done }
  const visibleTasks = sortTasks(filter === 'all' ? tasks : tasks.filter((task) => task.status === filter))

  return (
    <section>
      <PageHeader icon="check2-square" title="Révisions" subtitle="Planifie tes révisions et suis ta progression." />

      <div className="row g-4">
        <div className="col-lg-5">
          <TaskForm onAddTask={onAddTask} />
        </div>

        <div className="col-lg-7">
          <div className="panel progress-panel mb-4">
            <Mascot size={72} mood={stats.total > 0 && stats.percent === 100 ? 'proud' : 'happy'} />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-baseline mb-2">
                <h2 className="panel__title mb-0">Progression</h2>
                <span className="progress-panel__percent">{stats.percent}%</span>
              </div>
              <ProgressBar value={stats.percent} label="Pourcentage de tâches terminées" />
              <p className="small text-muted-soft mt-2 mb-0">
                {stats.done} / {stats.total} terminée(s) · {progressMessage(stats)}
              </p>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
            <TaskFilters filter={filter} counts={counts} onChange={setFilter} />
            {stats.done > 0 && (
              <button type="button" className="btn btn-sm btn-link text-muted-soft" onClick={handleClearCompleted}>
                <i className="bi bi-trash3 me-1" aria-hidden="true"></i>
                Supprimer les terminées
              </button>
            )}
          </div>

          {visibleTasks.length > 0 ? (
            <TaskList tasks={visibleTasks} onToggle={onToggleTask} onDelete={onDeleteTask} />
          ) : (
            <EmptyState
              mood={tasks.length === 0 ? 'happy' : 'thinking'}
              title={tasks.length === 0 ? 'Aucune tâche pour le moment' : 'Aucune tâche dans ce filtre'}
              message={
                tasks.length === 0
                  ? 'Utilise le formulaire pour planifier ta première révision.'
                  : filter === STATUS.DONE
                    ? "Tu n'as encore terminé aucune tâche."
                    : 'Toutes tes tâches sont terminées !'
              }
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default RevisionsPage
