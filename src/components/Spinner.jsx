// Indicateur de chargement réutilisable.
function Spinner({ label = 'Chargement...' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="spinner-border text-accent" aria-hidden="true"></span>
      <span>{label}</span>
    </div>
  )
}

export default Spinner
