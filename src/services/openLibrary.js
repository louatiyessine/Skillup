// Service Open Library : toutes les requêtes vers l'API publique sont ici.
// Les composants ne connaissent pas les URL : ils appellent seulement ces fonctions.

const BASE_URL = 'https://openlibrary.org'
const COVERS_URL = 'https://covers.openlibrary.org/b/id'
const SEARCH_FIELDS = 'key,title,author_name,first_publish_year,cover_i,subject'

export const PAGE_SIZE = 24

// Au-delà de ce délai, on abandonne la requête et on affiche une erreur.
const TIMEOUT_MS = 15000

// Longueur minimale d'une recherche texte (l'API refuse moins de 3 caractères).
export const MIN_QUERY_LENGTH = 3

// Sujet utilisé quand l'utilisateur n'a rien cherché et n'a choisi aucun domaine.
export const DEFAULT_SUBJECT = 'programming'

// Domaines proposés dans le filtre. `subject` = valeur envoyée à l'API.
export const CATEGORIES = [
  { id: 'all', label: 'Tous', icon: 'grid', subject: '' },
  { id: 'programmation', label: 'Programmation', icon: 'code-slash', subject: 'programming' },
  { id: 'web', label: 'Web', icon: 'globe2', subject: 'web site development' },
  { id: 'ia', label: 'IA & Data', icon: 'cpu', subject: 'artificial intelligence' },
  { id: 'maths', label: 'Mathématiques', icon: 'calculator', subject: 'mathematics' },
  { id: 'sciences', label: 'Sciences', icon: 'radioactive', subject: 'science' },
  { id: 'design', label: 'Design', icon: 'palette', subject: 'design' },
  { id: 'business', label: 'Business', icon: 'briefcase', subject: 'business' },
  { id: 'langues', label: 'Langues', icon: 'translate', subject: 'language and languages' },
  { id: 'psychologie', label: 'Psychologie', icon: 'lightbulb', subject: 'psychology' },
]

export function findCategory(id) {
  return CATEGORIES.find((category) => category.id === id) ?? CATEGORIES[0]
}

// fetch avec une limite de temps (AbortController annule la requête).
async function fetchWithTimeout(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { signal: controller.signal })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Open Library met trop de temps à répondre', { cause: error })
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

// Vérifie qu'un favori lu dans localStorage a la forme attendue.
export function isValidBook(book) {
  return (
    typeof book === 'object' &&
    book !== null &&
    typeof book.id === 'string' &&
    typeof book.title === 'string' &&
    typeof book.author === 'string'
  )
}

// Transforme un résultat brut de l'API en objet simple pour nos composants.
function normalizeBook(doc) {
  return {
    id: doc.key.replace('/works/', ''),
    title: doc.title ?? 'Titre inconnu',
    author: doc.author_name?.slice(0, 2).join(', ') || 'Auteur inconnu',
    year: doc.first_publish_year ?? null,
    coverId: doc.cover_i ?? null,
    subjects: uniqueSubjects(doc.subject).slice(0, 8),
  }
}

// Supprime les sujets en double (ils servent de `key` dans les listes)
// et les cotes de bibliothèque illisibles comme « Qa76.9.u83 ».
function uniqueSubjects(subjects = []) {
  const readable = subjects
    .map((subject) => subject.trim())
    .filter((subject) => subject && !/^[a-z]{1,3}\d+\.\d/i.test(subject)) // garde « CSS3 », retire « Qa76.9.u83 »
  return [...new Set(readable)]
}

/**
 * Recherche des livres.
 * @param {string} query   texte recherché (peut être vide si `subject` est fourni)
 * @param {string} subject sujet Open Library (filtre par domaine)
 * @param {number} page    numéro de page (1, 2, 3...)
 * @returns {Promise<{ books: object[], total: number }>}
 */
