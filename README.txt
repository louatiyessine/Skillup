SKILLUP - Application web d'apprentissage
=========================================

Module : Frameworks Web (React.js) - 3eme Licence GLSI - IIT Sfax - 2026-2027
Enseignante : Ameni Hadrich

Binome :
  - Yessine Louati
  - Mouhamed Chaabouni

Option realisee : Option A (binome, perimetre complet, 5 modules)


1. PREREQUIS
------------
  - Node.js 20.19+ ou 22.12+ (recommande : Node 22 LTS ou 24 ; teste avec Node 24)
  - npm (installe avec Node.js)
  - Une connexion internet (API Open Library et API d'IA)


2. INSTALLATION
---------------
Dans un terminal, a la racine du projet (le dossier qui contient package.json) :

    npm install


3. CONFIGURATION DE L'ASSISTANT IA (.env.local)
-----------------------------------------------
La cle API n'est jamais ecrite dans le code. Elle est lue dans le fichier .env.local.

  a) Obtenir une cle gratuite Google Gemini : https://aistudio.google.com/apikey
  b) Copier le fichier .env.example et renommer la copie en .env.local
       Windows (PowerShell) :  Copy-Item .env.example .env.local
       macOS / Linux        :  cp .env.example .env.local
  c) Ouvrir .env.local et remplacer "votre_cle_ici" par la cle :

       VITE_AI_API_KEY=la_cle_obtenue
       VITE_AI_PROVIDER=gemini

  Option : pour utiliser Groq a la place de Gemini, mettre une cle Groq
  (https://console.groq.com/keys) et VITE_AI_PROVIDER=groq.
  Option : changer le modele avec VITE_AI_MODEL=nom_du_modele.

  Sans cle, toute l'application fonctionne ; seul l'assistant affiche un
  message expliquant que la cle est absente.

  Important : apres toute modification de .env.local, arreter puis relancer npm run dev.


4. LANCEMENT
------------

    npm run dev

Puis ouvrir dans le navigateur l'adresse affichee (en general http://localhost:5173).

Autres commandes :
    npm run build     construit la version de production (dossier dist)
    npm run preview   affiche la version de production
    npm run lint      verifie la qualite du code (ESLint)


5. FONCTIONNALITES
------------------
  Module 1 - Catalogue (/ressources et /ressources/:id)
    API Open Library, recherche par formulaire controle, filtre par domaine,
    detail d'une ressource, chargement, erreurs et resultats vides geres,
    bouton "Voir plus" pour charger la page suivante.

  Module 2 - Favoris (/favoris)
    Ajout / retrait depuis chaque carte (bouton coeur), sans doublon,
    persistance localStorage, filtre et tri dans la page.

  Module 3 - Revisions (/revisions)
    Taches (titre obligatoire, description, date limite, statut), formulaire
    controle avec validation, bascule du statut, suppression, filtres
    Toutes / En cours / Terminees, barre de progression, persistance localStorage.

  Module 4 - Assistant IA (/assistant + bulle flottante)
    Champ controle, bouton desactive si vide ou pendant le chargement,
    indicateur "L'assistant reflechit...", messages d'erreur clairs,
    reponse en texte brut. La bulle et la page partagent la meme conversation.

  Module 5 - Navigation et UX
    React Router (7 routes dont /ressources/:id et page 404), barre laterale
    avec NavLink (page active), menu burger sur mobile, design responsive,
    accueil avec statistiques d'activite.


6. STRUCTURE DU CODE
--------------------
  src/components   composants reutilisables (cartes, formulaires, chat...)
  src/pages        une page par route
  src/services     appels aux API (openLibrary.js, aiService.js)
  src/hooks        hooks personnalises (useLocalStorage, useAssistant...)
  src/utils        fonctions utilitaires (dates, statistiques des taches)
  src/styles       theme.css (palette, mise en page, composants)


7. NOTE DE SECURITE
-------------------
Une variable VITE_ est incluse dans le code envoye au navigateur. C'est
acceptable pour un projet etudiant ; en production, l'appel a l'IA passerait
par un serveur qui garderait la cle secrete.
