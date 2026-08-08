import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/posts';
import { isAiConfigured } from '@/lib/ai-config';
import type { Metadata } from 'next';
import ClientPostLoader from '@/components/blog/ClientPostLoader';
import PostArticle from '@/components/blog/PostArticle';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article | Minimalist Blogs',
    };
  }

  return {
    title: `${post.title} | Minimalist Blogs`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
      type: 'article',
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return <ClientPostLoader slug={slug} />;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

  return (
    <PostArticle
      post={post}
      relatedPosts={getRelatedPosts(post)}
      siteUrl={siteUrl}
      aiSummariesEnabled={isAiConfigured()}
    />
  );
}
