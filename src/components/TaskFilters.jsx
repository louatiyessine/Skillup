import { TASK_FILTERS } from '../utils/tasks'

// Boutons Toutes / En cours / Terminées. `counts` = nombre de tâches par filtre.
function TaskFilters({ filter, counts, onChange }) {
  return (
    <div className="segmented" role="group" aria-label="Filtrer les tâches">
      {TASK_FILTERS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`segmented__item ${filter === item.id ? 'is-active' : ''}`}
          aria-pressed={filter === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
          <span className="segmented__count">{counts[item.id]}</span>
        </button>
      ))}
    </div>
  )
}

export default TaskFilters
