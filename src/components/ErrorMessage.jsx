// Message d'erreur réutilisable, avec un bouton « Réessayer » facultatif.
function ErrorMessage({ title = 'Oups, un problème est survenu', message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <i className="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
      <div className="flex-grow-1">
        <p className="error-box__title">{title}</p>
        <p className="mb-0">{message}</p>
      </div>
      {onRetry && (
        <button type="button" className="btn btn-sm btn-outline-light" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
          Réessayer
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
