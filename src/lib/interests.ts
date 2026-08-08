import type { Post } from '@/types';

export function normalizeInterest(value: string): string {
  return value.toLowerCase().trim();
}

export function postMatchesInterests(post: Post, interests: string[]): boolean {
  if (interests.length === 0) {
    return true;
  }

  const normalizedInterests = interests.map(normalizeInterest);

  const categoryMatch = normalizedInterests.includes(normalizeInterest(post.category));
  const tagMatch = post.tags.some((tag) => normalizedInterests.includes(normalizeInterest(tag)));

  return categoryMatch || tagMatch;
}

export function filterPostsByInterests(posts: Post[], interests: string[]): Post[] {
  if (interests.length === 0) {
    return posts;
  }

  return posts.filter((post) => postMatchesInterests(post, interests));
}
