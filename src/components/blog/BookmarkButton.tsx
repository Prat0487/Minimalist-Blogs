"use client";

import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { getBookmarkedSlugs, toggleBookmark } from '@/lib/bookmarks';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BookmarkButtonProps {
  slug: string;
}

export default function BookmarkButton({ slug }: BookmarkButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (user) {
      setBookmarked(getBookmarkedSlugs(user.uid).includes(slug));
    } else {
      setBookmarked(false);
    }
  }, [user, slug]);

  if (!user) {
    return null;
  }

  const handleToggle = () => {
    const next = toggleBookmark(user.uid, slug);
    const isNowBookmarked = next.includes(slug);
    setBookmarked(isNowBookmarked);
    toast({
      title: isNowBookmarked ? 'Article saved' : 'Bookmark removed',
      description: isNowBookmarked
        ? 'You can find this article in your saved list on the homepage.'
        : 'This article was removed from your saved list.',
    });
  };

  return (
    <Button
      type="button"
      variant={bookmarked ? 'default' : 'outline'}
      size="sm"
      onClick={handleToggle}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? 'Remove bookmark' : 'Save article'}
    >
      <Bookmark className={`mr-2 h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
      {bookmarked ? 'Saved' : 'Save'}
    </Button>
  );
}
