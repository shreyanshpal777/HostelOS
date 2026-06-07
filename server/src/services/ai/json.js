export function parseGeminiJson(text) {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();

  const firstBrace = withoutFence.indexOf('{');
  const lastBrace = withoutFence.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('Gemini did not return JSON');
  }

  return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
}
