
import BlogPostCard from '@/components/blog/BlogPostCard';
import { getAllPosts, stripHtml } from '@/lib/posts';
import type { Post } from '@/types';

interface HomePageProps {
  searchParams?: {
    q?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const allPostsRaw: Post[] = getAllPosts();
  const query = searchParams?.q?.toLowerCase() || '';

  const filteredPosts = query
    ? allPostsRaw.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        stripHtml(post.content).toLowerCase().includes(query)
      )
    : allPostsRaw;

  return (
    <div className="space-y-12">
      <section aria-labelledby="articles-title">
        <h1 id="articles-title" className="text-3xl sm:text-4xl font-headline font-bold mb-8 text-center">
          {query ? `Search Results for "${searchParams?.q}"` : 'Latest Articles'}
        </h1>
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            {query
              ? `No articles found matching "${searchParams?.q}". Try a different search term.`
              : 'No posts available yet. Check back soon!'}
          </p>
        )}
      </section>
    </div>
  );
}
