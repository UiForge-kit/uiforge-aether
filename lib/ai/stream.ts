import type { StreamEvent } from "@/types/ai";

// SSE transport shared by the route and the client. encode and decode live here and nowhere else

const ENCODER = new TextEncoder();

export function encodeEvent(event: StreamEvent): Uint8Array {
  return ENCODER.encode(`data: ${JSON.stringify(event)}\n\n`);
}

export const SSE_HEADERS = {
  "Content-Type": "text/event-stream; charset=utf-8",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
  // stops proxies from buffering, which would break streaming
  "X-Accel-Buffering": "no",
} as const;

export function toSSEResponse(
  events: AsyncIterable<StreamEvent>,
  signal?: AbortSignal,
): Response {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of events) {
          if (signal?.aborted) break;
          controller.enqueue(encodeEvent(event));
        }
      } catch (error) {
        if (!signal?.aborted) {
          controller.enqueue(
            encodeEvent({
              type: "error",
              code: "stream_failed",
              message: error instanceof Error ? error.message : "Erreur inconnue",
            }),
          );
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}

export async function* readSSE(response: Response): AsyncGenerator<StreamEvent> {
  if (!response.body) throw new Error("Réponse sans corps");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split("\n\n");
      buffer = frames.pop() ?? "";

      for (const frame of frames) {
        const line = frame.trim();
        if (!line.startsWith("data:")) continue;
        try {
          yield JSON.parse(line.slice(5).trim()) as StreamEvent;
        } catch {
          // unreadable frame: skip it rather than kill the stream
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
