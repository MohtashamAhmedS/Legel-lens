const CHUNK_SIZE_CHARS = 1500; // ~350-400 tokens, safe for embedding model limits
const CHUNK_OVERLAP_CHARS = 200; // preserves context across chunk boundaries (e.g. a clause split mid-sentence)

/**
 * Naive but reliable character-based chunking with overlap.
 * Splitting on paragraph boundaries where possible keeps clauses intact,
 * falling back to a hard cut only when a paragraph itself is too long.
 */
export function chunkText(text) {
  const paragraphs = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const chunks = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length <= CHUNK_SIZE_CHARS) {
      current = current ? `${current}\n\n${para}` : para;
      continue;
    }

    if (current) {
      chunks.push(current);
      // carry the tail of the previous chunk forward as overlap
      current = current.slice(-CHUNK_OVERLAP_CHARS);
    }

    if (para.length > CHUNK_SIZE_CHARS) {
      // paragraph itself too long — hard-split it
      for (let i = 0; i < para.length; i += CHUNK_SIZE_CHARS - CHUNK_OVERLAP_CHARS) {
        chunks.push(para.slice(i, i + CHUNK_SIZE_CHARS));
      }
      current = "";
    } else {
      current = current ? `${current}\n\n${para}` : para;
    }
  }

  if (current.trim()) {
    chunks.push(current);
  }

  return chunks.map((text, index) => ({ text, chunkIndex: index }));
}
