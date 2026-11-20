import { useEffect } from 'react'

// Met à jour le titre de l'onglet du navigateur : « Favoris · SkillUp ».
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · SkillUp` : 'SkillUp'
  }, [title])
}
