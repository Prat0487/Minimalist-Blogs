const BOOKMARKS_KEY = 'minimalist-blogs-bookmarks';

export function getBookmarkedSlugs(userId: string): string[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(`${BOOKMARKS_KEY}_${userId}`);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((slug): slug is string => typeof slug === 'string')
      : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(userId: string, slug: string): string[] {
  const current = getBookmarkedSlugs(userId);
  const next = current.includes(slug)
    ? current.filter((item) => item !== slug)
    : [...current, slug];

  localStorage.setItem(`${BOOKMARKS_KEY}_${userId}`, JSON.stringify(next));
  return next;
}

export function isBookmarked(userId: string, slug: string): boolean {
  return getBookmarkedSlugs(userId).includes(slug);
}
