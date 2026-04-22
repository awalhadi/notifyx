/**
 * StreamBridge — pure utility class for reading streaming sources.
 * No circular dependency on NotifyX. The NotifyX class calls these
 * helpers to obtain async generators it pipes into DOM elements.
 * @public
 */
export class StreamBridge {
  /**
   * Yields decoded string chunks from a fetch() ReadableStream<Uint8Array>.
   */
  static async *fromUint8Stream(
    stream: ReadableStream<Uint8Array>,
    parseChunk?: (raw: string) => string
  ): AsyncGenerator<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const raw = decoder.decode(value, { stream: true });
        yield parseChunk ? parseChunk(raw) : raw;
      }
      const tail = decoder.decode();
      if (tail) yield parseChunk ? parseChunk(tail) : tail;
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Extracts text chunks from an AsyncIterable (OpenAI / Anthropic / custom).
   * Uses a heuristic extractor that handles common LLM SDK chunk shapes.
   */
  static async *fromIterable<T>(
    source: AsyncIterable<T>,
    extract?: (chunk: T) => string
  ): AsyncGenerator<string> {
    for await (const chunk of source) {
      const text = extract
        ? extract(chunk)
        : StreamBridge.extractText(chunk);
      if (text) yield text;
    }
  }

  /**
   * Yields characters from a plain string with a delay (for demos / testing).
   */
  static async *fakeStream(
    text: string,
    chunkSize = 3,
    delayMs = 28
  ): AsyncGenerator<string> {
    for (let i = 0; i < text.length; i += chunkSize) {
      yield text.slice(i, i + chunkSize);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  /**
   * Pipes any supported source into a DOM element's textContent,
   * appending each chunk. Returns the full accumulated text.
   *
   * Supported sources:
   *   - string (immediate)
   *   - Promise<string>
   *   - AsyncIterable<T>
   *   - ReadableStream<Uint8Array>  (fetch body)
   *   - ReadableStream<string>
   */
  static async pipe<T>(
    source:
      | string
      | Promise<string>
      | AsyncIterable<T>
      | ReadableStream<Uint8Array>
      | ReadableStream<string>,
    target: HTMLElement,
    onChunk?: (chunk: string, full: string) => void
  ): Promise<string> {
    let full = "";

    const append = (chunk: string) => {
      full += chunk;
      target.textContent = full;
      onChunk?.(chunk, full);
    };

    if (typeof source === "string") {
      append(source);
    } else if (source instanceof Promise) {
      append(await source);
    } else if (source instanceof ReadableStream) {
      // Detect Uint8Array vs string readable stream
      const reader = (source as ReadableStream<any>).getReader();
      const first = await reader.read();
      if (first.done) return full;
      if (first.value instanceof Uint8Array) {
        // Uint8Array stream — decode
        reader.releaseLock();
        for await (const chunk of this.fromUint8Stream(source as ReadableStream<Uint8Array>)) {
          append(chunk);
        }
      } else {
        // String stream
        append(first.value as string);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          append(value as string);
        }
        reader.releaseLock();
      }
    } else if (Symbol.asyncIterator in (source as object)) {
      for await (const chunk of source as AsyncIterable<T>) {
        const text = this.extractText(chunk);
        if (text) append(text);
      }
    }

    return full;
  }

  /**
   * Heuristic text extractor — handles common LLM SDK chunk shapes.
   */
  static extractText(chunk: unknown): string {
    if (typeof chunk === "string") return chunk;
    if (!chunk || typeof chunk !== "object") return "";
    const c = chunk as any;
    // OpenAI: chunk.choices[0].delta.content
    if (c?.choices?.[0]?.delta?.content) return c.choices[0].delta.content;
    // Anthropic: chunk.delta.text
    if (c?.delta?.text) return c.delta.text;
    // Generic text field
    if (typeof c?.text === "string") return c.text;
    if (typeof c?.content === "string") return c.content;
    return "";
  }
}
