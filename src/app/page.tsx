import BlogPostCard from '@/components/blog/BlogPostCard';
import { getAllPosts } from '@/lib/posts';
import type { Post } from '@/types';

export default function HomePage() {
  const posts: Post[] = getAllPosts();

  return (
    <div className="space-y-12">
      <section aria-labelledby="latest-articles-title">
        <h1 id="latest-articles-title" className="text-3xl sm:text-4xl font-headline font-bold mb-8 text-center">
          Latest Articles
        </h1>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No posts available yet. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
