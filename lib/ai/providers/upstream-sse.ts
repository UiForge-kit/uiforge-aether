// Anthropic and OpenAI send `data: <json>` frames split by a blank line, sometimes after an `event:` line. only the json goes up
export async function* readUpstreamSSE(response: Response): AsyncGenerator<unknown> {
  if (!response.body) throw new Error("Réponse du provider sans corps");

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
        for (const line of frame.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            yield JSON.parse(payload);
          } catch {
            // truncated frame or keep-alive
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function assertOk(response: Response, provider: string): Promise<void> {
  if (response.ok) return;
  const body = await response.text().catch(() => "");
  throw new Error(`${provider} a répondu ${response.status} — ${body.slice(0, 300)}`);
}
