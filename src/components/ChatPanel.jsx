import { useEffect, useRef, useState } from 'react'
import { isAiConfigured } from '../services/aiService'
import CopyButton from './CopyButton'
import ErrorMessage from './ErrorMessage'
import Mascot from './Mascot'

const MAX_LENGTH = 1000

const SUGGESTIONS = [
  'Explique-moi useEffect avec un exemple simple',
  'Donne-moi une méthode pour bien réviser un examen',
  "C'est quoi une API REST ?",
  'Fais-moi un mini quiz sur le JavaScript',
]

/**
 * Le chat avec l'IA. Il est réutilisé à deux endroits :
 * la bulle flottante (compact) et la page /assistant (pleine page).
 * Les messages viennent du parent (props) ; seul le texte en cours de saisie est local.
 */
function ChatPanel({ messages, loading, error, onAsk, onRetry, onClear, compact = false, autoFocus = false }) {
  // Champ contrôlé : la valeur affichée vient toujours du state.
  const [question, setQuestion] = useState('')
  const listRef = useRef(null)

  const isEmpty = question.trim() === ''

  // Défilement automatique vers le dernier message.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages.length, loading, error])

  function handleSubmit(event) {
    event.preventDefault() // évite le rechargement de la page
    if (isEmpty || loading) return
    onAsk(question)
    setQuestion('')
  }

  // Entrée = envoyer, Maj + Entrée = retour à la ligne.
  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmit(event)
    }
  }

  return (
    <div className={`chat ${compact ? 'chat--compact' : ''}`}>
      {!isAiConfigured() && (
        <p className="chat-notice">
          <i className="bi bi-key me-1" aria-hidden="true"></i>
          Clé API absente : ajoute <code>VITE_AI_API_KEY</code> dans <code>.env.local</code>.
        </p>
      )}

      <div className="chat-messages" ref={listRef} aria-live="polite">
        {messages.length === 0 && !loading && !error && (
          <div className="chat-welcome">
            <Mascot size={compact ? 72 : 96} mood="happy" animated />
            <p className="chat-welcome__title">Salut, je suis Skilly !</p>
            <p className="text-muted-soft small mb-3">
              Pose-moi une question sur tes cours, je t'explique simplement.
            </p>
            <div className="chat-suggestions">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="chip"
                  onClick={() => onAsk(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) =>
          message.role === 'user' ? (
            <div key={message.id} className="chat-row chat-row--user">
              <p className="chat-bubble chat-bubble--user">{message.text}</p>
            </div>
          ) : (
            <div key={message.id} className="chat-row">
              <Mascot size={32} className="chat-avatar" />
              <div className="chat-answer">
                <p className="chat-answer__text">{message.text}</p>
                <CopyButton text={message.text} />
              </div>
            </div>
          ),
        )}

        {loading && (
          <div className="chat-row">
            <Mascot size={32} mood="thinking" className="chat-avatar" />
            <p className="chat-thinking">
              L'assistant réfléchit
              <span className="dots" aria-hidden="true">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </p>
          </div>
        )}

        {error && !loading && (
          <ErrorMessage title="L'assistant n'a pas pu répondre" message={error.message} onRetry={onRetry} />
        )}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <label htmlFor={compact ? 'chat-question-widget' : 'chat-question-page'} className="visually-hidden">
          Ta question
        </label>
        <textarea
          id={compact ? 'chat-question-widget' : 'chat-question-page'}
          className="form-control chat-input"
          rows={compact ? 2 : 3}
          maxLength={MAX_LENGTH}
          placeholder="Écris ta question... (Entrée pour envoyer)"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
        ></textarea>

        <div className="chat-form__footer">
          <button
            type="button"
            className="btn btn-sm btn-link text-muted-soft px-0"
            onClick={onClear}
            disabled={loading || messages.length === 0}
            aria-label="Nouvelle conversation"
            title="Nouvelle conversation"
          >
            <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true"></i>
            {/* En mode compact (et sur petit écran), on garde seulement l'icône. */}
            {!compact && <span className="d-none d-sm-inline">Nouvelle conversation</span>}
          </button>
          <span className="small text-muted-soft ms-auto me-2 d-none d-sm-inline" aria-hidden="true">
            {question.length}/{MAX_LENGTH}
          </span>
          {/* Désactivé si le champ est vide OU pendant le chargement */}
          <button type="submit" className="btn btn-primary btn-sm" disabled={isEmpty || loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
            ) : (
              <i className="bi bi-send me-1" aria-hidden="true"></i>
            )}
            Poser la question
          </button>
        </div>
      </form>
    </div>
  )
}

export default ChatPanel
