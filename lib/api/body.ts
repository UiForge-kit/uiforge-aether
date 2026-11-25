export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; status: 400 | 413; error: string };

// reads chunk by chunk so an oversized body is cut off even when content-length lies or is absent
export async function readJsonBody(request: Request, maxBytes: number): Promise<JsonBodyResult> {
  const tooLarge: JsonBodyResult = { ok: false, status: 413, error: "Corps de requête trop volumineux." };

  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return tooLarge;
  if (!request.body) return { ok: false, status: 400, error: "Corps JSON invalide." };

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return tooLarge;
    }
    chunks.push(value);
  }

  const text = new TextDecoder().decode(Buffer.concat(chunks));
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, status: 400, error: "Corps JSON invalide." };
  }
}
