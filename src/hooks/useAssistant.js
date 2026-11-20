import { useState } from 'react'
import { askAssistant } from '../services/aiService'
import { createId } from '../utils/id'

function createMessage(role, text) {
  return { id: createId(), role, text }
}

/**
 * Toute la logique du chat avec l'IA.
 * Le hook est appelé UNE fois dans App : la bulle flottante et la page /assistant
 * reçoivent les mêmes données par props, donc elles partagent la même conversation.
 */
export function useAssistant() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) // { message, question } ou null

  async function send(question, history) {
    setLoading(true)
    setError(null)
    try {
      const answer = await askAssistant(question, history)
      setMessages((prev) => [...prev, createMessage('assistant', answer)])
    } catch (err) {
      setError({ message: err.message, question })
    } finally {
      setLoading(false)
    }
  }

  // Renvoie true si la question est envoyée, false si elle est refusée (vide ou IA occupée).
  function ask(question) {
    const text = question.trim()
    if (!text || loading) return false

    // Historique = messages AVANT la nouvelle question.
    // Si la question précédente a échoué, elle n'a pas de réponse : on ne l'envoie pas comme contexte.
    const history = error ? messages.slice(0, -1) : messages
    setMessages((prev) => [...prev, createMessage('user', text)])
    send(text, history)
    return true
  }

  // Renvoie la dernière question qui a échoué (elle est déjà affichée dans le chat).
  function retry() {
    if (!error || loading) return
    send(error.question, messages.slice(0, -1))
  }

  function clear() {
    if (loading) return
    setMessages([])
    setError(null)
  }

  return { messages, loading, error, ask, retry, clear }
}
