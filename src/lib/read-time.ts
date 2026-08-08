import { stripHtml } from '@/lib/posts';

const WORDS_PER_MINUTE = 200;

export function estimateReadTime(content: string): string {
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}
