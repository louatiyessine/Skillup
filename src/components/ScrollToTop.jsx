import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// À chaque changement de page, on remonte en haut (comme un site classique).
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop
