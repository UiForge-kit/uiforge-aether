import type { SeedTurn } from "./types";

export const CHARGE_TURNS: SeedTurn[] = [
  {
    user: "D'accord pour l'agrégateur. Montre-moi à quoi ressemble le déclenchement d'un paiement côté serveur, avec la reprise en cas d'échec.",
    assistant: `Le point délicat n'est pas l'appel, c'est ce qui se passe après.

Un encaissement mobile money est **asynchrone par nature** : vous demandez un débit, l'opérateur envoie une notification sur le téléphone du client, et la réponse arrive plusieurs secondes — parfois plusieurs minutes — plus tard, par webhook. Votre requête initiale ne vous dit qu'une chose : la demande a été acceptée.

Trois règles qui évitent 90 % des incidents :

1. **Une référence marchand générée par vous**, unique, envoyée à chaque tentative. C'est elle qui rend l'opération idempotente, pas l'identifiant renvoyé par l'agrégateur.
2. **Le webhook fait autorité**, jamais la réponse HTTP initiale. Un \`200\` signifie « demande reçue », pas « argent encaissé ».
3. **Un statut \`pending\` explicite en base**, avec relance par interrogation si aucun webhook n'arrive dans les cinq minutes. Les notifications se perdent.

Pour la reprise, distinguez deux familles d'échec. Une erreur réseau ou un \`5xx\` de l'agrégateur se rejoue à l'identique — même référence, donc sans risque de double débit. Un refus métier (\`INSUFFICIENT_FUNDS\`, \`USER_CANCELLED\`) ne se rejoue pas : il faut une nouvelle référence, donc une nouvelle intention de paiement.

Le code ci-contre implémente les deux.`,
    reasoning: [
      {
        id: "r1",
        kind: "thinking",
        label: "Conception du flux de reprise",
        durationMs: 8_200,
        status: "done",
      },
    ],
    canvas: [
      {
        id: "cv_charge",
        title: "lib/payments/charge.ts",
        kind: "code",
        language: "typescript",
        content: `import { randomUUID } from "node:crypto";

type ChargeStatus = "pending" | "succeeded" | "failed";

interface ChargeRequest {
  amount: number;
  currency: "XAF" | "CDF";
  msisdn: string;
  provider: "airtel" | "mtn" | "orange" | "mpesa";
}

/** Refus métier : rejouer à l'identique redonnerait le même refus. */
const TERMINAL_FAILURES = new Set([
  "INSUFFICIENT_FUNDS",
  "USER_CANCELLED",
  "ACCOUNT_BLOCKED",
  "LIMIT_EXCEEDED",
]);

const MAX_ATTEMPTS = 3;

export async function createCharge(request: ChargeRequest) {
  // La référence est générée ici, pas par l'agrégateur : c'est elle qui rend
  // l'opération idempotente, y compris si notre process meurt entre-temps.
  const reference = \`chg_\${randomUUID()}\`;

  await db.charges.insert({
    reference,
    status: "pending" satisfies ChargeStatus,
    ...request,
  });

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await aggregator.collect({
        reference,
        amount: request.amount,
        currency: request.currency,
        msisdn: request.msisdn,
        provider: request.provider,
      });

      if (response.ok) {
        // Volontairement pas "succeeded" : seul le webhook fait foi.
        await db.charges.update(reference, { providerRef: response.id });
        return { reference, status: "pending" as const };
      }

      if (TERMINAL_FAILURES.has(response.code)) {
        await db.charges.update(reference, {
          status: "failed",
          failureCode: response.code,
        });
        return { reference, status: "failed" as const, code: response.code };
      }
    } catch (error) {
      // Réseau ou 5xx : la même référence protège du double débit.
      if (attempt === MAX_ATTEMPTS) throw error;
    }

    await sleep(2 ** attempt * 1000);
  }

  return { reference, status: "pending" as const };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
`,
      },
    ],
    inputTokens: 5_640,
    outputTokens: 486,
  },
];
