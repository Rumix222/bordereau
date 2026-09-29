# Application d'apprentissage — plan du site et pistes de spécification

*Le plan du site est validé dans son principe (29/09/2026). Le détail de chaque page sera écrit avec Claude Code à partir de ce dossier.*

## Plan du site (6 pages)

| # | Page | Rôle | Documents sources |
|---|---|---|---|
| 1 | **Accueil** | Liens vers les autres pages + un espace réservé à l'information | tous |
| 2 | **Ma société** | Gestion de la société : statut, formalités, assurances, contrats, données | `01`, `05` |
| 3 | **Le métier** | Métier de facturier et quotidien de l'infirmière libérale : NGAP, BSI, télétransmission, rejets, cas d'usage, glossaire | `02`, `06` |
| 4 | **Trouver des clientes** | Recherche de clientes (infirmières), offre, tarification, suivi | `04` |
| 5 | **Simulateur de logiciel** | Simulation d'un logiciel de facturation type Albus pour s'entraîner | `03` |
| 6 | **Quiz** | Exercices pour s'entraîner et vérifier ses connaissances | `02`, `06` |

## Détail par page

### 1. Accueil
- Une carte/bouton par page (gros boutons, lecture au pouce)
- **Espace information** : affiche la **feuille de route de démarrage** (étapes avec cases à cocher, progression, prochaine étape). Décision du 29/09/2026.
- Contenu de la feuille de route à rédiger (voir `questions-ouvertes.md` n°12). Rappels réglementaires et journal des mises à jour : pistes possibles plus tard, non retenues pour l'instant.

### 2. Ma société
- Choix du statut et formalités (micro-entreprise en piste de départ)
- Assurance RC Pro, CGV, contrat de prestation, mandat
- Données patients : RGPD, sous-traitance, CPS et accès distant
- Checklist de création, décisions déjà prises

### 3. Le métier
- Le métier de facturier et le quotidien d'une infirmière libérale
- NGAP, BSI, télétransmission, rejets, clôture, routines
- Cas d'usage (profils et parcours de facturation)
- Glossaire consultable (accessible aussi depuis le menu, car transversal)

### 4. Trouver des clientes
- Réseau, démarrage avec peu de cabinets, fidélisation
- Trame d'offre et tarification, checklist d'intégration d'une cliente
- Rappel des règles de communication à vérifier
- *Rappel : pas de gestion de clientes dans l'app (décision actée). La page informe et guide, elle ne stocke pas de fichier clients.*

### 5. Simulateur de logiciel (type Albus)
- Maquette générique reproduisant les étapes clés d'un logiciel de facturation IDEL : patient, ordonnance, soins, cotation, majorations, télétransmission, retours et rejets
- Cas pratiques fictifs guidés, avec correction
- Aucune donnée patient réelle
- **Point de vigilance** : s'inspirer du fonctionnement sans copier l'interface, le nom ni les visuels d'un logiciel commercial (propriété intellectuelle). Appeler la maquette par un nom générique.

### 6. Quiz
- Questions à choix multiples par thème : NGAP et cotation, majorations et déplacements, BSI, rejets, glossaire, statut et société
- Correction commentée avec source et date de vérification
- Score et progression, niveaux de difficulté
- Lien avec le simulateur : un cas raté propose de le refaire dans la maquette

## Navigation
- Menu simple accessible partout (barre en bas ou menu déroulant sur mobile)
- Accueil en un tap depuis toutes les pages

## Contraintes
- Mobile d'abord, consultable hors ligne
- Contenu en fichiers Markdown/JSON versionnés, facile à mettre à jour (règles NGAP évolutives)
- Aucune donnée patient
- Chaque règle affichée porte sa source et sa date de vérification

## Décisions techniques (prises le 29/09/2026)
- Application web installable (PWA), hébergée sur GitHub Pages
- Progression, scores du quiz et essais du simulateur stockés localement (IndexedDB), avec sauvegarde par fichier
- Détail technique : `app/README.md`
