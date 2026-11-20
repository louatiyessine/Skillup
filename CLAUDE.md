# SkillUp : contexte du projet et état d'avancement

> Fichier de passation, à la **racine du projet** : Claude Code le lit automatiquement au démarrage.
> Dernière mise à jour : vendredi 20 novembre 2026 (soir).

---

## 1. Qui, quoi, quand

- **Étudiants** : Yessine (GitHub `louatiyessine`, appelé **A**) et Mouhamed Chaabouni (**B**), en binôme.
- **Formation** : 3ème Licence GLSI, IIT Sfax, année 2026-2027. Module **Frameworks Web (React.js)**, enseignante : Ameni Hadrich.
- **Projet** : application web d'apprentissage **SkillUp**, évaluation pratique = **30 %** du DS (l'écrit compte **70 %**).
- **Soutenance** : **2 décembre 2026**, 10 minutes : démo en direct, puis **questions individuelles sur le code** (choix des Hooks, gestion des états, architecture des composants). Chaque étudiant doit pouvoir expliquer **tout** le code, y compris la partie de l'autre.
- **Objectif interne** : tout terminer avant le **27-28 novembre**.
- **Dépôt GitHub** : `https://github.com/louatiyessine/Skillup` (public, Mouhamed est collaborateur).
- **Dossier local de A** : `C:\licence informatique\GLSI 3EME ANNER\REACT\skillup` (Windows, chemin avec espaces).
- **Outils** : Vite 8, React 19, React Router 7, JavaScript (pas de TypeScript), npm, VS Code, PowerShell.
- Mouhamed a eu l'erreur PowerShell « exécution de scripts désactivée » : corrigée avec `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.

---

## 2. Comment travailler avec ces étudiants (important)

Ce sont des **étudiants qui apprennent**. Le but n'est pas seulement un projet qui marche, c'est qu'ils **comprennent chaque ligne** pour l'oral.

