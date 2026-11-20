// Petites fonctions pour manipuler les dates au format « AAAA-MM-JJ »
// (le format utilisé par <input type="date">).

const DAY_MS = 24 * 60 * 60 * 1000

// Date du jour en heure locale. (toISOString() donnerait l'heure UTC.)
export function todayISO() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function parseISO(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function isValidISODate(iso) {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false
  const [year, month, day] = iso.split('-').map(Number)
  const date = parseISO(iso)
  // Refuse les dates impossibles comme le 31 février (JavaScript les décale au mois suivant).
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

export function addDays(iso, days) {
  const date = parseISO(iso)
  date.setDate(date.getDate() + days)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

// Nombre de jours entre aujourd'hui et la date (négatif = dépassée).
export function daysUntil(iso) {
  return Math.round((parseISO(iso) - parseISO(todayISO())) / DAY_MS)
}

export function formatDate(iso) {
  return parseISO(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Texte et couleur d'une échéance : « En retard de 2 j », « Demain »...
export function describeDeadline(iso) {
  const days = daysUntil(iso)
  if (days < 0) return { label: `En retard de ${-days} j`, tone: 'danger' }
  if (days === 0) return { label: "Aujourd'hui", tone: 'warning' }
  if (days === 1) return { label: 'Demain', tone: 'warning' }
  if (days <= 7) return { label: `Dans ${days} jours`, tone: 'info' }
  return { label: formatDate(iso), tone: 'muted' }
}
