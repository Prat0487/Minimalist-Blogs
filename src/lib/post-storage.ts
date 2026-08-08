import type { Post } from '@/types';

const CUSTOM_POSTS_KEY = 'minimalist-blogs-custom-posts';

export function getCustomPosts(): Post[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(CUSTOM_POSTS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (post): post is Post =>
        typeof post === 'object' &&
        post !== null &&
        typeof post.slug === 'string' &&
        typeof post.title === 'string'
    );
  } catch {
    return [];
  }
}

export function saveCustomPost(post: Post): void {
  if (typeof window === 'undefined') {
    return;
  }

  const existing = getCustomPosts();
  const withoutDuplicate = existing.filter((item) => item.slug !== post.slug);
  localStorage.setItem(CUSTOM_POSTS_KEY, JSON.stringify([post, ...withoutDuplicate]));
}

export function getCustomPostBySlug(slug: string): Post | undefined {
  return getCustomPosts().find((post) => post.slug === slug);
}