Préférences exprimées :
1. **Répondre en français**, simple, phrases courtes.
2. **Un seul pas à la fois** quand on enseigne. Donner les étapes et le code, puis **attendre** « next ».
3. **Quand ils demandent une explication** (« explique », « plus ») : expliquer **ligne par ligne**, puis ce que fait chaque méthode ou mot-clé, puis **pourquoi**. Exemple concret et images simples.
4. Format d'une étape : **ce que je fais → le code → (explication seulement si demandée)**.
5. Réponses courtes, l'essentiel d'abord.
6. Donner les **vérifications attendues** (« tu dois voir... ») et demander le résultat ou l'erreur complète.
7. Rappeler les **bonnes pratiques** et les erreurs fréquentes quand c'est utile.
8. Termes techniques usuels en anglais, avec une courte explication au besoin.
9. Mascotte et logo **originaux** (pas de copie d'identité visuelle).

**Changement du 20 novembre** : à la demande de Yessine, Claude Code a écrit **tout le projet d'un coup** (au lieu du pas à pas). Les étudiants vont relire et décider des changements. Priorité maintenant : **les aider à comprendre chaque fichier** pour l'oral (explications fichier par fichier, ligne par ligne sur demande).

---

## 3. Cahier des charges (résumé fidèle)

**Stack imposée** : Vite + React 18+, JavaScript ou TypeScript, **composants fonctionnels uniquement**, `useState` et `useEffect` **obligatoires** (tableaux de dépendances rigoureux).

**Contraintes techniques** : immutabilité (pas de `push`, `splice`... sur le state) ; données et callbacks **par props** ; `key` unique et stable dans chaque `map()` ; arborescence `/src/components`, `/src/pages`, `/src/services`, `/src/styles`.

**Option A (binôme)** : les 5 modules, avec détail `/ressources/:id`, barre de progression des tâches, accueil avec aperçu d'activité.

- **Module 1, catalogue** : cartes (titre, auteur, domaine), recherche par **formulaire contrôlé**, au moins **un filtre thématique**, vue `/ressources/:id`, message si résultats vides, spinner + erreurs. API Open Library.
- **Module 2, favoris** : bouton ajouter/retirer sur chaque carte, **pas de doublons**, page `/favoris`, **localStorage**, affichage réactif.
- **Module 3, révisions** : tâche = titre (obligatoire), description (facultative), date limite, statut (En cours / Terminée). Formulaire contrôlé + validation + messages d'erreur, bascule du statut, suppression, filtres Toutes / En cours / Terminées, **barre de progression**, **localStorage**.
- **Module 4, assistant IA** : champ contrôlé, bouton « Poser la question » **désactivé si vide**, indicateur « L'assistant réfléchit... » et bouton désactivé pendant l'appel, message d'erreur convivial, réponse en texte brut dans un encadré. Clé **jamais en dur** : `.env.local` (`VITE_AI_API_KEY`), lue avec `import.meta.env`.
- **Module 5, navigation et UX** : au moins 5 routes (`/`, `/ressources`, `/favoris`, `/revisions`, `/assistant`), barre de navigation persistante avec **`NavLink`**, responsive, accueil avec **statistiques**.
- **Livrable** : `.zip` **sans `node_modules`**, **`README.txt` à la racine** (noms + `npm install`, `.env.local`, `npm run dev`), soutenance de 10 minutes.

---

## 4. Décisions prises

| Sujet | Choix |
|---|---|
| Langage | JavaScript |
| CSS | Bootstrap (CSS seulement, via npm) + `theme.css` perso + Bootstrap Icons |
| API livres | Open Library |
| IA | **Gemini par défaut** (`gemini-3.5-flash-lite`), **Groq possible** (`VITE_AI_PROVIDER=groq`, modèle `openai/gpt-oss-20b`). Modèle modifiable avec `VITE_AI_MODEL`. |
| Navigation | Barre latérale verticale à gauche (burger sur mobile) |
| Assistant | Bouton flottant en bas à droite + page `/assistant`. **Même conversation** dans les deux (hook `useAssistant` appelé dans `App`). La bulle est cachée sur `/assistant`. |
| Palette | Indigo et menthe (variables dans `theme.css`) |
| Mascotte | « Skilly », SVG original (`Mascot.jsx`), humeurs `happy`, `thinking`, `sad`, `proud` |
| État partagé | Pas de Context : state dans `App`, passé par **props** |
| Persistance | Hook `useLocalStorage` (clés `skillup.favorites` et `skillup.tasks`) |
| Recherche du catalogue | `q` et `cat` gardés dans l'URL (`useSearchParams`) pour que « Retour » depuis le détail conserve la recherche |
| Git | `main` stable ; une branche par module ; messages `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:` |

Points vérifiés sur l'API Open Library : `q` doit faire **au moins 3 caractères** (sinon erreur 422) ; une recherche par `subject` seul fonctionne ; `works/{id}.json` renvoie `description` en chaîne **ou** objet `{ value }`, et `authors` ne contient que des clés (noms à récupérer via `/authors/{key}.json`) ; les couvertures redirigent vers archive.org (environ 2 s).

Règles ESLint actives (eslint-plugin-react-hooks 7) : `set-state-in-effect` et `purity` sont des **erreurs**. Appeler `setLoading(true)` dans une fonction `async` lancée par l'effet est accepté ; `Date.now()` pendant le rendu est interdit (`new Date()` est accepté).

---

## 5. Architecture actuelle

```
skillup/
├─ src/
│  ├─ components/
│  │   ├─ Sidebar.jsx         NavLink + badges + progression + burger mobile (Échap pour fermer)
│  │   ├─ Mascot.jsx          SVG de Skilly (props size, mood, animated, title ; useId)
│  │   ├─ ChatWidget.jsx      bouton flottant + panneau (utilise ChatPanel)
│  │   ├─ ChatPanel.jsx       chat réutilisé par ChatWidget ET AssistantPage
│  │   ├─ CopyButton.jsx      copier une réponse de l'IA
│  │   ├─ ResourceCard.jsx    carte livre + bouton cœur
│  │   ├─ SearchForm.jsx      formulaire contrôlé (validation 3 caractères)
│  │   ├─ CategoryFilter.jsx  filtre par domaine
│  │   ├─ Spinner.jsx, ErrorMessage.jsx, EmptyState.jsx, PageHeader.jsx, StatCard.jsx, Toast.jsx
│  │   ├─ TaskForm.jsx, TaskList.jsx, TaskItem.jsx, TaskFilters.jsx, ProgressBar.jsx
│  │   └─ ScrollToTop.jsx     remonte en haut à chaque changement de page
│  ├─ pages/                  HomePage, ResourcesPage, ResourceDetailPage, FavoritesPage,
│  │                          RevisionsPage, AssistantPage, NotFoundPage
│  ├─ services/
│  │   ├─ openLibrary.js      searchBooks, getWork, getCoverUrl, CATEGORIES, pickDomain
│  │   └─ aiService.js        askAssistant (Gemini ou Groq), getAiInfo, isAiConfigured
│  ├─ hooks/
│  │   ├─ useLocalStorage.js  useState + sauvegarde localStorage (JSON.parse protégé)
│  │   ├─ useAssistant.js     messages, loading, error, ask, retry, clear
│  │   └─ useDocumentTitle.js titre de l'onglet
│  ├─ utils/
│  │   ├─ dates.js            todayISO, addDays, daysUntil, formatDate, describeDeadline
│  │   └─ tasks.js            STATUS, TASK_FILTERS, getTaskStats, sortTasks
│  ├─ styles/theme.css
│  ├─ App.jsx                 state partagé + routes + Sidebar + ChatWidget + Toast
│  └─ main.jsx                BrowserRouter + imports CSS
├─ .env.example               modèle sans clé (à copier en .env.local)
├─ README.txt                 exigé par l'enseignante
└─ README.md                  pour GitHub
```

**Flux de données**
- `App` possède `favorites`, `tasks` (via `useLocalStorage`) et la conversation IA (via `useAssistant`), et les passe aux pages par props avec les callbacks (`onToggleFavorite`, `onAddTask`, `onToggleTask`, `onDeleteTask`, `onClearCompleted`, `onAsk`, `onRetry`, `onClear`).
- `ResourcesPage` : `books`, `total`, `page`, `loading`, `error` en state local ; `q` et `cat` dans l'URL.
- Statistiques, pourcentage de progression, listes filtrées et triées : **valeurs calculées** à chaque rendu, jamais stockées.

**Liens entre modules** (bonus) : depuis le détail d'un livre, « Planifier la lecture » crée une tâche (avec `resourceId`) et « Demander à Skilly » envoie une question à l'assistant ; l'accueil propose des questions rapides à Skilly.

---

## 6. Ce qui est fait (20 novembre)

Toutes les étapes 3 à 10 du plan initial sont codées : catalogue, détail, favoris, révisions, assistant, accueil avec statistiques, responsive, README.txt, `.env.example`. `npm run lint` et `npm run build` passent. Un test de bout en bout (navigateur automatisé) a validé : recherche, validation 3 caractères, filtre, favoris + persistance, détail (avec et sans état de navigation, id inexistant), retour qui garde la recherche, tâches (validation, ajout, bascule, filtres, suppression, persistance), assistant (bouton désactivé, chargement, erreur de clé), bulle et page qui partagent la conversation, 404, mobile sans défilement horizontal, `localStorage` corrompu.

Une revue par 4 relecteurs automatiques a ensuite été faite ; corrections appliquées : bouton « Voir plus » bloqué, actions du détail désactivées tant que les données ne sont pas chargées, questions à Skilly ignorées pendant une réponse (`ask()` renvoie maintenant `true`/`false`), `?q=` trop court ignoré, œuvres « redirect » d'Open Library suivies, délai max de 15 s sur Open Library, données `localStorage` abîmées filtrées (`isValidTask`, `isValidBook`), `createId()` (secours si `crypto.randomUUID` absent), clé d'exemple traitée comme absente, chat mobile qui débordait, focus clavier (chat, menu, suppression, formulaire), contrastes et petites corrections CSS.

Fichiers supprimés : `Navbar.jsx` (remplacé par `Sidebar.jsx`), `src/assets/hero.png` et `public/icons.svg` (restes du modèle Vite).

**Rien n'est encore commité** : tout est dans l'arbre de travail de `main`.

---

## 7. Reste à faire

1. **Relecture par les étudiants** et liste des changements souhaités.
2. ~~Tester l'assistant avec une vraie clé~~ : **fait le 20 novembre**. `.env.local` créé (clé Gemini de Yessine), réponses réelles OK, question de suivi OK. La clé a été collée dans le chat : **la régénérer après la soutenance** sur aistudio.google.com/apikey.
3. **Git** : committer (idéalement par module) et pousser ; Mouhamed fait `git pull` puis `npm install`.
4. **Comprendre le code** : explication fichier par fichier, en priorité `App.jsx`, `useLocalStorage.js`, `ResourcesPage.jsx` (useEffect + `ignore`), `TaskForm.jsx` (validation), `useAssistant.js`, `aiService.js`.
5. Répartition pour l'oral : **A** = modules 1 et 2, **B** = modules 3 et 4, 5 ensemble ; chacun doit savoir expliquer le module de l'autre.
6. **Livraison** : zip sans `node_modules` (ni `dist`, ni `.env.local`), test sur une copie propre (`npm install`, `npm run dev`).
7. **Préparation de l'oral** puis **QCM de révision sur les chapitres 5, 6 et 7** (l'écrit pèse 70 %).

