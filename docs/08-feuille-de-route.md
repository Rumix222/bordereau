# Feuille de route de démarrage

*Première version à relire (29/09/2026). Affichée sur la page d'accueil de l'application, avec cases à cocher et progression. Chaque étape a un identifiant (`P1-01`…) pour être reprise telle quelle dans l'application.*

**Règle de séquence :** les phases 1, 2 et 3 peuvent avancer en parallèle, mais **aucune facturation réelle pour une cliente (phase 5) avant d'avoir validé les prérequis obligatoires** (étapes marquées 🔒 en phase 3).

---

## Phase 1 — Apprendre le métier
- [ ] **P1-01** Lire la convention nationale des infirmiers et ses avenants récents (Ameli Pro, Légifrance)
- [ ] **P1-02** NGAP : actes principaux, cotations, conditions (AMI, AIS, DI…)
- [ ] **P1-03** NGAP : majorations, IFD, IK, règles de cumul, exceptions
- [ ] **P1-04** BSI : fonctionnement, forfaits, points de facturation
- [ ] **P1-05** Lire un dossier de soins : ordonnance, dates, durée, renouvellement
- [ ] **P1-06** Télétransmission : envoi, retours, NOEMIE, pointage
- [ ] **P1-07** Rejets : familles de causes (droits, administratif, cotation) et corrections
- [ ] **P1-08** Risques de mauvaise facturation, indus, contentieux CPAM
- [ ] **P1-09** Routines : collecte des pièces, classement, relances, rythme (tous les 15 jours proposé)
- [ ] **P1-10** Trouver une infirmière libérale qui accepte de vous laisser observer une séance de facturation
- [ ] **P1-11** Réussir le quiz par thème (objectif à fixer, par ex. 80 %)

*Fin de phase : quiz réussi et une séance de facturation observée.*

## Phase 2 — Maîtriser un logiciel
- [ ] **P2-01** Lister les logiciels IDEL (dont Albus) et ceux utilisés en Jura/Doubs
- [ ] **P2-02** Demander démos / essais et noter les conditions d'accès (→ `03-logiciels.md`)
- [ ] **P2-03** S'entraîner sur le simulateur : saisir un patient fictif, une ordonnance, des soins
- [ ] **P2-04** Simulateur : coter, appliquer majorations et déplacements
- [ ] **P2-05** Simulateur : envoyer, lire un retour, traiter un rejet
- [ ] **P2-06** Choisir le ou les logiciels sur lesquels elle sera opérationnelle

*Fin de phase : dérouler seule un cycle complet sur cas fictifs.*

## Phase 3 — Structurer la société (🔒 prérequis obligatoires)
- [ ] **P3-01** Prendre rendez-vous CCI ou comptable et confirmer le statut (piste : micro-entreprise)
- [ ] **P3-02** Vérifier plafonds, franchise de TVA, code APE, CFE
- [ ] **P3-03** Créer l'activité (guichet unique)
- [ ] **P3-04** Ouvrir un compte bancaire professionnel séparé
- [ ] **P3-05** 🔒 Souscrire une assurance RC Pro adaptée à l'activité
- [ ] **P3-06** 🔒 Rédiger CGV, contrat de prestation et mandat de facturation (avec relecture juridique)
- [ ] **P3-07** 🔒 Cadrer RGPD : contrat de sous-traitance type, confidentialité, conservation
- [ ] **P3-08** 🔒 Valider avec chaque éditeur et chaque cliente le mode d'accès distant conforme (CPS non partagée)

*Fin de phase : structure créée, assurée, contrats prêts.*

## Phase 4 — Préparer l'offre
- [ ] **P4-01** Choisir le modèle de tarification (forfait, horaire, pourcentage) et un niveau de départ
- [ ] **P4-02** Définir les 3 formules et les aligner avec le site
- [ ] **P4-03** Décrire le processus d'intégration d'une cliente (contrat, mandat, accès, RGPD)
- [ ] **P4-04** Définir le reporting envoyé à la cliente et sa fréquence
- [ ] **P4-05** Définir la gestion des rejets, relances et de la résiliation

*Fin de phase : une offre écrite et un processus d'intégration prêts à présenter.*

## Phase 5 — Visibilité et premières clientes
- [ ] **P5-01** Site : choisir et acheter le domaine, choisir l'hébergement (OVH Starter ou o2switch), publier
- [ ] **P5-02** Google Search Console et Google Business Profile
- [ ] **P5-03** Vérifier les règles de communication applicables (→ n°9)
- [ ] **P5-04** Activer le réseau soignant : anciennes collègues, remplacements
- [ ] **P5-05** Contacter cabinets et syndicats du Jura et du Doubs
- [ ] **P5-06** Signer 1 à 3 clientes tests, à tarif réduit

*Fin de phase : au moins une cliente prête à démarrer (prérequis obligatoires validés).*

## Phase 6 — Démarrer et rôder
- [ ] **P6-01** Démarrer avec peu de cabinets et sécuriser les procédures (contrôle des ordonnances, règles de cumul, relances)
- [ ] **P6-02** Tenir un journal des rejets et des erreurs : cause, correction, règle apprise
- [ ] **P6-03** Recueillir les retours des clientes
- [ ] **P6-04** Ajuster offre, tarifs et procédures
- [ ] **P6-05** Élargir progressivement sans dégrader la qualité ni la confidentialité
- [ ] **P6-06** Décider ensuite d'un éventuel passage en société ou d'une extension (autres professions)

---

## Notes pour la spécification de l'application
- Progression globale et par phase (nombre d'étapes cochées)
- Étape suivante mise en avant sur l'accueil
- Les étapes 🔒 bloquent visuellement la phase 5 tant qu'elles ne sont pas cochées
- Liens depuis chaque étape vers la page de l'app concernée (Ma société, Le métier, Simulateur, Quiz, Trouver des clientes)
- État des cases stocké localement, sans donnée sensible
