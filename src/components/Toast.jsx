// Petite notification en bas de l'écran. Elle disparaît seule (minuteur dans App).
// La zone role="status" reste toujours affichée : les lecteurs d'écran annoncent
// mieux un message qui APPARAÎT dans une zone déjà présente.
function Toast({ toast, onClose }) {
  return (
    <div role="status" className="toast-region">
      {toast && (
        <div className="app-toast" key={toast.id}>
          <i className={`bi bi-${toast.icon}`} aria-hidden="true"></i>
          <span>{toast.message}</span>
          <button
            type="button"
            className="btn-close btn-close-white ms-2"
            aria-label="Fermer la notification"
            onClick={onClose}
          ></button>
        </div>
      )}
    </div>
  )
}

export default Toast
