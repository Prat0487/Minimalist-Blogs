export function isAiConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_GENAI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY
  );
}
