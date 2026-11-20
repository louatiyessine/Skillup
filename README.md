# SkillUp

Application web d'apprentissage réalisée en React (Vite) dans le cadre du module **Frameworks Web (React.js)**, 3ème Licence GLSI, IIT Sfax.

**Binôme** : Yessine Louati et Mouhamed Chaabouni.

## Fonctionnalités

| Module | Route | Contenu |
|---|---|---|
| Catalogue | `/ressources`, `/ressources/:id` | API Open Library, recherche (formulaire contrôlé), filtre par domaine, détail, chargement / erreurs / résultats vides, « Voir plus » |
| Favoris | `/favoris` | Ajout / retrait sans doublon, `localStorage`, filtre et tri |
| Révisions | `/revisions` | Tâches avec validation, statut, filtres, barre de progression, `localStorage` |
| Assistant IA | `/assistant` + bulle flottante | Gemini ou Groq, clé dans `.env.local`, chargement, erreurs, texte brut |
| Navigation | toutes | Barre latérale avec `NavLink`, burger mobile, responsive, accueil avec statistiques |

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis coller la clé API dans .env.local
npm run dev
```

Voir `README.txt` pour les instructions détaillées.

## Stack

React 19, React Router 7, Vite 8, Bootstrap 5 (CSS) + Bootstrap Icons, JavaScript.
