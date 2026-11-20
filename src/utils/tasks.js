import { daysUntil, isValidISODate } from './dates'

// Les deux statuts possibles d'une tâche.
export const STATUS = {
  PENDING: 'en-cours',
  DONE: 'terminee',
}

export const STATUS_LABELS = {
  [STATUS.PENDING]: 'En cours',
  [STATUS.DONE]: 'Terminée',
}

// Filtres de la page Révisions.
export const TASK_FILTERS = [
  { id: 'all', label: 'Toutes' },
  { id: STATUS.PENDING, label: 'En cours' },
  { id: STATUS.DONE, label: 'Terminées' },
]

// Vérifie qu'une tâche lue dans localStorage a bien la forme attendue
// (protection contre des données anciennes ou modifiées à la main).
export function isValidTask(task) {
  return (
    typeof task === 'object' &&
    task !== null &&
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    isValidISODate(task.dueDate) &&
    Object.values(STATUS).includes(task.status)
  )
}

export function isOverdue(task) {
  return task.status === STATUS.PENDING && daysUntil(task.dueDate) < 0
}

// Statistiques CALCULÉES à partir de la liste : on ne les stocke jamais dans le state.
export function getTaskStats(tasks) {
  const total = tasks.length
  const done = tasks.filter((task) => task.status === STATUS.DONE).length
  const overdue = tasks.filter(isOverdue).length
  return {
    total,
    done,
    pending: total - done,
    overdue,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
  }
}

// Tri pour l'affichage : en cours d'abord (échéance la plus proche en haut), puis terminées.
// On trie une COPIE ([...tasks]) : sort() modifierait le tableau du state.
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    if (a.status !== b.status) return a.status === STATUS.PENDING ? -1 : 1
    return a.dueDate.localeCompare(b.dueDate)
  })
}
