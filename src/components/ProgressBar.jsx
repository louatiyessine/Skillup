// Barre de progression. `value` est un pourcentage CALCULÉ par le parent (0 à 100).
function ProgressBar({ value, label = 'Progression', size = 'md' }) {
  const percent = Math.min(100, Math.max(0, Math.round(value)))

  return (
    <div
      className={`progress-track progress-track--${size}`}
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress-fill" style={{ width: `${percent}%` }}></div>
    </div>
  )
}

export default ProgressBar
