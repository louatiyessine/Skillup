import ChatPanel from '../components/ChatPanel'
import PageHeader from '../components/PageHeader'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { getAiInfo } from '../services/aiService'

// Même chat que la bulle flottante, mais en pleine page.
function AssistantPage({ messages, loading, error, onAsk, onRetry, onClear }) {
  useDocumentTitle('Assistant IA')
  const info = getAiInfo()

  return (
    <section>
      <PageHeader
        icon="stars"
        title="Assistant IA"
        subtitle="Pose tes questions de cours à Skilly et reçois une explication claire."
      />

      <div className="row g-4">
        <div className="col-xl-8">
          <div className="panel p-0 assistant-panel">
            <ChatPanel
              messages={messages}
              loading={loading}
              error={error}
              onAsk={onAsk}
              onRetry={onRetry}
              onClear={onClear}
            />
          </div>
        </div>

        <aside className="col-xl-4">
          <div className="panel mb-4">
            <h2 className="panel__title">
              <i className="bi bi-lightbulb me-2" aria-hidden="true"></i>
              Bien poser sa question
            </h2>
            <ul className="tips-list">
              <li>Donne le contexte : « En React, ... »</li>
              <li>Demande un exemple concret ou une analogie.</li>
              <li>Demande un quiz pour vérifier que tu as compris.</li>
              <li>Vérifie toujours la réponse avec ton cours : l'IA peut se tromper.</li>
            </ul>
          </div>

          <div className="panel">
            <h2 className="panel__title">
              <i className="bi bi-cpu me-2" aria-hidden="true"></i>
              Service utilisé
            </h2>
            <dl className="info-list">
              <dt>Fournisseur</dt>
              <dd>{info.provider}</dd>
              <dt>Modèle</dt>
              <dd>
                <code>{info.model}</code>
              </dd>
              <dt>Clé API</dt>
              <dd>
                {info.configured ? (
                  <span className="text-accent">
                    <i className="bi bi-check-circle me-1" aria-hidden="true"></i>
                    Configurée (.env.local)
                  </span>
                ) : (
                  <span className="text-warning">
                    <i className="bi bi-exclamation-circle me-1" aria-hidden="true"></i>
                    Manquante
                  </span>
                )}
              </dd>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default AssistantPage
