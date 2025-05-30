import { getPostBySlug, stripHtml } from '@/lib/posts';
import type { Post } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import SocialShareButtons from '@/components/blog/SocialShareButtons';
import AiSummary from '@/components/blog/AiSummary';
import { CalendarDays, UserCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface PostPageProps {
  params: {
    slug: string;
  };
}

// This function is needed for Next.js to know which slugs are available at build time
export async function generateStaticParams() {
  // In a real app, fetch all post slugs from your data source
  // For now, we'll use a placeholder or skip if not using mockPosts directly here
  // const posts = getAllPosts(); // Assuming getAllPosts is available here or fetched
  // return posts.map(post => ({ slug: post.slug }));
  return []; // Keep empty for now, or populate from lib/posts if needed for SSG
}


export default function PostPage({ params }: PostPageProps) {
  const post: Post | undefined = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const postUrl = `${siteUrl}/posts/${post.slug}`;
  
  // Strip HTML from content for AI summary
  const textContentForSummary = stripHtml(post.content);

  return (
    <article className="max-w-3xl mx-auto py-8">
      <header className="mb-8">
        <div className="mb-4">
          <Badge variant="secondary" className="text-sm">{post.category}</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center space-x-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <UserCircle className="h-4 w-4 mr-1.5" />
            {post.author}
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1.5" />
            {post.readTime}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </header>

      {post.featuredImage && (
        <div className="relative w-full h-64 sm:h-80 md:h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 768px, 1000px"
            className="object-cover"
            data-ai-hint="article hero"
          />
        </div>
      )}
      
      <div 
        className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none font-body 
                   prose-headings:font-headline prose-headings:text-foreground 
                   prose-p:text-foreground/90 prose-li:text-foreground/90
                   prose-a:text-accent hover:prose-a:text-primary prose-strong:text-foreground
                   prose-img:rounded-md prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      <AiSummary blogPostContent={textContentForSummary} />

      <div className="mt-12 pt-8 border-t border-border">
        <SocialShareButtons url={postUrl} title={post.title} />
      </div>
    </article>
  );
}