---

## 8. Checklist finale

- [x] `useState` et `useEffect` utilisés, dépendances correctes (ESLint `exhaustive-deps` sans avertissement).
- [x] Aucune mutation du state (`sort` seulement sur des copies).
- [x] `key` unique et stable dans chaque `map()`.
- [x] Données et callbacks passés par props.
- [x] 7 routes (dont `/ressources/:id` et `*`), `NavLink` avec état actif.
- [x] Chargement, erreurs et résultats vides gérés.
- [x] Favoris et tâches persistés (`JSON.parse` protégé).
- [x] Clé IA uniquement dans `.env.local`, `.env.local` ignoré par Git, `.env.example` sans clé.
- [ ] Dire à l'oral : une variable `VITE_` est visible dans le code envoyé au navigateur.
- [x] Bouton « Poser la question » désactivé si vide et pendant le chargement.
- [x] Pas de Hook dans un `if`, une boucle, ni après un `return` anticipé.
- [x] `README.txt` à la racine.
- [ ] Zip sans `node_modules`, testé sur une copie propre.
- [x] `npm run build` et `npm run lint` sans erreur.
- [x] Accessibilité : `label`/`htmlFor`, `aria-label` sur les boutons-icônes, `role="alert"`, `lang="fr"`, lien d'évitement.
- [ ] **StrictMode** : en développement, les effets s'exécutent deux fois (normal, à savoir expliquer).

