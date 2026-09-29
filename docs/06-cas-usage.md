# Cas d'usage (approche éditeur de logiciel)

*Squelette à compléter : l'objectif est de repérer les cas d'usage d'une infirmière libérale en général, puis ceux propres à la facturation. Les listes ci-dessous sont des hypothèses de départ à valider et enrichir avec des IDEL.*

## Profils (personas)
| Profil | Contexte |
|---|---|
| IDEL titulaire en cabinet seul | Tournée à domicile, facture elle-même ou externalise |
| IDEL en cabinet de groupe | Partage de patientèle, facturation par cabinet |
| IDEL remplaçante | Facture en son nom ou pour la titulaire |
| Facturière indépendante | Travaille dans le logiciel de la cliente, à distance |

## A. Cas d'usage généraux d'une IDEL *(à compléter)*
- Préparer et réaliser la tournée quotidienne
- Créer et suivre un dossier patient / dossier de soins
- Gérer les ordonnances (durée, renouvellement, fin de prise en charge)
- Coordonner avec médecin, pharmacie, autres soignants
- Assurer la traçabilité des soins
- Gérer le cabinet : comptabilité, cotisations, assurances, formation continue
- Organiser remplacements et congés

## B. Cas d'usage de la facturation *(à compléter)*
| # | Cas d'usage | Acteur | Point de vigilance |
|---|---|---|---|
| B1 | Enregistrer un patient et vérifier ses droits | Facturière / IDEL | Droits à jour |
| B2 | Saisir une ordonnance | Facturière | Dates, durée, renouvellement |
| B3 | Saisir les soins réalisés | IDEL / Facturière | Lien soin réalisé ↔ acte |
| B4 | Coter les actes (NGAP) | Facturière | Règles de cumul, exceptions |
| B5 | Appliquer majorations et déplacements (IFD, IK) | Facturière | Conditions d'application |
| B6 | Facturer un BSI | Facturière | Évolutions des avenants |
| B7 | Émettre et télétransmettre les feuilles de soins | Facturière | Accès CPS |
| B8 | Gérer tiers payant, ALD, complémentaire | Facturière | |
| B9 | Suivre les retours de paiement (NOEMIE) et pointer | Facturière | Écarts |
| B10 | Traiter un rejet | Facturière | Cause : droits, administratif, cotation |
| B11 | Relancer un paiement | Facturière | |
| B12 | Faire la clôture (à préciser) | Facturière / IDEL | Calendrier |
| B13 | Facturer pendant un remplacement | Remplaçante / titulaire | Qui facture pour qui |
| B14 | Gérer un contrôle ou contentieux CPAM | IDEL | Traçabilité |
| B15 | Reporting à la cliente | Facturière | Fréquence |

## C. Cas d'usage spécifiques à Bordereau (débutante) *(à compléter)*
- Comprendre une cotation et la justifier
- S'entraîner sur des cas fictifs corrigés
- Suivre son avancement de démarrage
- Retrouver une règle ou un terme rapidement sur mobile

## Prochaine étape
Ajouter pour chaque cas : déclencheur, étapes, résultat attendu, erreurs fréquentes, priorité pour l'application.
