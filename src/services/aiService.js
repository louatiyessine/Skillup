// Service de l'assistant IA.
// La clé n'est JAMAIS écrite ici : elle est lue dans .env.local (VITE_AI_API_KEY).
// Fournisseurs gérés : Google Gemini (par défaut) et Groq.

const API_KEY = import.meta.env.VITE_AI_API_KEY
const PROVIDER = (import.meta.env.VITE_AI_PROVIDER || 'gemini').toLowerCase()

const DEFAULT_MODELS = {
  gemini: 'gemini-3.5-flash-lite',
  groq: 'openai/gpt-oss-20b',
}
const MODEL = import.meta.env.VITE_AI_MODEL || DEFAULT_MODELS[PROVIDER] || DEFAULT_MODELS.gemini

const TIMEOUT_MS = 30000

// Nombre de messages précédents envoyés pour garder le contexte de la conversation.
const HISTORY_LENGTH = 6

const SYSTEM_PROMPT = `Tu es Skilly, l'assistant pédagogique de l'application SkillUp.
Tu aides des étudiants à apprendre et à réviser.
Réponds en français, de façon claire, bienveillante et concise (environ 10 lignes, sauf si on te demande plus).
Réponds en texte brut, sans Markdown : pas d'astérisques, pas de dièses, pas de tableaux.
Pour une liste, commence chaque ligne par un tiret simple.`

// La valeur d'exemple de .env.example compte comme « pas de clé ».
const PLACEHOLDER_KEY = 'votre_cle_ici'

export function isAiConfigured() {
  return Boolean(API_KEY) && API_KEY.trim() !== PLACEHOLDER_KEY
}

export function getAiInfo() {
  return {
    provider: PROVIDER === 'groq' ? 'Groq' : 'Google Gemini',
    model: MODEL,
    configured: isAiConfigured(),
  }
}

// --- Google Gemini -------------------------------------------------------

function buildGeminiRequest(question, history) {
  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
    },
    body: {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        ...history.map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.text }],
        })),
        { role: 'user', parts: [{ text: question }] },
      ],
    },
  }
}

function readGeminiAnswer(data) {
  const parts = data.candidates?.[0]?.content?.parts ?? []
  return parts
    .filter((part) => !part.thought)
    .map((part) => part.text ?? '')
    .join('')
}

// --- Groq (API compatible OpenAI) ---------------------------------------

function buildGroqRequest(question, history) {
  return {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: {
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map((message) => ({ role: message.role, content: message.text })),
        { role: 'user', content: question },
      ],
    },
  }
}

function readGroqAnswer(data) {
  return data.choices?.[0]?.message?.content ?? ''
}

// --- Erreurs --------------------------------------------------------------

const INVALID_KEY_MESSAGE =
  'Le service a refusé la demande : la clé API semble invalide. Vérifie VITE_AI_API_KEY dans .env.local.'

// Lit le message d'erreur renvoyé par l'API (s'il y en a un).
async function readApiError(response) {
  try {
    const data = await response.json()
    return data.error?.message ?? ''
  } catch {
    return ''
  }
}

function messageForStatus(status, apiMessage = '') {
  if (status === 401 || status === 403) return INVALID_KEY_MESSAGE
  if (status === 400) {
    // Gemini renvoie 400 (et non 401) quand la clé est fausse.
    return /api.?key/i.test(apiMessage) ? INVALID_KEY_MESSAGE : `Requête refusée par le service : ${apiMessage || 'erreur 400'}.`
  }
  if (status === 404) {
    return `Le modèle « ${MODEL} » est introuvable. Vérifie VITE_AI_MODEL dans .env.local.`
  }
  if (status === 429) {
    return 'Trop de questions en peu de temps. Attends une minute puis réessaie.'
  }
  if (status >= 500) {
    return "Le service d'IA est momentanément indisponible. Réessaie dans un instant."
  }
  return `Une erreur inattendue est survenue (code ${status}).`
}

// --- Fonction principale ---------------------------------------------------

/**
 * Envoie une question à l'IA et renvoie la réponse en texte brut.
 * @param {string} question la question de l'utilisateur
 * @param {{ role: 'user' | 'assistant', text: string }[]} history messages précédents
 * @returns {Promise<string>}
 */
export async function askAssistant(question, history = []) {
  if (!isAiConfigured()) {
    throw new Error(
      "L'assistant n'est pas encore configuré : ajoute VITE_AI_API_KEY dans le fichier .env.local, puis relance « npm run dev ».",
    )
  }

  const recentHistory = history.slice(-HISTORY_LENGTH)
  const request =
    PROVIDER === 'groq'
      ? buildGroqRequest(question, recentHistory)
      : buildGeminiRequest(question, recentHistory)

  // AbortController : on annule la requête si elle dure trop longtemps.
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    let response
    try {
      response = await fetch(request.url, {
        method: 'POST',
        headers: request.headers,
        body: JSON.stringify(request.body),
        signal: controller.signal,
      })
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error("L'assistant met trop de temps à répondre. Réessaie dans un instant.", {
          cause: error,
        })
      }
      throw new Error('Impossible de joindre le service. Vérifie ta connexion internet.', {
        cause: error,
      })
    }

    if (!response.ok) {
      throw new Error(messageForStatus(response.status, await readApiError(response)))
    }

    const data = await response.json()
    const answer = PROVIDER === 'groq' ? readGroqAnswer(data) : readGeminiAnswer(data)

    if (!answer.trim()) {
      throw new Error("L'assistant n'a pas pu répondre à cette question. Essaie de la reformuler.")
    }
    return answer.trim()
  } finally {
    clearTimeout(timer)
  }
}
