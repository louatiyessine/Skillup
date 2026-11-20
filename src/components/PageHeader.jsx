// En-tête commun à toutes les pages : icône, titre, sous-titre et actions.
function PageHeader({ icon, title, subtitle, children }) {
  return (
    <header className="page-header">
      <div className="d-flex align-items-center gap-3">
        <span className="page-header__icon" aria-hidden="true">
          <i className={`bi bi-${icon}`}></i>
        </span>
        <div>
          <h1 className="page-header__title">{title}</h1>
          {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="page-header__actions">{children}</div>}
    </header>
  )
}

export default PageHeader