---

## 9. Apprentissage : où ils en sont

- **Chapitres vus avec QCM** : 1 à 4, plus un QCM de révision orienté projet.
- **Chapitre 5 (formulaires)** : expliqué, compris. Pas de QCM.
- **Chapitre 6 (API REST, fetch, async/await)** : lu mais **pas encore enseigné** : à expliquer avec `openLibrary.js` et `aiService.js`.
- **Chapitre 7 (React Router)** : expliqué à l'étape 2. Nouveautés dans le code à expliquer : `useSearchParams`, `useNavigate`, `useLocation` (state de navigation).
- **Notions nouvelles introduites par le code complet** (à expliquer) : hooks personnalisés, `useRef`, `useId`, `key` pour réinitialiser un composant, `AbortController`, `Promise.all`, `crypto.randomUUID()`, `URLSearchParams`.
- QCM : options de longueur équivalente, bonne réponse pas toujours la plus longue ni à la même place.

---

## 10. Git : mode d'emploi du binôme

- `main` reste stable. Branches `feature/...`, puis Pull Request sur GitHub et fusion.
- Après chaque `git pull` qui modifie `package.json` : **`npm install`**.
- Ne **jamais** cloner un projet dans un autre.
- Ne jamais committer `.env`, `.env.local`, `node_modules`.
