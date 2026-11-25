import { minutesAgo } from "@/lib/date";
import type { Seed } from "./types";

export const STREAMING_SEED: Seed = {
  id: "conv_streaming",
  title: "Streaming SSE et annulation propre",
  modelId: "claude-opus-4-6",
  createdAt: minutesAgo(340),
  updatedAt: minutesAgo(96),
  turns: [
    {
      user: "Quand l'utilisateur clique sur « Stop » pendant un streaming, ma requête continue côté serveur et je consomme des tokens pour rien. Comment couper vraiment ?",
      assistant: `Il faut propager l'annulation sur toute la chaîne, sinon vous ne coupez que l'affichage.

**Côté client**

Un \`AbortController\` par requête. Son \`signal\` part dans le \`fetch\`, et « Stop » appelle \`abort()\`. Le \`ReadableStream\` se ferme, la boucle de lecture sort en \`AbortError\` — à attraper explicitement pour ne pas la traiter comme une panne.

**Côté route**

C'est l'étape qu'on oublie. \`request.signal\` reçoit l'annulation du client : passez-le à l'appel provider et surveillez-le dans la boucle d'émission pour arrêter d'écrire dans le stream.

**Ce qu'il reste à faire**

Le message partiel doit être conservé, pas effacé — l'utilisateur a arrêté parce qu'il en avait assez lu, pas parce qu'il voulait tout perdre. Marquez-le \`stopped\` et affichez la mention.`,
      reasoning: [
        { id: "r1", kind: "thinking", label: "Réflexion", durationMs: 6100, status: "done" },
      ],
      canvas: [
        {
          id: "cv_abort_route",
          title: "route.ts — annulation propagée",
          kind: "code",
          language: "typescript",
          content: `export async function POST(request: Request) {
  const { messages, modelId } = await request.json();

  // Le signal du client déclenche l'abandon de l'appel amont : sans lui,
  // "Stop" ne fait taire que l'affichage, pas la facturation.
  const upstream = await callProvider(modelId, messages, {
    signal: request.signal,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of upstream) {
          if (request.signal.aborted) break;
          controller.enqueue(encodeSSE(chunk));
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          controller.enqueue(encodeSSE({ type: "error", message: String(error) }));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
`,
        },
      ],
      inputTokens: 96,
      outputTokens: 356,
    },
  ],
};
