
import type { Post } from '@/types';
import { getCustomPostBySlug, getCustomPosts } from '@/lib/post-storage';

const mockPosts: Post[] = [
  {
    slug: 'journey-into-minimalism',
    title: 'My Journey into the World of Minimalism',
    content: `
<p>It all started with a cluttered desk and an even more cluttered mind. I realized that the excess around me was reflecting the chaos within. Minimalism wasn't just about owning fewer things; it was about making room for more life, more peace, and more focus.</p>
<p>The first step was the hardest: letting go. I donated bags of clothes I hadn't worn in years, books I'd never read again, and countless knick-knacks that served no purpose other than collecting dust. Each item removed felt like a weight lifted.</p>
<h2 class="text-xl font-headline mt-4 mb-2">The Digital Declutter</h2>
<p>Physical decluttering was only half the battle. My digital life was equally chaotic. Unending notifications, a desktop littered with files, and an inbox overflowing with unread emails. Applying minimalist principles here meant unsubscribing aggressively, organizing files into a simple system, and turning off most notifications.</p>
<p><img src="https://placehold.co/600x400.png" alt="Clean workspace" class="my-4 rounded-md shadow-md" data-ai-hint="workspace desk" /></p>
<p>The transformation has been profound. My home is calmer, my mind clearer, and my days more intentional. This journey is ongoing, but the rewards are already immeasurable.</p>
    `,
    excerpt: 'Discover how embracing minimalism can declutter not just your space, but also your mind, leading to a more focused and peaceful life.',
    featuredImage: 'https://placehold.co/800x450.png',
    author: 'Jane Doe',
    date: '2024-07-15T10:00:00Z',
    category: 'Lifestyle',
    tags: ['Minimalism', 'Personal Growth', 'Simplicity'],
    readTime: '6 min read',
  },
  {
    slug: 'mindful-mornings',
    title: 'Crafting Mindful Mornings: A Guide to Starting Your Day with Intention',
    content: `
<p>How you start your morning can set the tone for your entire day. Instead of rushing through a chaotic routine, imagine beginning with peace, presence, and purpose. That's the power of a mindful morning.</p>
<p>My own mindful morning ritual involves a few key elements:</p>
<ul class="list-disc list-inside my-4 space-y-1">
  <li><strong>Hydration:</strong> A glass of water first thing.</li>
  <li><strong>Meditation:</strong> Just 10 minutes of quiet stillness.</li>
  <li><strong>Movement:</strong> Gentle stretching or a short walk.</li>
  <li><strong>Gratitude:</strong> Noting down three things I'm thankful for.</li>
  <li><strong>No Screens:</strong> Avoiding my phone for the first hour.</li>
</ul>
<p><img src="https://placehold.co/600x400.png" alt="Sunrise meditation" class="my-4 rounded-md shadow-md" data-ai-hint="sunrise meditation" /></p>
<p>These simple practices have transformed my days from reactive to proactive, from stressful to serene. It's not about adding more to your to-do list, but about cultivating a state of being that supports you throughout the day.</p>
    `,
    excerpt: 'Learn how to transform your mornings from chaotic to calm with simple, intentional practices that pave the way for a more productive and peaceful day.',
    featuredImage: 'https://placehold.co/800x450.png',
    author: 'John Smith',
    date: '2024-07-22T09:00:00Z',
    category: 'Well-being',
    tags: ['Mindfulness', 'Routine', 'Productivity', 'Self-care'],
    readTime: '5 min read',
  },
  {
    slug: 'the-art-of-saying-no',
    title: 'The Subtle Art of Saying No: Reclaiming Your Time and Energy',
    content: `
<p>In a world that constantly demands our attention, "yes" can feel like the default answer. But every "yes" to something is a "no" to something else – often our own priorities, well-being, or peace of mind.</p>
<h2 class="text-xl font-headline mt-4 mb-2">Why We Struggle to Say No</h2>
<p>Fear of disappointing others, missing out, or appearing unhelpful often drives us to overcommit. However, learning to say "no" gracefully is a crucial skill for maintaining boundaries and protecting our most valuable resources: time and energy.</p>
<p>Strategies for saying no effectively:</p>
<ol class="list-decimal list-inside my-4 space-y-1">
  <li><strong>Be direct and brief:</strong> A simple "I can't take that on right now" is often enough.</li>
  <li><strong>Offer an alternative (if you want):</strong> "I can't do X, but I could help with Y."</li>
  <li><strong>Don't over-apologize:</strong> You have the right to manage your commitments.</li>
  <li><strong>Buy time:</strong> "Let me check my schedule and get back to you."</li>
</ol>
<p>Mastering the art of saying no is not about being negative; it's about being intentional with your commitments, allowing you to say a more powerful "yes" to the things that truly matter.</p>
    `,
    excerpt: 'Explore the importance of setting boundaries and learn practical strategies for saying "no" to reclaim your time and energy for what truly matters.',
    featuredImage: 'https://placehold.co/800x450.png',
    author: 'Alice Brown',
    date: '2024-07-29T11:00:00Z',
    category: 'Productivity',
    tags: ['Boundaries', 'Time Management', 'Self-respect'],
    readTime: '7 min read',
  },
];

function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function mergePosts(posts: Post[]): Post[] {
  const bySlug = new Map<string, Post>();
  for (const post of posts) {
    bySlug.set(post.slug, post);
  }
  return sortPosts(Array.from(bySlug.values()));
}

export const getAllPosts = (): Post[] => {
  return mergePosts([...mockPosts, ...getCustomPosts()]);
};

export const getPostBySlug = (slug: string): Post | undefined => {
  return mockPosts.find((post) => post.slug === slug) ?? getCustomPostBySlug(slug);
};

export const getCategories = (): string[] => {
  const categories = new Set(getAllPosts().map((post) => post.category));
  return Array.from(categories).sort();
};

export const getRelatedPosts = (post: Post, limit = 3): Post[] => {
  return getAllPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag)).length;
      const sameCategory = candidate.category === post.category ? 2 : 0;
      return { candidate, score: sharedTags + sameCategory };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
};

// Helper function to strip HTML for AI summary
export const stripHtml = (html: string): string => {
  if (typeof window !== 'undefined') {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }
  return html.replace(/<[^>]+>/g, ' ').replace(/\s\s+/g, ' ').trim();
};

const generateSlug = (title: string): string => {
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  let counter = 1;
  const originalSlug = slug;
  while (getPostBySlug(slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }
  return slug;
};

export type NewPostData = Omit<Post, 'slug' | 'date'>;

export const addPost = (postData: NewPostData): Post => {
  const newSlug = generateSlug(postData.title);
  const newPost: Post = {
    ...postData,
    slug: newSlug,
    date: new Date().toISOString(),
  };
  mockPosts.unshift(newPost);
  return newPost;
};
