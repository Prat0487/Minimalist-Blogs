import type { Post } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import type { FC } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="relative w-full h-48 sm:h-56 md:h-64">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="article abstract"
          />
        </div>
      </Link>
      <CardHeader>
        <div className="mb-2">
          <Badge variant="secondary" className="mr-2">{post.category}</Badge>
          {post.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="mr-1">{tag}</Badge>
          ))}
        </div>
        <Link href={`/posts/${post.slug}`} className="block">
          <CardTitle className="font-headline text-xl md:text-2xl hover:text-accent transition-colors">
            {post.title}
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</CardDescription>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 items-center">
        <div className="flex items-center">
          <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
          {format(new Date(post.date), 'MMM d, yyyy')}
        </div>
        <div className="flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          {post.readTime}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;
