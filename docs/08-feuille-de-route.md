# Feuille de route de démarrage

*Première version à relire (29/09/2026). Affichée sur la page d'accueil de l'application, avec cases à cocher et progression. Chaque étape a un identifiant (`P1-01`…) pour être reprise telle quelle dans l'application.*

**Règle de séquence :** les phases 1, 2 et 3 peuvent avancer en parallèle, mais **aucune facturation réelle pour une cliente (phase 6) avant d'avoir terminé la porte de sécurité** (étapes marquées 🔒 en phase 4).

---

## Phase 1 — Cadrer les points bloquants
- [ ] **P1-01** Trouver une infirmière libérale qui accepte d'échanger et de la laisser observer sa facturation
- [ ] **P1-02** Clarifier avec elle ce que recouvre la « clôture » (mensuelle ? télétransmission ?) → `questions-ouvertes.md` n°8
- [ ] **P1-03** Comprendre comment se passe un accès distant chez elle (logiciel, CPS) → n°1
- [ ] **P1-04** Noter les réponses dans `decisions.md` et `questions-ouvertes.md`

*Fin de phase : questions n°1, 5 et 8 traitées.*

## Phase 2 — Apprendre le métier
- [ ] **P2-01** Lire la convention nationale des infirmiers et ses avenants récents (Ameli Pro, Légifrance)
- [ ] **P2-02** NGAP : actes principaux, cotations, conditions (AMI, AIS, DI…)
- [ ] **P2-03** NGAP : majorations, IFD, IK, règles de cumul, exceptions
- [ ] **P2-04** BSI : fonctionnement, forfaits, points de facturation
- [ ] **P2-05** Lire un dossier de soins : ordonnance, dates, durée, renouvellement
- [ ] **P2-06** Télétransmission : envoi, retours, NOEMIE, pointage
- [ ] **P2-07** Rejets : familles de causes (droits, administratif, cotation) et corrections
- [ ] **P2-08** Risques de mauvaise facturation, indus, contentieux CPAM
- [ ] **P2-09** Routines : collecte des pièces, classement, relances, rythme (tous les 15 jours proposé)
- [ ] **P2-10** Observer une séance de facturation chez une IDEL
- [ ] **P2-11** Réussir le quiz par thème (objectif à fixer, par ex. 80 %)

*Fin de phase : quiz réussi et une séance de facturation observée.*

## Phase 3 — Maîtriser un logiciel
- [ ] **P3-01** Lister les logiciels IDEL (dont Albus) et ceux utilisés en Jura/Doubs
- [ ] **P3-02** Demander démos / essais et noter les conditions d'accès (→ `03-logiciels.md`)
- [ ] **P3-03** S'entraîner sur le simulateur : saisir un patient fictif, une ordonnance, des soins
- [ ] **P3-04** Simulateur : coter, appliquer majorations et déplacements
- [ ] **P3-05** Simulateur : envoyer, lire un retour, traiter un rejet
- [ ] **P3-06** Choisir le ou les logiciels sur lesquels elle sera opérationnelle

*Fin de phase : dérouler seule un cycle complet sur cas fictifs.*

## Phase 4 — Structurer la société (🔒 porte de sécurité)
- [ ] **P4-01** Prendre rendez-vous CCI ou comptable et confirmer le statut (piste : micro-entreprise)
- [ ] **P4-02** Vérifier plafonds, franchise de TVA, code APE, CFE
- [ ] **P4-03** Créer l'activité (guichet unique)
- [ ] **P4-04** Ouvrir un compte bancaire professionnel séparé
- [ ] **P4-05** 🔒 Souscrire une assurance RC Pro adaptée à l'activité
- [ ] **P4-06** 🔒 Rédiger CGV, contrat de prestation et mandat de facturation (avec relecture juridique)
- [ ] **P4-07** 🔒 Cadrer RGPD : contrat de sous-traitance type, confidentialité, conservation
- [ ] **P4-08** 🔒 Valider avec chaque éditeur et chaque cliente le mode d'accès distant conforme (CPS non partagée)

*Fin de phase : structure créée, assurée, contrats prêts.*

## Phase 5 — Préparer l'offre
- [ ] **P5-01** Choisir le modèle de tarification (forfait, horaire, pourcentage) et un niveau de départ
- [ ] **P5-02** Définir les 3 formules et les aligner avec le site
- [ ] **P5-03** Décrire le processus d'intégration d'une cliente (contrat, mandat, accès, RGPD)
- [ ] **P5-04** Définir le reporting envoyé à la cliente et sa fréquence
- [ ] **P5-05** Définir la gestion des rejets, relances et de la résiliation

*Fin de phase : une offre écrite et un processus d'intégration prêts à présenter.*

## Phase 6 — Visibilité et premières clientes
- [ ] **P6-01** Site : choisir et acheter le domaine, choisir l'hébergement (OVH Starter ou o2switch), publier
- [ ] **P6-02** Google Search Console et Google Business Profile
- [ ] **P6-03** Vérifier les règles de communication applicables (→ n°9)
- [ ] **P6-04** Activer le réseau soignant : anciennes collègues, remplacements
- [ ] **P6-05** Contacter cabinets et syndicats du Jura et du Doubs
- [ ] **P6-06** Signer 1 à 3 clientes tests, à tarif réduit

*Fin de phase : au moins une cliente prête à démarrer (porte de sécurité franchie).*

## Phase 7 — Démarrer et rôder
- [ ] **P7-01** Démarrer avec peu de cabinets et sécuriser les procédures (contrôle des ordonnances, règles de cumul, relances)
- [ ] **P7-02** Tenir un journal des rejets et des erreurs : cause, correction, règle apprise
- [ ] **P7-03** Recueillir les retours des clientes
- [ ] **P7-04** Ajuster offre, tarifs et procédures
- [ ] **P7-05** Élargir progressivement sans dégrader la qualité ni la confidentialité
- [ ] **P7-06** Décider ensuite d'un éventuel passage en société ou d'une extension (autres professions)

---

## Notes pour la spécification de l'application
- Progression globale et par phase (nombre d'étapes cochées)
- Étape suivante mise en avant sur l'accueil
- Les étapes 🔒 bloquent visuellement la phase 6 tant qu'elles ne sont pas cochées
- Liens depuis chaque étape vers la page de l'app concernée (Ma société, Le métier, Simulateur, Quiz, Trouver des clientes)
- État des cases stocké localement, sans donnée sensible
