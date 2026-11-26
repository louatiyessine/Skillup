import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ChatPanel from './ChatPanel'
import Mascot from './Mascot'

// Bouton flottant en bas à droite qui ouvre le chat dans un petit panneau.
// (Il n'est pas affiché sur /assistant : c'est MainLayout qui décide.)
function ChatWidget({ messages, loading, error, onAsk, onRetry, onClear }) {
  const [open, setOpen] = useState(false)
  // Référence vers le bouton rond : on lui rend le focus à la fermeture (accessibilité clavier).
  const fabRef = useRef(null)

  function closeChat() {
    setOpen(false)
    fabRef.current?.focus()
  }

  // Échap ferme le panneau.
  useEffect(() => {
    if (!open) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false)
        fabRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <div className="chat-widget">
      {open && (
        <section id="chat-widget-panel" className="chat-widget__panel" aria-label="Assistant IA">
          <header className="chat-widget__header">
            <Mascot size={34} />
            <div className="flex-grow-1">
              <p className="mb-0 fw-semibold">Skilly</p>
              <p className="mb-0 small text-muted-soft">Assistant IA</p>
            </div>
            <Link
              to="/assistant"
              className="icon-button icon-button--sm"
              aria-label="Ouvrir en plein écran"
              title="Ouvrir en plein écran"
              onClick={() => setOpen(false)}
            >
              <i className="bi bi-arrows-angle-expand" aria-hidden="true"></i>
            </Link>
            <button
              type="button"
              className="icon-button icon-button--sm"
              aria-label="Fermer l'assistant"
              onClick={closeChat}
            >
              <i className="bi bi-x-lg" aria-hidden="true"></i>
            </button>
          </header>
          <ChatPanel
            compact
            autoFocus
            messages={messages}
            loading={loading}
            error={error}
            onAsk={onAsk}
            onRetry={onRetry}
            onClear={onClear}
          />
        </section>
      )}

      <button
        ref={fabRef}
        type="button"
        className={`chat-widget__fab ${open ? 'is-open' : ''}`}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant IA"}
        aria-expanded={open}
        aria-controls={open ? 'chat-widget-panel' : undefined}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <i className="bi bi-chevron-down" aria-hidden="true"></i>
        ) : (
          <Mascot size={44} mood={loading ? 'thinking' : 'happy'} />
        )}
        {loading && !open && <span className="chat-widget__pulse" aria-hidden="true"></span>}
      </button>
    </div>
  )
}

export default ChatWidget
