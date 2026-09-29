# Application Facturière

Application web installable (PWA) d'apprentissage pour débuter comme facturière IDEL. Sans étape de compilation : HTML, CSS et JavaScript simples.

## Tester en local
```
cd app
python -m http.server 8000
```
Puis ouvrir http://localhost:8000.

## Publier
Chaque push sur `main` qui modifie `app/` publie automatiquement sur GitHub Pages (`.github/workflows/pages.yml`).
Après une modification du **code** (HTML/CSS/JS), incrémenter `VERSION` dans `sw.js` pour que les téléphones prennent la mise à jour. Les fichiers de `content/` et `data/` sont rechargés automatiquement dès qu'il y a du réseau.

## Où modifier quoi
| Fichier | Contenu |
|---|---|
| `content/societe.md`, `metier.md`, `clientes.md` | Texte des pages (Markdown simple ; `[à vérifier]` est mis en évidence) |
| `data/feuille-de-route.json` | Étapes de la feuille de route (`verrou: true` = prérequis obligatoire) |
| `data/glossaire.json` | Termes du glossaire (`verifie` : date de vérification ou `null`) |
| `data/quiz.json` | Questions (`bonne` = index de la bonne réponse, `casSimu` = cas lié) |
| `data/simulateur.json` | Catalogue d'actes, majorations et cas pratiques (`attendu` = solution) |
| `js/db.js` | Base de données locale (IndexedDB) et ses migrations |

## Données
Tout est stocké **sur l'appareil** (IndexedDB) : feuille de route, réponses au quiz, essais du simulateur. Rien n'est envoyé sur un serveur. La sauvegarde et la restauration par fichier existent dans le code mais sont désactivées (`SAUVEGARDE_ACTIVE` dans `js/pages/accueil.js`). **Aucune donnée patient réelle** : les cas sont fictifs.

Pour faire évoluer la base : incrémenter `DB_VERSION` dans `js/db.js` et ajouter une étape dans `MIGRATIONS`.
