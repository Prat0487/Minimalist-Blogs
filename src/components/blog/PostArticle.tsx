import type { Post } from '@/types';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import SocialShareButtons from '@/components/blog/SocialShareButtons';
import AiSummary from '@/components/blog/AiSummary';
import ReadingProgress from '@/components/blog/ReadingProgress';
import RelatedPosts from '@/components/blog/RelatedPosts';
import BookmarkButton from '@/components/blog/BookmarkButton';
import { CalendarDays, UserCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { stripHtml } from '@/lib/posts';

interface PostArticleProps {
  post: Post;
  relatedPosts: Post[];
  siteUrl?: string;
}

export default function PostArticle({ post, relatedPosts, siteUrl }: PostArticleProps) {
  const resolvedSiteUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
  const postUrl = `${resolvedSiteUrl}/posts/${post.slug}`;
  const textContentForSummary = stripHtml(post.content);

  return (
    <>
      <ReadingProgress />
      <article className="max-w-3xl mx-auto py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="px-0 hover:bg-transparent">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to articles
            </Link>
          </Button>
        </div>

        <header className="mb-8">
          <div className="mb-4">
            <Badge variant="secondary" className="text-sm">
              {post.category}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
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
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
            <BookmarkButton slug={post.slug} />
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

        <RelatedPosts posts={relatedPosts} />
      </article>
    </>
  );
}
