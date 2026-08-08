'use client';

import { useEffect, useState } from 'react';
import { getPostBySlug, getRelatedPosts } from '@/lib/posts';
import type { Post } from '@/types';
import PostArticle from '@/components/blog/PostArticle';
import PostGridSkeleton from '@/components/blog/PostGridSkeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

interface ClientPostLoaderProps {
  slug: string;
}

export default function ClientPostLoader({ slug }: ClientPostLoaderProps) {
  const [post, setPost] = useState<Post | null | undefined>(undefined);

  useEffect(() => {
    setPost(getPostBySlug(slug) ?? null);
  }, [slug]);

  if (post === undefined) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <PostGridSkeleton count={1} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 py-12">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold">Article Not Found</h1>
          <p className="text-muted-foreground max-w-md">
            This article may have been removed or is only available in the browser where it was created.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return <PostArticle post={post} relatedPosts={getRelatedPosts(post)} />;
}
