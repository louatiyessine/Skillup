// Filtre thématique : une « pastille » par domaine.
function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="category-filter" role="group" aria-label="Filtrer par domaine">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`chip ${category.id === selected ? 'is-active' : ''}`}
          aria-pressed={category.id === selected}
          onClick={() => onSelect(category.id)}
        >
          <i className={`bi bi-${category.icon}`} aria-hidden="true"></i>
          {category.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter
