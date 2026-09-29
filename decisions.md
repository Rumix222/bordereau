# Décisions

| Date | Décision | Remarque |
|---|---|---|
| 2026-09 | Marque : **Bordereau** | |
| 2026-09 | Zone cible : Franche-Comté (Jura, Doubs) | Extension possible plus tard |
| 2026-09 | L'application sert à **apprendre et s'organiser pour débuter** | Pas de gestion de clientes ni de factures dans l'app |
| 2026-09 | Accès à la facturation **via le logiciel de chaque infirmière, en accès distant** | Voir questions ouvertes n°1 (conditions éditeurs, CPS) |
| 2026-09 | Statut : pas encore arrêté. Piste de départ : **micro-entreprise** (personne seule, petit chiffre d'affaires) | À valider avec CCI / comptable |
| 2026-09 | Diffusion du dossier : mobile d'abord (l'utilisatrice consulte sur Android) | Test possible sur iPhone/Safari |
| 2026-09 | Site vitrine : prototype HTML existant, domaine de marque plutôt que géographique, hébergement OVH Starter ou o2switch | Le site ne stocke aucune donnée patient |
| 2026-09 | Démarche : créer la structure, maîtriser le métier et un logiciel, trouver quelques premières clientes | Démarrer avec peu de cabinets |
| 2026-09 | Plan du site en 6 pages : Accueil (+ espace information), Ma société, Le métier, Trouver des clientes, Simulateur de logiciel, Quiz | Détail dans `docs/07-app-apprentissage.md` |
| 2026-09 | L'espace information de l'accueil affiche la **feuille de route de démarrage** (cases à cocher, progression) | Contenu de la feuille de route à rédiger |
| 2026-09 | Feuille de route en 7 phases, avec une porte de sécurité : aucune facturation réelle avant assurance RC Pro, contrats et cadrage RGPD/CPS | Première version à relire : `docs/08-feuille-de-route.md` |
| 2026-09-29 | Application : **web installable (PWA)**, publiée sur **GitHub Pages** | Code dans `app/`, publication automatique à chaque push |
| 2026-09-29 | Données de l'app stockées **sur l'appareil** (base IndexedDB) : progression, scores du quiz, essais du simulateur | Sauvegarde/restauration par fichier ; schéma versionné pour évoluer. Base en ligne à envisager seulement si besoin de synchroniser plusieurs appareils |
| 2026-09-29 | Simulateur nommé **SimuSoins** (nom générique) | Ne copie ni l'interface ni le nom d'un logiciel commercial |
