import { daysAgo } from "@/lib/date";
import { thumbnail } from "./thumbnail";
import type { SeedTurn } from "./types";

export const WRAP_UP_TURNS: SeedTurn[] = [
  {
    user: "Un investisseur m'a envoyé cet article pour dire qu'on devrait attendre l'interopérabilité plutôt que d'intégrer quatre opérateurs. Qu'en penses-tu ?",
    userLinks: [
      {
        id: "lnk_interop",
        url: "https://www.gsma.com/mobilemoneymetrics/interoperability",
        title: "L'interopérabilité du mobile money change la donne en Afrique",
        description:
          "Les transferts entre opérateurs progressent de 40 % par an. Plusieurs banques centrales imposent désormais un commutateur national.",
        siteName: "GSMA Mobile Money Metrics",
        publishedAt: daysAgo(58),
      },
    ],
    assistant: `L'article est juste, et la conclusion qu'on en tire est fausse.

**Ce que l'interopérabilité résout**

Elle concerne les transferts *de personne à personne* entre opérateurs : envoyer de l'Airtel Money vers du MTN MoMo sans passer par un guichet. C'est un vrai progrès, et la trajectoire décrite est réelle.

**Ce qu'elle ne résout pas**

L'encaissement marchand. Même sur un marché pleinement interopérable, vous devez toujours être référencé comme marchand auprès de chaque opérateur pour recevoir un paiement, avec votre propre code marchand et votre propre convention. Le commutateur national route les transferts entre porte-monnaie ; il ne vous dispense pas d'exister côté acceptation.

Concrètement : au Congo, l'interopérabilité entre Airtel et MTN est effective depuis 2024 pour le P2P. Ça n'a pas réduit d'une ligne le travail d'intégration des marchands.

**Où l'investisseur a raison malgré tout**

Si l'argument était « n'intégrez pas quatre opérateurs vous-mêmes », c'est exactement ce que nous avons conclu au premier tour — sauf que le levier est l'agrégateur, pas l'interopérabilité. Vous mutualisez déjà les quatre derrière un seul contrat.

Attendre coûterait deux à trois trimestres de chiffre d'affaires pour un gain nul sur votre chaîne d'encaissement.`,
    reasoning: [
      {
        id: "r1",
        kind: "fetch",
        label: "Lecture de la page partagée",
        detail:
          "gsma.com/mobilemoneymetrics/interoperability — article daté, centré sur les transferts P2P inter-opérateurs. Aucune mention de l'acceptation marchande.",
        status: "done",
      },
      {
        id: "r2",
        kind: "search",
        label: "Recherche de 3 sources",
        detail:
          "interopérabilité mobile money Congo Airtel MTN date de mise en service · commutateur national paiement CEMAC statut · interopérabilité acceptation marchande différence P2P",
        status: "done",
      },
      {
        id: "r3",
        kind: "thinking",
        label: "Confrontation avec la recommandation du premier tour",
        durationMs: 5_100,
        status: "done",
      },
    ],
    sources: [
      {
        id: "lnk_switch",
        url: "https://www.gimac.cm/",
        title: "GIMAC — commutateur monétique et interopérabilité en zone CEMAC",
        description:
          "Périmètre du commutateur régional : transferts inter-porte-monnaie, cartes, virements. L'acceptation marchande reste contractuelle.",
        siteName: "GIMAC",
      },
    ],
    inputTokens: 9_460,
    outputTokens: 412,
  },
  {
    user: "Parfait. Fais-moi un schéma du parcours de paiement que je puisse montrer à l'équipe produit demain.",
    assistant: `Voici le parcours complet, du clic au crédit, avec les états intermédiaires que l'interface doit savoir afficher.

Le point que l'équipe produit doit retenir : **il y a un écran d'attente obligatoire**. Entre la validation du numéro et la confirmation, le client doit saisir son code secret sur son propre téléphone. Ce temps mort dure de dix secondes à deux minutes selon l'opérateur et la qualité du réseau. Si l'interface ne le montre pas explicitement, le client croit que ça a échoué et relance — d'où des demandes en double et des appels au support.

Trois états à traiter distinctement, jamais fusionnés :

- **En attente** — la demande est partie, le client n'a pas encore validé. Affichez un compte à rebours, pas un simple indicateur d'activité.
- **Expirée** — aucune validation dans le délai de l'opérateur. Proposez de renvoyer, avec une nouvelle référence.
- **Refusée** — solde insuffisant, annulation, plafond atteint. Le message doit être distinct de l'expiration, sinon le client réessaie sans corriger la cause.

Le schéma en pièce jointe reprend tout ça, avec les webhooks en pointillés.`,
    reasoning: [
      {
        id: "r1",
        kind: "thinking",
        label: "Mise en forme du parcours",
        durationMs: 7_300,
        status: "done",
      },
      {
        id: "r2",
        kind: "tool",
        label: "Génération du schéma",
        detail:
          "Rendu vectoriel 1600×900, 9 nœuds, 3 chemins d'échec, webhooks en traits discontinus. Export PNG et SVG.",
        status: "done",
      },
    ],
    outputFiles: [
      {
        id: "att_schema",
        name: "parcours-paiement-mobile-money.png",
        mimeType: "image/png",
        size: 268_400,
        kind: "image",
        url: "#",
        previewUrl: thumbnail("#3B82F6", "#8B5CF6"),
      },
      {
        id: "att_schema_svg",
        name: "parcours-paiement-mobile-money.svg",
        mimeType: "image/svg+xml",
        size: 41_200,
        kind: "image",
        url: "#",
        previewUrl: thumbnail("#8B5CF6", "#EC4899"),
      },
    ],
    inputTokens: 10_880,
    outputTokens: 394,
  },
  {
    user: "Dernière chose : rédige la spécification technique que je transmets aux devs, et sors-moi la liste des états en CSV pour qu'on la mette dans le suivi.",
    assistant: `La spécification est ci-contre, prête à être collée dans votre outil de suivi. Le CSV des états est en pièce jointe.

Deux choses que j'y ai ajoutées et qui n'étaient pas dans notre échange, parce qu'elles se paient cher si on les découvre en production :

**La table des montants doit stocker des entiers.** Le FCFA n'a pas de sous-unité, le franc congolais si. Un montant en flottant vous donnera des écarts de rapprochement au bout de quelques milliers de transactions. Stockez en plus petite unité, avec la devise sur la même ligne.

**Le rapprochement quotidien n'est pas optionnel.** Même avec des webhooks signés et idempotents, il reste toujours un résidu : notifications jamais reçues, transactions validées côté opérateur mais expirées chez vous. Un import du relevé de l'agrégateur chaque nuit, comparé à votre table, vous évite de découvrir un écart de trésorerie en fin de mois.`,
    reasoning: [
      {
        id: "r1",
        kind: "thinking",
        label: "Rédaction de la spécification",
        durationMs: 9_800,
        status: "done",
      },
    ],
    canvas: [
      {
        id: "cv_spec",
        title: "Spécification — encaissement mobile money",
        kind: "markdown",
        language: "markdown",
        content: `# Encaissement mobile money — spécification technique

**Périmètre** : Congo-Brazzaville (Airtel Money, MTN MoMo) et RDC (Orange
Money, M-Pesa), via un agrégateur unique.

## 1. Modèle de données

\`\`\`sql
CREATE TABLE charges (
  reference     text PRIMARY KEY,          -- généré par nous, idempotence
  provider_ref  text,                      -- identifiant agrégateur
  customer_id   uuid NOT NULL,
  amount_minor  bigint NOT NULL,           -- plus petite unité, jamais un float
  currency      char(3) NOT NULL,          -- XAF ou CDF
  provider      text NOT NULL,
  status        text NOT NULL,             -- voir §2
  failure_code  text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  settled_at    timestamptz
);

CREATE INDEX charges_pending_idx
  ON charges (created_at)
  WHERE status = 'pending';
\`\`\`

## 2. États

| État | Terminal | Déclencheur |
| --- | --- | --- |
| \`pending\` | Non | Demande acceptée par l'agrégateur |
| \`succeeded\` | Oui | Webhook de confirmation signé |
| \`failed\` | Oui | Refus métier de l'opérateur |
| \`expired\` | Oui | Aucune validation dans le délai opérateur |
| \`reversed\` | Oui | Annulation après encaissement |

## 3. Règles non négociables

1. La référence marchand est générée côté application, **avant** tout appel
   réseau, et rejouée à l'identique en cas d'erreur technique.
2. Le webhook fait autorité. Une réponse \`200\` à la demande initiale ne vaut
   pas encaissement.
3. Toute mutation d'état passe par un \`UPDATE … WHERE status = 'pending'\`.
   Zéro ligne affectée signifie rejeu : on sort sans effet de bord.
4. La signature HMAC est vérifiée en temps constant, sur le corps brut,
   avant tout parsing.
5. Accusé de réception du webhook en moins d'une seconde ; traitement en
   tâche de fond.

## 4. Tâches planifiées

| Tâche | Fréquence | Rôle |
| --- | --- | --- |
| Relance des \`pending\` | 5 min | Interroger l'agrégateur si aucun webhook |
| Expiration | 15 min | Basculer les \`pending\` de plus de 30 min |
| Rapprochement | Quotidien | Comparer le relevé agrégateur à \`charges\` |

## 5. Hors périmètre — phase 1

- Remboursement automatique (traitement manuel au départ)
- Paiement récurrent (aucun opérateur ne le propose de façon homogène)
- Intégration directe opérateur (à revoir au-delà de 40 000 transactions/mois)
`,
      },
    ],
    outputFiles: [
      {
        id: "att_etats",
        name: "etats-transaction.csv",
        mimeType: "text/csv",
        size: 2_140,
        kind: "document",
        url: "#",
      },
    ],
    inputTokens: 12_640,
    outputTokens: 668,
  },
];
