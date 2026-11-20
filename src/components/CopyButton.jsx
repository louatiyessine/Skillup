import { useEffect, useState } from 'react'

// Bouton qui copie un texte dans le presse-papiers et affiche « Copié » 2 secondes.
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  // Quand `copied` passe à true, on lance un minuteur pour revenir à false.
  // Le nettoyage annule le minuteur si le composant disparaît avant.
  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
    } catch {
      // Presse-papiers indisponible : on ne fait rien.
    }
  }

  return (
    <button
      type="button"
      className="chat-copy"
      onClick={handleCopy}
      aria-label={copied ? 'Réponse copiée' : 'Copier la réponse'}
    >
      <i className={`bi ${copied ? 'bi-check2' : 'bi-copy'}`} aria-hidden="true"></i>
      <span>{copied ? 'Copié' : 'Copier'}</span>
    </button>
  )
}

export default CopyButton
