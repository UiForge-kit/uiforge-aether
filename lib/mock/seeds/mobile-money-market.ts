import { daysAgo } from "@/lib/date";
import { thumbnail } from "./thumbnail";
import type { SeedTurn } from "./types";

export const MARKET_TURNS: SeedTurn[] = [
  {
    user: "On veut encaisser en mobile money au Congo-Brazzaville et en RDC. Voici notre cahier des charges et une capture du tunnel actuel. Quels opérateurs viser en premier, et faut-il passer par un agrégateur ?",
    userFiles: [
      {
        id: "att_cdc",
        name: "cahier-des-charges-paiement.pdf",
        mimeType: "application/pdf",
        size: 1_884_160,
        kind: "document",
        url: "#",
      },
      {
        id: "att_tunnel",
        name: "tunnel-paiement-actuel.png",
        mimeType: "image/png",
        size: 412_600,
        kind: "image",
        url: "#",
        previewUrl: thumbnail("#F26B21", "#F5A623"),
      },
    ],
    assistant: `Deux marchés, deux logiques. Ne les traitez pas comme un seul.

**Ce que dit votre cahier des charges**

Vous visez un panier moyen de 12 000 FCFA, un volume de 4 000 transactions par mois la première année, et vous excluez le stockage de données de carte. Cette dernière contrainte élimine d'office l'intégration directe d'un PSP carte : le mobile money est bien le bon choix, pas un pis-aller.

**Les opérateurs qui comptent réellement**

| Marché | Opérateur | Part estimée | API publique |
| --- | --- | --- | --- |
| Congo-Brazzaville | Airtel Money | ~55 % | Oui, via agrégateur |
| Congo-Brazzaville | MTN MoMo | ~40 % | Oui, directe |
| RDC | Orange Money | ~35 % | Oui, directe |
| RDC | M-Pesa (Vodacom) | ~30 % | Oui, directe |
| RDC | Airtel Money | ~25 % | Via agrégateur |

Couvrir les deux premiers de chaque marché vous donne environ 95 % de couverture au Congo et 65 % en RDC. Le troisième opérateur coûte autant à intégrer que les deux premiers réunis pour un gain marginal — gardez-le pour plus tard.

**Agrégateur ou intégration directe**

À 4 000 transactions par mois, l'intégration directe n'est pas rentable : comptez six à dix semaines par opérateur, plus une convention commerciale à négocier individuellement, plus un rapprochement comptable par API. Un agrégateur vous coûte 1 à 1,5 point de commission supplémentaire — soit environ 700 000 FCFA par an à votre volume — contre plusieurs mois d'ingénierie et une astreinte permanente.

Le calcul s'inverse vers 40 000 à 50 000 transactions mensuelles. Vous en êtes loin.

**Ce que je recommande**

Commencez par un agrégateur unique couvrant les quatre opérateurs, avec une couche d'abstraction de votre côté — un adaptateur par fournisseur derrière une interface commune. Le jour où un opérateur justifie une intégration directe, vous remplacez un fichier.

J'ai regroupé le comparatif détaillé dans le document ci-contre.`,
    reasoning: [
      {
        id: "r1",
        kind: "tool",
        label: "Lecture de 2 fichiers",
        detail:
          "cahier-des-charges-paiement.pdf — 14 pages, sections « Contraintes réglementaires » et « Volumétrie cible » retenues ; tunnel-paiement-actuel.png — capture 1440×900, tunnel en 3 étapes avec sortie vers page externe.",
        status: "done",
      },
      {
        id: "r2",
        kind: "search",
        label: "Recherche de 6 sources",
        detail:
          "part de marché mobile money Congo-Brazzaville 2026 · MTN MoMo Collections API disponibilité CEMAC · Vodacom M-Pesa RDC API développeur · comparatif agrégateurs paiement Afrique centrale · frais interchange mobile money BEAC · Flutterwave couverture pays Afrique francophone",
        status: "done",
      },
      {
        id: "r3",
        kind: "fetch",
        label: "Lecture de 4 pages",
        detail:
          "gsma.com — State of the Industry Report on Mobile Money 2026, chapitre Afrique centrale ; momodeveloper.mtn.com — matrice de disponibilité par pays ; developer.flutterwave.com — page « Supported countries and payment methods » ; beac.int — instruction n° 03/2025 sur les services de paiement.",
        status: "done",
      },
      {
        id: "r4",
        kind: "thinking",
        label: "Arbitrage agrégateur / direct",
        durationMs: 11_400,
        status: "done",
      },
    ],
    sources: [
      {
        id: "lnk_gsma",
        url: "https://www.gsma.com/sotir/",
        title: "State of the Industry Report on Mobile Money 2026",
        description:
          "Volumes, comptes actifs et taux de pénétration par région. L'Afrique centrale y est traitée séparément de l'Afrique de l'Est.",
        siteName: "GSMA",
        publishedAt: daysAgo(96),
      },
      {
        id: "lnk_momo",
        url: "https://momodeveloper.mtn.com/api-documentation",
        title: "MTN MoMo — Collections API",
        description:
          "Documentation de l'API d'encaissement, incluant la matrice de disponibilité pays par pays.",
        siteName: "MTN Developer",
      },
      {
        id: "lnk_beac",
        url: "https://www.beac.int/",
        title: "Instruction relative aux services de paiement dans la CEMAC",
        description:
          "Plafonds par transaction, obligations d'identification du client et délais de reversement aux marchands.",
        siteName: "BEAC",
        publishedAt: daysAgo(210),
      },
    ],
    canvas: [
      {
        id: "cv_comparatif",
        title: "Comparatif des agrégateurs",
        kind: "markdown",
        language: "markdown",
        content: `# Agrégateurs mobile money — Afrique centrale

Volume de référence : **4 000 transactions / mois**, panier moyen **12 000 FCFA**.

## Couverture opérateurs

| Agrégateur | Airtel CG | MTN CG | Orange RDC | M-Pesa RDC | Commission |
| --- | --- | --- | --- | --- | --- |
| Flutterwave | Oui | Oui | Oui | Oui | 3,0 % |
| Paystack | Non | Non | Non | Non | — |
| MaxiCash | Oui | Oui | Oui | Oui | 3,5 % |
| Intégration directe | Oui | Oui | Oui | Oui | 1,8 % + dev |

> Paystack ne couvre ni le Congo-Brazzaville ni la RDC : il reste centré sur
> le Nigeria, le Ghana, le Kenya et l'Afrique du Sud. Il est listé ici pour
> écarter la question, pas comme option.

## Coût annuel comparé

| Scénario | Commission | Ingénierie an 1 | Total an 1 |
| --- | --- | --- | --- |
| Flutterwave | 17 280 000 FCFA | 3 semaines | ~19 M FCFA |
| MaxiCash | 20 160 000 FCFA | 3 semaines | ~22 M FCFA |
| Direct (4 opérateurs) | 10 368 000 FCFA | 28 semaines | ~38 M FCFA |

## Points de vigilance

1. **Reversement** — vérifiez le délai contractuel : 48 h chez l'un, 7 jours
   chez l'autre. À votre volume, c'est un besoin en fonds de roulement.
2. **Webhooks** — exigez la signature HMAC. Sans elle, aucun moyen de
   distinguer une notification légitime d'un appel forgé.
3. **Idempotence** — imposez votre propre référence marchand sur chaque
   requête, sinon un rejeu vous facture deux fois.
4. **Devises** — le FCFA (XAF) et le franc congolais (CDF) sont deux devises
   distinctes. Ne les mélangez pas dans une même table de montants.
`,
      },
    ],
    inputTokens: 4_180,
    outputTokens: 742,
  },
];
