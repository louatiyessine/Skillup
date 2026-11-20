// Crée un identifiant unique pour une tâche, un message...
// crypto.randomUUID() n'existe que sur https ou localhost : on prévoit une solution de secours
// (par exemple si l'application est ouverte depuis un téléphone via l'adresse IP du PC).
export function createId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
