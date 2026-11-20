import { useState } from 'react'
import { Link } from 'react-router-dom'
import { describeDeadline, formatDate } from '../utils/dates'
import { STATUS, STATUS_LABELS } from '../utils/tasks'

// Une tâche de la liste. Les modifications sont faites par le parent (callbacks).
function TaskItem({ task, onToggle, onDelete }) {
  // Suppression en deux clics pour éviter les erreurs.
  const [confirming, setConfirming] = useState(false)

  const isDone = task.status === STATUS.DONE
  const deadline = describeDeadline(task.dueDate)
  const checkboxId = `task-check-${task.id}`

  return (
    <li className={`task-item ${isDone ? 'is-done' : ''}`}>
      <input
        id={checkboxId}
        type="checkbox"
        className="form-check-input task-item__check"
        checked={isDone}
        onChange={() => onToggle(task.id)}
      />

      <div className="task-item__content">
        <label htmlFor={checkboxId} className="task-item__title">
          {task.title}
        </label>
        {task.description && <p className="task-item__description">{task.description}</p>}

        <div className="task-item__meta">
          <span className={`status-badge status-badge--${isDone ? 'done' : 'pending'}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span
            className={`deadline deadline--${isDone ? 'muted' : deadline.tone}`}
            title={`Échéance : ${formatDate(task.dueDate)}`}
          >
            <i className="bi bi-calendar-event me-1" aria-hidden="true"></i>
            {isDone ? formatDate(task.dueDate) : deadline.label}
          </span>
          {task.resourceId && (
            <Link to={`/ressources/${task.resourceId}`} className="task-item__link">
              <i className="bi bi-book me-1" aria-hidden="true"></i>
              Voir la ressource
            </Link>
          )}
        </div>
      </div>

      <div className="task-item__actions">
        {confirming ? (
          <>
            <button type="button" className="btn btn-sm btn-danger" onClick={() => onDelete(task.id)}>
              Supprimer
            </button>
            {/* autoFocus : le bouton poubelle a disparu, on place le focus clavier ici. */}
            <button
              type="button"
              className="btn btn-sm btn-outline-light"
              autoFocus
              onClick={() => setConfirming(false)}
            >
              Annuler
            </button>
          </>
        ) : (
          <button
            type="button"
            className="icon-button icon-button--sm icon-button--danger"
            aria-label={`Supprimer la tâche « ${task.title} »`}
            onClick={() => setConfirming(true)}
          >
            <i className="bi bi-trash3" aria-hidden="true"></i>
          </button>
        )}
      </div>
    </li>
  )
}

export default TaskItem
