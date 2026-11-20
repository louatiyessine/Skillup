import { useState } from 'react'
import { isValidISODate, todayISO } from '../utils/dates'
import { STATUS, STATUS_LABELS } from '../utils/tasks'

const TITLE_MAX = 80
const DESCRIPTION_MAX = 300

// id HTML de chaque champ (pour le focus après une erreur).
const FIELD_IDS = {
  title: 'task-title',
  description: 'task-description',
  dueDate: 'task-due',
}

const EMPTY_FORM = {
  title: '',
  description: '',
  dueDate: '',
  status: STATUS.PENDING,
}

// Validation : renvoie un objet { champ: 'message' }. Objet vide = formulaire valide.
function validate(formData) {
  const errors = {}
  const title = formData.title.trim()

  if (!title) {
    errors.title = 'Le titre est obligatoire.'
  } else if (title.length < 3) {
    errors.title = 'Le titre doit contenir au moins 3 caractères.'
  }

  if (formData.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `${DESCRIPTION_MAX} caractères maximum.`
  }

  if (!formData.dueDate) {
    errors.dueDate = 'La date limite est obligatoire.'
  } else if (!isValidISODate(formData.dueDate)) {
    errors.dueDate = "Cette date n'est pas valide."
  } else if (formData.dueDate < todayISO()) {
    // Les dates « AAAA-MM-JJ » se comparent correctement comme du texte.
    errors.dueDate = 'La date limite ne peut pas être dans le passé.'
  }

  return errors
}

/**
 * Formulaire contrôlé d'ajout de tâche.
 * Un seul objet `formData` pour tous les champs + un objet `errors`.
 */
function TaskForm({ onAddTask }) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  // Un seul gestionnaire pour tous les champs grâce à l'attribut `name`.
  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    const newErrors = validate(formData)

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // On place le curseur sur le premier champ en erreur.
      const firstInvalid = ['title', 'description', 'dueDate'].find((field) => newErrors[field])
      document.getElementById(FIELD_IDS[firstInvalid])?.focus()
      return
    }

    onAddTask({
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate,
      status: formData.status,
    })
    setFormData(EMPTY_FORM) // réinitialisation
    setErrors({})
  }

  return (
    <form className="panel" onSubmit={handleSubmit} noValidate>
      <h2 className="panel__title">
        <i className="bi bi-plus-circle me-2" aria-hidden="true"></i>
        Nouvelle tâche
      </h2>

      <div className="mb-3">
        <label htmlFor="task-title" className="form-label">
          Titre <span className="text-danger" aria-hidden="true">*</span>
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          placeholder="Ex. : Réviser le chapitre 4 (useEffect)"
          maxLength={TITLE_MAX}
          value={formData.title}
          onChange={handleChange}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'task-title-error' : undefined}
          aria-required="true"
        />
        {errors.title && (
          <div id="task-title-error" className="invalid-feedback">
            {errors.title}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="task-description" className="form-label">
          Description <span className="text-muted-soft fw-normal">(facultative)</span>
        </label>
        <textarea
          id="task-description"
          name="description"
          rows={3}
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          placeholder="Ce que tu dois faire, les pages à relire..."
          value={formData.description}
          onChange={handleChange}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? 'task-description-help task-description-error' : 'task-description-help'
          }
        ></textarea>
        <div id="task-description-help" className="form-text">
          {formData.description.length}/{DESCRIPTION_MAX}
        </div>
        {errors.description && (
          <div id="task-description-error" className="invalid-feedback d-block">
            {errors.description}
          </div>
        )}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6">
          <label htmlFor="task-due" className="form-label">
            Date limite <span className="text-danger" aria-hidden="true">*</span>
          </label>
          <input
            id="task-due"
            name="dueDate"
            type="date"
            className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
            min={todayISO()}
            value={formData.dueDate}
            onChange={handleChange}
            aria-invalid={Boolean(errors.dueDate)}
            aria-describedby={errors.dueDate ? 'task-due-error' : undefined}
            aria-required="true"
          />
          {errors.dueDate && (
            <div id="task-due-error" className="invalid-feedback">
              {errors.dueDate}
            </div>
          )}
        </div>
        <div className="col-sm-6">
          <label htmlFor="task-status" className="form-label">
            Statut
          </label>
          <select
            id="task-status"
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
          >
            {Object.values(STATUS).map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        <i className="bi bi-plus-lg me-1" aria-hidden="true"></i>
        Ajouter la tâche
      </button>
    </form>
  )
}

export default TaskForm
