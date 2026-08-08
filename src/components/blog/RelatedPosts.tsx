import type { Post } from '@/types';
import BlogPostCard from '@/components/blog/BlogPostCard';

interface RelatedPostsProps {
  posts: Post[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 pt-10 border-t border-border" aria-labelledby="related-posts-title">
      <h2 id="related-posts-title" className="text-2xl font-headline font-bold mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
