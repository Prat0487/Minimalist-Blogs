"use client";

import { useState, useEffect, useMemo } from 'react';
import BlogPostCard from '@/components/blog/BlogPostCard';
import PostGridSkeleton from '@/components/blog/PostGridSkeleton';
import { getAllPosts, stripHtml } from '@/lib/posts';
import { getBookmarkedSlugs } from '@/lib/bookmarks';
import { filterPostsByInterests } from '@/lib/interests';
import { POSTS_UPDATED_EVENT } from '@/lib/post-storage';
import type { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, Bookmark, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type FeedMode = 'all' | 'recommended' | 'bookmarks';

export default function HomePageContent() {
  const { user, loading: authLoading } = useAuth();
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [feedMode, setFeedMode] = useState<FeedMode>('all');
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);

  const currentSearchParams = useSearchParams();
  const queryFromUrl = currentSearchParams.get('q');
  const query = queryFromUrl?.toLowerCase() || '';

  useEffect(() => {
    const refreshPosts = () => setAllPosts(getAllPosts());
    refreshPosts();
    window.addEventListener('storage', refreshPosts);
    window.addEventListener(POSTS_UPDATED_EVENT, refreshPosts);
    return () => {
      window.removeEventListener('storage', refreshPosts);
      window.removeEventListener(POSTS_UPDATED_EVENT, refreshPosts);
    };
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (user) {
      const savedInterestsRaw = localStorage.getItem(`userInterests_${user.uid}`);
      if (savedInterestsRaw) {
        try {
          const savedInterests = JSON.parse(savedInterestsRaw);
          if (Array.isArray(savedInterests) && savedInterests.every((item) => typeof item === 'string')) {
            setUserInterests(savedInterests);
            setFeedMode(savedInterests.length > 0 ? 'recommended' : 'all');
          }
        } catch (error) {
          console.error('Error parsing saved interests from localStorage:', error);
          setUserInterests([]);
          setFeedMode('all');
        }
      } else {
        setUserInterests([]);
        setFeedMode('all');
      }
      setBookmarkedSlugs(getBookmarkedSlugs(user.uid));
    } else {
      setUserInterests([]);
      setBookmarkedSlugs([]);
      setFeedMode('all');
    }

    setIsLoadingInterests(false);
  }, [user, authLoading]);

  const categories = useMemo(() => {
    const fromPosts = new Set(allPosts.map((post) => post.category));
    return Array.from(fromPosts).sort();
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    if (isLoadingInterests || authLoading) {
      return [];
    }

    let postsToFilter = allPosts;

    if (feedMode === 'recommended' && user && userInterests.length > 0) {
      postsToFilter = filterPostsByInterests(postsToFilter, userInterests);
    }

    if (feedMode === 'bookmarks' && user) {
      postsToFilter = postsToFilter.filter((post) => bookmarkedSlugs.includes(post.slug));
    }

    if (selectedCategory) {
      postsToFilter = postsToFilter.filter((post) => post.category === selectedCategory);
    }

    if (query) {
      return postsToFilter.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          stripHtml(post.content).toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return postsToFilter;
  }, [
    allPosts,
    query,
    userInterests,
    user,
    isLoadingInterests,
    authLoading,
    selectedCategory,
    feedMode,
    bookmarkedSlugs,
  ]);

  const getHomePageTitle = () => {
    if (query) return `Search Results for "${queryFromUrl}"`;
    if (feedMode === 'bookmarks') return 'Saved Articles';
    if (feedMode === 'recommended' && user && userInterests.length > 0) return 'Your Recommended Articles';
    return 'Latest Articles';
  };

  const noInterestsSelected = user && userInterests.length === 0 && !query && feedMode !== 'bookmarks';
  const showRecommendedToggle = user && userInterests.length > 0 && !query;

  if (isLoadingInterests || authLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-headline font-bold mb-4">Latest Articles</h1>
        </div>
        <PostGridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="articles-title">
        <div className="text-center mb-8 space-y-4">
          <h1 id="articles-title" className="text-3xl sm:text-4xl font-headline font-bold">
            {getHomePageTitle()}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Thoughtful writing on minimalism, mindfulness, and intentional living.
          </p>
        </div>

        {noInterestsSelected && (
          <Alert className="mb-6 border-primary/30 bg-primary/10">
            <Info className="h-5 w-5 text-primary" />
            <AlertTitle className="font-headline text-primary">Personalize Your Feed</AlertTitle>
            <AlertDescription>
              You have not selected any interests yet.{' '}
              <Link href="/profile/interests" className="font-medium text-primary underline underline-offset-4">
                Choose your interests
              </Link>{' '}
              to see recommended articles, or browse all posts below.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-4 mb-8">
          {showRecommendedToggle && (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
              <div className="flex items-center justify-center gap-3">
                <Label htmlFor="feed-mode" className="text-sm">
                  {feedMode === 'recommended' ? 'Showing recommendations' : 'Showing all articles'}
                </Label>
                <Switch
                  id="feed-mode"
                  checked={feedMode === 'recommended'}
                  onCheckedChange={(checked) => setFeedMode(checked ? 'recommended' : 'all')}
                  aria-label="Toggle between all articles and recommendations"
                />
              </div>
              {feedMode === 'recommended' && (
                <div className="flex flex-wrap justify-center gap-2">
                  {userInterests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={feedMode === 'all' && !selectedCategory ? 'default' : 'outline'}
              onClick={() => {
                setFeedMode('all');
                setSelectedCategory(null);
              }}
            >
              All
            </Button>
            {user && (
              <Button
                type="button"
                size="sm"
                variant={feedMode === 'bookmarks' ? 'default' : 'outline'}
                onClick={() => {
                  setFeedMode('bookmarks');
                  setSelectedCategory(null);
                }}
              >
                <Bookmark className="mr-1.5 h-3.5 w-3.5" />
                Saved ({bookmarkedSlugs.length})
              </Button>
            )}
            {categories.map((category) => (
              <Button
                key={category}
                type="button"
                size="sm"
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => {
                  setSelectedCategory((current) => (current === category ? null : category));
                  if (feedMode === 'bookmarks') {
                    setFeedMode('all');
                  }
                }}
              >
                {category}
              </Button>
            ))}
          </div>

          {query && (
            <div className="text-center">
              <Badge variant="secondary">
                {filteredPosts.length} result{filteredPosts.length === 1 ? '' : 's'}
              </Badge>
            </div>
          )}
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            {query ? (
              <p>
                No articles found matching &quot;{queryFromUrl}&quot;
                {feedMode === 'recommended' && userInterests.length > 0 ? ' in your interests' : ''}. Try a different
                search term.
              </p>
            ) : feedMode === 'bookmarks' ? (
              <div className="flex flex-col items-center space-y-4">
                <Bookmark className="h-12 w-12 text-primary" />
                <p className="text-lg">You have not saved any articles yet.</p>
                <p>Browse articles and tap Save on any post you want to revisit.</p>
              </div>
            ) : feedMode === 'recommended' && user && userInterests.length > 0 ? (
              <div className="flex flex-col items-center space-y-4">
                <AlertCircle className="h-12 w-12 text-primary" />
                <p className="text-lg">No articles match your selected interests right now.</p>
                <p>Try broadening your interests or switch to all articles.</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="outline" onClick={() => setFeedMode('all')}>
                    Show All Articles
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/profile/interests">Adjust Your Interests</Link>
                  </Button>
                </div>
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
