import type { SeedTurn } from "./types";

export const WEBHOOK_TURNS: SeedTurn[] = [
  {
    user: "Voici notre route de webhook actuelle. Elle est en production depuis deux semaines et on a eu deux double-crédits. Tu vois le problème ?",
    userFiles: [
      {
        id: "att_webhook",
        name: "webhook-route.ts",
        mimeType: "text/typescript",
        size: 3_820,
        kind: "code",
        url: "#",
      },
    ],
    assistant: `Oui, et il y en a deux, dont un qui explique exactement vos double-crédits.

**Le bug qui vous coûte de l'argent**

Vous créditez le compte client avant d'avoir marqué la transaction comme traitée, et les deux opérations ne sont pas dans la même transaction SQL :

\`\`\`ts
await creditWallet(payload.reference, payload.amount);
await db.charges.update(payload.reference, { status: "succeeded" });
\`\`\`

Si l'agrégateur renvoie la même notification deux fois — ce qu'il fait systématiquement en cas de timeout de votre part — le second appel repasse par \`creditWallet\` puisque le statut n'a pas encore basculé. Le rejeu est la norme, pas l'exception : tous les agrégateurs réémettent jusqu'à obtenir un \`200\` rapide.

La correction tient en une clause : marquez d'abord, créditez ensuite, dans une seule transaction, et sortez si la ligne était déjà traitée.

**Le second problème, silencieux celui-là**

Vous ne vérifiez pas la signature. N'importe qui connaissant votre URL peut créditer n'importe quel compte avec un simple \`curl\`. Ça n'a pas encore été exploité, mais c'est une question de temps — ces URL finissent dans les journaux, les captures d'écran et les tickets de support.

Enfin, un détail qui deviendra un incident : vous répondez \`200\` après tout le traitement. Si le crédit prend plus de dix secondes, l'agrégateur considère l'appel échoué et réémet. Accusez réception immédiatement, traitez en tâche de fond.

Le fichier corrigé est ci-contre.`,
    reasoning: [
      {
        id: "r1",
        kind: "tool",
        label: "Lecture de 1 fichier",
        detail:
          "webhook-route.ts — 112 lignes. Points relevés : absence de vérification de signature (ligne 14), crédit avant marquage (lignes 38-41), réponse HTTP après traitement complet (ligne 96).",
        status: "done",
      },
      {
        id: "r2",
        kind: "search",
        label: "Recherche de 2 sources",
        detail:
          "politique de réémission webhook agrégateurs mobile money · délai timeout accusé de réception webhook recommandé",
        status: "done",
      },
      {
        id: "r3",
        kind: "thinking",
        label: "Vérification du scénario de double crédit",
        durationMs: 6_900,
        status: "done",
      },
    ],
    canvas: [
      {
        id: "cv_webhook",
        title: "app/api/webhooks/payments/route.ts",
        kind: "code",
        language: "typescript",
        content: `import { createHmac, timingSafeEqual } from "node:crypto";

export async function POST(request: Request) {
  const raw = await request.text();
  const signature = request.headers.get("x-webhook-signature");

  if (!signature || !isSignatureValid(raw, signature)) {
    return new Response("Signature invalide", { status: 401 });
  }

  const payload = JSON.parse(raw) as WebhookPayload;

  // Accusé de réception immédiat : au-delà de ~10 s, l'agrégateur considère
  // l'appel échoué et réémet — c'est la source des rejeux.
  queueMicrotask(() => void settle(payload));
  return new Response(null, { status: 200 });
}

async function settle(payload: WebhookPayload) {
  await db.transaction(async (tx) => {
    // Marquer AVANT de créditer, et dans la même transaction : c'est la
    // clause WHERE qui rend le rejeu inoffensif.
    const updated = await tx.charges.updateWhere(
      { reference: payload.reference, status: "pending" },
      { status: payload.status, settledAt: new Date() },
    );

    if (updated.count === 0) return; // Déjà traité : rejeu, on sort.
    if (payload.status !== "succeeded") return;

    await tx.wallets.credit(payload.customerId, payload.amount);
  });
}

function isSignatureValid(raw: string, received: string): boolean {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) throw new Error("WEBHOOK_SECRET manquant");

  const expected = createHmac("sha256", secret)
    .update(raw)
    .digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(received);

  // Longueurs différentes : timingSafeEqual lèverait au lieu de renvoyer false.
  return a.length === b.length && timingSafeEqual(a, b);
}
`,
      },
    ],
    inputTokens: 7_920,
    outputTokens: 598,
  },
];
