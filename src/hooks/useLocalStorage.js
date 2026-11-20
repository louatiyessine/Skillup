import { useEffect, useState } from 'react'

/**
 * Comme useState, mais la valeur est aussi sauvegardée dans localStorage.
 * Elle est donc conservée après un rafraîchissement de la page.
 *
 * Utilisation : const [tasks, setTasks] = useLocalStorage('skillup.tasks', [])
 */
export function useLocalStorage(key, initialValue) {
  // Fonction d'initialisation (« lazy initializer ») : lue UNE SEULE fois, au premier rendu.
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved === null) return initialValue

      const parsed = JSON.parse(saved)
      // Sécurité : si on attend un tableau et que la donnée sauvegardée n'en est pas un.
      if (Array.isArray(initialValue) && !Array.isArray(parsed)) return initialValue
      return parsed
    } catch {
      // JSON invalide ou localStorage bloqué : on repart de la valeur initiale.
      return initialValue
    }
  })

  // À chaque changement de la valeur, on la réécrit dans localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Stockage plein ou navigation privée : l'application continue de fonctionner.
    }
  }, [key, value])

  return [value, setValue]
}
