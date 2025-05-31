
"use client";

import { useState, useEffect, useMemo } from 'react';
import BlogPostCard from '@/components/blog/BlogPostCard';
import { getAllPosts, stripHtml } from '@/lib/posts';
import type { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

// Removed searchParams from props
interface HomePageProps {}

export default function HomePage({}: HomePageProps) {
  const { user } = useAuth();
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  
  const currentSearchParams = useSearchParams();
  const queryFromUrl = currentSearchParams.get('q');

  const allPostsRaw: Post[] = useMemo(() => getAllPosts(), []);
  // Use queryFromUrl from the hook
  const query = queryFromUrl?.toLowerCase() || '';


  useEffect(() => {
    if (user) {
      const savedInterestsRaw = localStorage.getItem(`userInterests_${user.uid}`);
      if (savedInterestsRaw) {
        try {
          const savedInterests = JSON.parse(savedInterestsRaw);
          if (Array.isArray(savedInterests) && savedInterests.every(item => typeof item === 'string')) {
            setUserInterests(savedInterests);
          }
        } catch (error) {
          console.error("Error parsing saved interests from localStorage:", error);
          setUserInterests([]);
        }
      } else {
        setUserInterests([]); // No interests saved
      }
    } else {
      setUserInterests([]); // No user, no interests
    }
    setIsLoadingInterests(false);
  }, [user]);

  const filteredPosts = useMemo(() => {
    if (isLoadingInterests) return []; // Or a subset for skeleton loading

    let postsToFilter = allPostsRaw;

    // Filter by interests if available and user is logged in
    if (user && userInterests.length > 0) {
      postsToFilter = postsToFilter.filter(post => {
        const categoryMatch = userInterests.includes(post.category);
        const tagMatch = post.tags.some(tag => userInterests.includes(tag));
        return categoryMatch || tagMatch;
      });
    }

    // Then filter by search query if present
    if (query) {
      return postsToFilter.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        stripHtml(post.content).toLowerCase().includes(query)
      );
    }

    return postsToFilter;
  }, [allPostsRaw, query, userInterests, user, isLoadingInterests]);

  const getHomePageTitle = () => {
    if (query) return `Search Results for "${queryFromUrl}"`; // Use queryFromUrl for display
    if (user && userInterests.length > 0) return 'Your Recommended Articles';
    return 'Latest Articles';
  };
  
  const noInterestsSelected = user && userInterests.length === 0 && !query;

  return (
    <div className="space-y-12">
      <section aria-labelledby="articles-title">
        <h1 id="articles-title" className="text-3xl sm:text-4xl font-headline font-bold mb-8 text-center">
          {getHomePageTitle()}
        </h1>

        {noInterestsSelected && (
           <Alert className="mb-8 border-primary/30 bg-primary/10 text-primary-foreground">
            <Info className="h-5 w-5 text-primary" />
            <AlertTitle className="font-headline text-primary">Personalize Your Feed!</AlertTitle>
            <AlertDescription>
              You haven&apos;t selected any interests yet. 
              <Link href="/profile/interests" legacyBehavior>
                <Button variant="link" className="p-0 h-auto ml-1 text-primary hover:underline">Choose your interests</Button>
              </Link>
               to see recommended articles, or browse all posts below.
            </AlertDescription>
          </Alert>
        )}

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            {isLoadingInterests ? (
              <p>Loading articles...</p>
            ) : query ? (
              // Use queryFromUrl for display
              <p>No articles found matching &quot;{queryFromUrl}&quot;{user && userInterests.length > 0 ? " in your interests" : ""}. Try a different search term.</p>
            ) : (user && userInterests.length > 0) ? (
               <div className="flex flex-col items-center space-y-4">
                <AlertCircle className="h-12 w-12 text-primary" />
                <p className="text-lg">No articles match your selected interests right now.</p>
                <p>Try broadening your interests or check back later for new content!</p>
                <Link href="/profile/interests" legacyBehavior>
                  <Button variant="outline">Adjust Your Interests</Button>
                </Link>
              </div>
            ) : (
              <p>No posts available yet. Check back soon!</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
