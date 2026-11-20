import { useParams } from 'react-router-dom'

function ResourceDetailPage() {
  const { id } = useParams()

  return (
    <section>
      <h1 className="h3">Détail de la ressource</h1>
      <p>Identifiant : {id}</p>
    </section>
  )
}

export default ResourceDetailPage