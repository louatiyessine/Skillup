import { useId } from 'react'

// Expressions du visage selon l'humeur de Skilly.
const FACES = {
  happy: {
    pupils: { dx: 0, dy: 2 },
    mouth: <path d="M51 84 Q60 93 69 84" className="mascot-line" />,
  },
  thinking: {
    pupils: { dx: 3, dy: -3 },
    mouth: <ellipse cx="62" cy="86" rx="4" ry="3.5" fill="#0F1229" />,
  },
  sad: {
    pupils: { dx: 0, dy: 4 },
    mouth: <path d="M52 89 Q60 82 68 89" className="mascot-line" />,
    brows: (
      <>
        <path d="M37 52 L50 56" className="mascot-line" />
        <path d="M83 52 L70 56" className="mascot-line" />
      </>
    ),
  },
  proud: {
    closedEyes: true,
    mouth: <path d="M48 82 Q60 97 72 82 Z" fill="#0F1229" />,
  },
}

/**
 * Skilly, la mascotte originale de SkillUp (SVG dessiné à la main).
 * @param {number} size  taille en pixels
 * @param {'happy'|'thinking'|'sad'|'proud'} mood humeur
 * @param {boolean} animated petite animation de flottement
 * @param {string} title texte alternatif (sinon l'image est décorative)
 */
function Mascot({ size = 120, mood = 'happy', animated = false, title, className = '' }) {
  // useId donne un identifiant unique : utile si plusieurs Skilly sont affichés en même temps.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const bodyId = `skilly-body-${uid}`
  const face = FACES[mood] ?? FACES.happy

  return (
    <svg
      className={`mascot ${animated ? 'mascot--float' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#818CF8" />
          <stop offset="1" stopColor="#4F46E5" />
        </linearGradient>
      </defs>

      {/* Ombre au sol */}
      <ellipse cx="60" cy="114" rx="30" ry="4" fill="#000" opacity="0.25" />

      {/* Pousse : la compétence qui grandit */}
      <path d="M60 30 V18" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 22 C50 8 34 12 37 22 C44 28 54 27 60 22 Z" fill="#5EEAD4" />
      <path d="M60 18 C70 2 88 8 84 18 C76 24 66 23 60 18 Z" fill="#2DD4BF" />

      {/* Bras */}
      <ellipse cx="19" cy="80" rx="6" ry="10" fill="#5457E8" transform="rotate(25 19 80)" />
      <ellipse cx="101" cy="80" rx="6" ry="10" fill="#5457E8" transform="rotate(-25 101 80)" />

      {/* Corps */}
      <path
        d="M60 28 C88 28 104 48 104 72 C104 96 84 110 60 110 C36 110 16 96 16 72 C16 48 32 28 60 28 Z"
        fill={`url(#${bodyId})`}
      />
      <ellipse cx="40" cy="46" rx="9" ry="5" fill="#fff" opacity="0.22" transform="rotate(-30 40 46)" />
      <ellipse cx="60" cy="96" rx="22" ry="8" fill="#fff" opacity="0.07" />

      {/* Yeux */}
      {face.closedEyes ? (
        <>
          <path d="M37 68 Q45 59 53 68" className="mascot-line" />
          <path d="M67 68 Q75 59 83 68" className="mascot-line" />
        </>
      ) : (
        <>
          <ellipse cx="45" cy="66" rx="10" ry="11" fill="#fff" />
          <ellipse cx="75" cy="66" rx="10" ry="11" fill="#fff" />
          <circle cx={46 + face.pupils.dx} cy={66 + face.pupils.dy} r="5" fill="#0F1229" />
          <circle cx={76 + face.pupils.dx} cy={66 + face.pupils.dy} r="5" fill="#0F1229" />
          <circle cx={48 + face.pupils.dx} cy={64 + face.pupils.dy} r="1.6" fill="#fff" />
          <circle cx={78 + face.pupils.dx} cy={64 + face.pupils.dy} r="1.6" fill="#fff" />
        </>
      )}
      {face.brows}

      {/* Joues */}
      <ellipse cx="33" cy="80" rx="6" ry="3.5" fill="#5EEAD4" opacity="0.45" />
      <ellipse cx="87" cy="80" rx="6" ry="3.5" fill="#5EEAD4" opacity="0.45" />

      {face.mouth}

      {/* Bulles de réflexion */}
      {mood === 'thinking' && (
        <g className="mascot-thought" fill="#5EEAD4">
          <circle cx="100" cy="34" r="3" />
          <circle cx="108" cy="24" r="4" />
          <circle cx="114" cy="12" r="5" />
        </g>
      )}

      {/* Étincelles de fierté */}
      {mood === 'proud' && (
        <g fill="#FDE68A">
          <path d="M100 26 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" />
          <path d="M18 34 l1.5 3.5 3.5 1.5 -3.5 1.5 -1.5 3.5 -1.5 -3.5 -3.5 -1.5 3.5 -1.5 Z" />
        </g>
      )}
    </svg>
  )
}

export default Mascot
