// Shared Gemini call: model fallback, timeouts, error mapping and JSON parsing.

export class GeminiError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

// Free-tier models are often overloaded (500/503) or slow: retry once on a lighter model.
const FALLBACK_MODEL = "gemini-flash-lite-latest";
const ATTEMPT_TIMEOUT_MS = 45000;
const RETRYABLE = new Set([500, 502, 503, 504]);

class RetryableError extends Error {}

type Part = { text: string } | { inlineData: { mimeType: string; data: string } };
type GeminiResponse = { candidates?: { finishReason?: string; content?: { parts?: { text?: string; thought?: boolean }[] } }[] };

export type JsonRequest = {
  systemInstruction: string;
  parts: Part[];
  responseJsonSchema: object;
};

async function request(model: string, key: string, body: string, fetcher: typeof fetch): Promise<GeminiResponse> {
  const signal = AbortSignal.timeout(ATTEMPT_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST", signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body,
    });
  } catch {
    console.error(`[gemini] model=${model} ${signal.aborted ? "timeout" : "network error"}`);
    throw new RetryableError(signal.aborted ? "timeout" : "network");
  }
  if (!response.ok) {
    // Google's error body never contains the key; log it so configuration problems are diagnosable.
    const error = await response.json().catch(() => null) as { error?: { message?: string; status?: string; details?: { reason?: string }[] } } | null;
    const reason = error?.error?.details?.find(d => d.reason)?.reason ?? error?.error?.status ?? "";
    console.error(`[gemini] ${response.status} model=${model} ${reason}: ${error?.error?.message ?? "no message"}`);
    if (RETRYABLE.has(response.status)) throw new RetryableError(String(response.status));
    if (response.status === 429) throw new GeminiError(429, "Quota Gemini raggiunta o troppe richieste. Riprova più tardi oppure continua a mano.");
    if (response.status === 404) throw new GeminiError(503, `Il modello Gemini "${model}" non è disponibile. Imposta GEMINI_MODEL in server/.env con un modello attivo.`);
    if (reason === "API_KEY_INVALID" || response.status === 401 || response.status === 403) throw new GeminiError(503, "La chiave Gemini non è valida o non ha accesso a questo modello. Controlla GEMINI_API_KEY in server/.env.");
    if (response.status === 400) throw new GeminiError(503, "Gemini ha rifiutato la richiesta. Controlla il log del server per il dettaglio.");
    throw new GeminiError(502, "Il servizio Gemini non risponde. Riprova tra poco.");
  }
  return response.json() as Promise<GeminiResponse>;
}

/** Sends one structured-output request and returns the parsed JSON (still unvalidated). */
export async function generateJson({ systemInstruction, parts, responseJsonSchema }: JsonRequest, fetcher: typeof fetch = fetch): Promise<unknown> {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) throw new GeminiError(503, "Gemini non è ancora configurato sul server (manca GEMINI_API_KEY). Puoi compilare la ricetta a mano.");
  const models = [...new Set([process.env.GEMINI_MODEL?.trim() || "gemini-flash-latest", FALLBACK_MODEL])];
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: [{ role: "user", parts }],
    // Structured extraction needs little reasoning; Gemini 3 models are tuned for the default temperature.
    generationConfig: { thinkingConfig: { thinkingLevel: "low" }, maxOutputTokens: 16384, responseMimeType: "application/json", responseJsonSchema },
  });

  let result: GeminiResponse | undefined;
  let lastFailure = "";
  for (const model of models) {
    try { result = await request(model, key, body, fetcher); break; }
    catch (error) {
      if (!(error instanceof RetryableError)) throw error;
      lastFailure = error.message;
    }
  }
  if (!result) {
    if (lastFailure === "timeout") throw new GeminiError(504, "Gemini sta impiegando troppo tempo. Riprova tra poco.");
    if (lastFailure === "network") throw new GeminiError(502, "Impossibile contattare Gemini. Riprova tra poco.");
    throw new GeminiError(503, "Gemini è sovraccarico in questo momento. Riprova tra qualche minuto.");
  }

  const candidate = result.candidates?.[0];
  if (candidate?.finishReason !== "STOP") throw new GeminiError(422, "Gemini non ha completato la risposta. Riprova.");
  const text = candidate.content?.parts?.filter(p => !p.thought).map(p => p.text ?? "").join("");
  try { return JSON.parse(text || ""); }
  catch { throw new GeminiError(502, "La risposta di Gemini non è utilizzabile. Riprova."); }
}
