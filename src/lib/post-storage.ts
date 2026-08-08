import type { Post } from '@/types';

const CUSTOM_POSTS_KEY = 'minimalist-blogs-custom-posts';
export const POSTS_UPDATED_EVENT = 'minimalist-blogs-posts-updated';

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
  window.dispatchEvent(new Event(POSTS_UPDATED_EVENT));
}

export function getCustomPostBySlug(slug: string): Post | undefined {
  return getCustomPosts().find((post) => post.slug === slug);
}
