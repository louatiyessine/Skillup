import Mascot from './Mascot'

// Affiché quand une liste est vide. `children` = boutons d'action facultatifs.
function EmptyState({ title, message, mood = 'sad', children }) {
  return (
    <div className="empty-state">
      <Mascot size={96} mood={mood} />
      <h2 className="h5 mt-3 mb-1">{title}</h2>
      {message && <p className="text-muted-soft mb-3">{message}</p>}
      {children}
    </div>
  )
}

export default EmptyState
