import { useState } from 'react'
import { MIN_QUERY_LENGTH } from '../services/openLibrary'

/**
 * Formulaire de recherche CONTRÔLÉ.
 * Le texte tapé est dans le state local `text`. La recherche n'est envoyée au parent
 * (onSearch) qu'au moment de la validation du formulaire.
 */
function SearchForm({ initialValue = '', onSearch }) {
  const [text, setText] = useState(initialValue)
  const [error, setError] = useState('')

  function handleChange(event) {
    setText(event.target.value)
    if (error) setError('') // on efface l'erreur dès que l'utilisateur corrige
  }

  function handleSubmit(event) {
    event.preventDefault()
    const query = text.trim()

    if (query.length > 0 && query.length < MIN_QUERY_LENGTH) {
      setError(`Tape au moins ${MIN_QUERY_LENGTH} caractères.`)
      return
    }
    onSearch(query)
  }

  function handleClear() {
    setText('')
    setError('')
    onSearch('')
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit} noValidate>
      <label htmlFor="search-input" className="visually-hidden">
        Rechercher une ressource
      </label>
      <div className="search-form__field">
        <i className="bi bi-search" aria-hidden="true"></i>
        <input
          id="search-input"
          type="search"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder="Titre, auteur ou sujet (ex. : react, python, Victor Hugo)"
          value={text}
          onChange={handleChange}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'search-error' : undefined}
          autoComplete="off"
        />
        {text && (
          <button type="button" className="search-form__clear" aria-label="Effacer la recherche" onClick={handleClear}>
            <i className="bi bi-x-circle-fill" aria-hidden="true"></i>
          </button>
        )}
      </div>
      <button type="submit" className="btn btn-primary">
        Rechercher
      </button>
      {error && (
        <p id="search-error" className="search-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}

export default SearchForm