export async function searchBooks(query, subject = '', page = 1) {
  const params = new URLSearchParams({
    limit: PAGE_SIZE,
    page,
    fields: SEARCH_FIELDS,
  })
  if (query) params.set('q', query)
  if (subject) params.set('subject', subject)

  const response = await fetchWithTimeout(`${BASE_URL}/search.json?${params}`)
  if (response.status === 422) {
    throw new Error('recherche non acceptée par Open Library, essaie avec d\'autres mots')
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`)
  }

  const data = await response.json()
  return {
    books: data.docs.map(normalizeBook),
    total: data.numFound ?? 0,
  }
}

// La description peut être une chaîne OU un objet { type, value }.
function readDescription(description) {
  const text = typeof description === 'string' ? description : description?.value ?? ''
  return text
    .split(/\r?\n-{3,}/)[0] // retire les blocs « ---------- » ajoutés en bas par Open Library
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [texte](lien) -> texte
    .replace(/\[\s*\(?source\)?\s*\]\[\d+\]/gi, '') // retire « [(Source)][1] »
    .replace(/\[([^\]]*)\]\[\d+\]/g, '$1') // [texte][1] -> texte
    .replace(/\[\d+\]:\s*\S+/g, '') // retire les notes « [1]: https://... »
    .trim()
}

// Récupère le nom d'un auteur à partir de sa clé (« /authors/OL34184A »).
async function fetchAuthorName(authorKey) {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}${authorKey}.json`)
    if (!response.ok) return null
    const data = await response.json()
    return data.name ?? data.personal_name ?? null
  } catch {
    return null // un auteur introuvable ne doit pas bloquer la page
  }
}

/**
 * Détail d'une œuvre : /works/{id}.json, puis les noms des auteurs.
 * @param {string} id identifiant de l'œuvre, par exemple « OL45804W »
 */
export async function getWork(id, redirects = 0) {
  const notFound = "Cette ressource n'existe pas (ou plus) sur Open Library."
  const response = await fetchWithTimeout(`${BASE_URL}/works/${encodeURIComponent(id)}.json`)
  if (response.status === 404) throw new Error(notFound)
  if (!response.ok) {
    throw new Error(`Erreur HTTP : ${response.status}`)
  }

  const data = await response.json()

  // Œuvre fusionnée avec une autre : Open Library renvoie une « redirection ».
  if (data.type?.key === '/type/redirect' && data.location && redirects < 2) {
    const work = await getWork(data.location.replace('/works/', ''), redirects + 1)
    return { ...work, id } // on garde l'id de l'URL (celui des favoris et des tâches)
  }
  if (data.type?.key !== '/type/work') throw new Error(notFound)

  // `authors` ne contient que des clés : on va chercher les noms (3 maximum).
  const authorKeys = (data.authors ?? [])
    .map((entry) => entry.author?.key)
    .filter(Boolean)
    .slice(0, 3)
  const names = await Promise.all(authorKeys.map(fetchAuthorName))

  const year = data.first_publish_date?.match(/\d{4}/)?.[0]

  return {
    id,
    title: data.title ?? 'Titre inconnu',
    description: readDescription(data.description),
    subjects: uniqueSubjects(data.subjects).slice(0, 16),
    coverId: data.covers?.find((cover) => cover > 0) ?? null,
    authors: names.filter(Boolean),
    year: year ? Number(year) : null,
    url: `${BASE_URL}/works/${encodeURIComponent(id)}`,
  }
}

// URL de couverture. Tailles : 'S', 'M' ou 'L'.
export function getCoverUrl(coverId, size = 'M') {
  return coverId ? `${COVERS_URL}/${coverId}-${size}.jpg` : null
}

// Choisit un sujet lisible pour l'afficher comme « domaine » sur une carte.
export function pickDomain(subjects) {
  const readable = subjects.find(
    (subject) => subject.length <= 28 && !/\d/.test(subject) && !subject.includes('--'),
  )
  return readable ?? 'Général'
}

// Message clair pour l'utilisateur, quelle que soit l'erreur technique.
export function friendlyNetworkError(error) {
  if (error instanceof TypeError) {
    return 'Impossible de contacter Open Library. Vérifie ta connexion internet.'
  }
  return `Le chargement a échoué (${error.message}). Réessaie dans un instant.`
}
